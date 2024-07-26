import {RouterNameSpace, ServerNameSpace, Server, Request, Response, IncomingMessage, ServerResponse, Method, StatusCode} from "../types/export.types";
import {Logger, Router, PayloadError} from "./export.services";

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
      try {
         for (var i = 0; i < api?.handler?.length; i++) {
            await api?.handler[i]?.((request as Request), (response as Response));
            const isResponseEnded: boolean = !!response?.writableEnded;

            if (isResponseEnded) break;
         }
      } catch (e: any) {
         Logger.error(e, 'Caught at #processMiddleware');
         response.json(StatusCode.SERVER_ERROR, {status: StatusCode.SERVER_ERROR, error: true, message: e?.message});
         return;
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
      try {
         if (!request?.body) {
            response?.json(StatusCode.BAD_REQUEST, {
               status: StatusCode.BAD_REQUEST,
               message: "Invalid payload",
            });
            return;
         }

         new Sanitise(request?.body).init();

         this.#processMiddlewares(api, request, response);
      } catch (e: any) {
         const error: Error = e;
         response?.json(StatusCode.BAD_REQUEST, {
            status: StatusCode.BAD_REQUEST,
            message: "Invalid payload",
         });
         return;
      }
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
      this.#httpServer.listen(port, callback)
      .on('error', (error) => {
         const msg: string = "EADDRINUSE";
         const val: string = error.message?.split(":")?.[0]?.split(" ")?.[1] || "";

         if (val === msg) {
            Logger.warn(`Server already running on given PORT: ${port} with PID: ${process.pid}. So, killing the process`);
            process.kill(process.pid);
            process.exit(1);
            return;
         }
      });
      
      this.#httpServer.on('request', (request: Request, response: Response) => {
         response.setHeader("Access-Control-Allow-Origin", (request?.headers?.origin || "*"));
         response.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
         response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");

         if (request?.method === 'OPTIONS') {
            response.writeHead(StatusCode.OK);
            response.end();
            return;
         }

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
   readonly #content_type: string = "application/json";

   locals = {};

   json(status: number, body: any): void {      
      this.setHeader('Content-Type', this.#content_type);      

      try {
         const res = JSON.stringify(body);
         this.statusCode = status || StatusCode.OK;
         this.write(res);
      } catch(e: any) {
         this.statusCode = StatusCode.SERVER_ERROR;
         this.write(JSON.stringify({message: e?.message || e}));
      }

      this.end();
   }
}

class Sanitise {
   private regex: RegExp = /^\$/;
   constructor (private payload: any) {}

   private objectSanitise(object: any) {
      for (var key in object) {
         if (this.regex.test(key)) {
            throw new PayloadError('Invalid data provided');
         }

         if (object[key]?.constructor === Object) {
            this.objectSanitise(object[key]);
         }

         if (object[key]?.constructor === Array) {
            this.arraySanitise(object[key]);
         }
      }
   }

   private arraySanitise(array: any[]) {
      array.map(value => {
         if (value?.constructor === Object) {
            this.objectSanitise(value);
         }

         if (value?.constructor === Array) {
            this.arraySanitise(value);
         }
      });
   }

   public init() {
      if (this.payload?.constructor === Object) {
         this.objectSanitise(this.payload);
      }

      if (this.payload?.constructor === Array) {
         this.arraySanitise(this.payload);
      }
   }
}

export const server = new PayrollServer();