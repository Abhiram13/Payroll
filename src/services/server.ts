import {RouterNameSpace, ServerNameSpace, Server, Request, Response, IncomingMessage, ServerResponse, Method, StatusCode} from "../types/export.types";
import {Router} from "./export.services";

class PayrollServer extends Router implements ServerNameSpace.IServer, RouterNameSpace.IRouter {
   #httpServer: Server;
   #request: Request | null;
   #response: Response | null;
   routeHandlers: RouterNameSpace.IRouterHandlers[];

   constructor () {
      super();
      this.#httpServer = new Server({ServerResponse: MyResponse});
      this.routeHandlers = [];
      this.#request = null;
      this.#response = null
   }

   address() {
      return this.#httpServer.address();
   }

   close() {
      this.#httpServer.close();
   }

   #processMiddlewares(api: RouterNameSpace.IRouterHandlers): void {
      for (var i = 0; i < api?.handler?.length; i++) {
         api?.handler[i]?.((this.#request as Request), (this.#response as Response));
         const isResponseEnded: boolean = !!this.#response?.writableEnded;

         if (isResponseEnded) break;
      }
   }

   #onData(chunk: Buffer): void {
      try {
         const dataFromString = chunk?.toString();
         const payload: any = JSON.parse(dataFromString);    
         (this.#request as Request).body = payload;
      } catch (e: any) {
         (this.#request as Request).body = null;
      }
   }

   #onEnd(api: RouterNameSpace.IRouterHandlers): void {
      if (!this.#request?.body) {
         this.#response?.json(StatusCode.BAD_REQUEST, JSON.stringify({
            statusCode: StatusCode.BAD_REQUEST,
            message: "Invalid payload",
         }));
         return;
      }

      this.#processMiddlewares(api);
   }

   #validateEndPointUrl(currentUrl: string, urlInMiddleware: string, params = {}): boolean {
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

      if (this.#request && isSameUrl) {
         this.#request.params = {...this.#request.params, ...queryParams};         
      }

      return isSameUrl;
   }

   listen(port: number, callback: () => void): void {
      this.#httpServer.timeout = 20 * 1000;
      this.#httpServer.listen(port, callback);
      this.#httpServer.on('request', (req: Request, res: Response) => {
         this.#request = req; 
         this.#response = res;

         const url: string | undefined = this.#request?.url as string;
         const method: Method | undefined = this.#request?.method as Method;
         const api: RouterNameSpace.IRouterHandlers | undefined = this.routeHandlers?.filter(h => this.#validateEndPointUrl(url, h.url, h.params) && h?.method === method)?.[0];

         if (!api) {
            this.#response.json(StatusCode.NOT_FOUND, {statusCode: StatusCode.NOT_FOUND, message: "Route is not found/ invalid"});
            return;
         }

         if (this.#request?.method === Method.POST || this.#request?.method === Method.PUT) {
            this.#request
               ?.on('data', chunk => this.#onData(chunk))
               ?.on('end', () => this.#onEnd(api));
         } else {
            this.#processMiddlewares(api);
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