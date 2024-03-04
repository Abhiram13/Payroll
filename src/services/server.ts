import {RouterNameSpace, ServerNameSpace, Server, Request, Response, IncomingMessage, ServerResponse, Method, StatusCode} from "../types/export.types";
import {Router} from "./export.services";

class PayrollServer extends Router implements ServerNameSpace.IServer, RouterNameSpace.IRouter {
   #httpServer: Server;
   routeHandlers: RouterNameSpace.IRouterHandlers[];

   constructor () {
      super();
      this.#httpServer = new Server({ServerResponse: MyResponse});
      this.routeHandlers = [];
   }

   address() {
      return this.#httpServer.address();
   }

   close() {
      this.#httpServer.close();
   }

   async #processMiddlewares(api: RouterNameSpace.IRouterHandlers, request: Request, response: Response): Promise<void> {
      for (var i = 0; i < api?.handler?.length; i++) {
         await api?.handler[i]?.((request as Request), (response as Response));
         const isResponseEnded: boolean = !!response?.writableEnded;

         if (isResponseEnded) break;
      }
   }

   #onData(chunk: Buffer, request: Request): void {
      try {
         const dataFromString = chunk?.toString();
         const payload: any = JSON.parse(dataFromString);    
         (request as Request).body = payload;
      } catch (e: any) {
         (request as Request).body = null;
      }
   }

   #onEnd(api: RouterNameSpace.IRouterHandlers, request: Request, response: Response): void {
      if (!request?.body) {
         response?.json(StatusCode.BAD_REQUEST, {
            statusCode: StatusCode.BAD_REQUEST,
            message: "Invalid payload",
         });
         return;
      }

      this.#processMiddlewares(api, request, response);
   }

   #validateEndPointUrl(currentUrl: string, urlInMiddleware: string, params = {}, request: Request): boolean {
      let splitOfMiddlewareUrl: string | string[] = urlInMiddleware?.split("/"), splitOfRequestUrl: string | string[] = currentUrl?.split("/"), queryParams = params;

      for (var i = 0; i < splitOfMiddlewareUrl?.length; i++) {
         if (splitOfMiddlewareUrl[i]?.startsWith(":")) {
            const key = splitOfMiddlewareUrl[i]?.replace(":", "");

            splitOfMiddlewareUrl[i] = splitOfRequestUrl[i];

            queryParams = {
               ...queryParams,
               [key]: splitOfRequestUrl[i] || '',
            };
         }
      }

      splitOfMiddlewareUrl = splitOfMiddlewareUrl?.join("/");
      splitOfRequestUrl = splitOfRequestUrl?.join("/"); 

      const isSameUrl: boolean = splitOfMiddlewareUrl === splitOfRequestUrl;

      if (request && isSameUrl) {
         request.params = {...request.params, ...queryParams};
      }

      return isSameUrl;
   }

   listen(port: number, callback: () => void): void {
      this.#httpServer.timeout = 20 * 1000;
      this.#httpServer.listen(port, callback);
      this.#httpServer.on('request', (request: Request, response: Response) => {
         const url: string | undefined = request?.url as string;
         const method: Method | undefined = request?.method as Method;
         const api: RouterNameSpace.IRouterHandlers | undefined = this.routeHandlers?.filter(h => this.#validateEndPointUrl(url, h.url, h.params, request) && h?.method === method)?.[0];

         if (!api) {
            response.json(StatusCode.NOT_FOUND, {statusCode: StatusCode.NOT_FOUND, message: "Route is not found/ invalid"});
            return;
         }

         if (request?.method === Method.POST || request?.method === Method.PUT) {
            request
               ?.on('data', chunk => this.#onData(chunk, request))
               ?.on('end', () => this.#onEnd(api, request, response));
         } else {
            this.#processMiddlewares(api, request, response);
         }
      });
   }
}

class MyResponse<Request extends IncomingMessage = IncomingMessage> extends ServerResponse<Request> {
   #content_type: string = "application/json";

   locals = {};

   json(status: number, body: any): void {
      this.setHeader('Content-Type', this.#content_type);

      try {
         const res = JSON.stringify(body);
         this.statusCode = status || 200;
         this.write(res);
      } catch(e: any) {
         this.statusCode = 500;
         this.write(JSON.stringify({message: e?.message || e}));
      }

      this.end();
   }
}

export const server = new PayrollServer();