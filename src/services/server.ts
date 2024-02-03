import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import { StatusCodes } from '../types/login.types';

export type Request = http.IncomingMessage & {body: any, params: any};
export type Response = MyResponse & {locals: any};
type Middleware = (request: Request, response: Response) => void;
export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

const key = path.resolve(__dirname, '../../', './client-key.pem');
const cert = path.resolve(__dirname, '../../', './client-cert.pem');

interface IRouterMiddleWare {
   path: string;
   middlewares?: Middleware[] | undefined;
   router: Router;  
}

interface IRoutingHandlers {
   method?: Methods;
   url: string;
   handler: Middleware[];
};

const handlers: IRoutingHandlers[] = [];

class MyResponse<Request extends http.IncomingMessage = http.IncomingMessage> extends http.ServerResponse<Request> {
   #content_type: string = "application/json";

   locals = {};

   #parsing(stringifiedBody: any) {
      try {
         let check = JSON.parse(stringifiedBody);
      } catch (e) {
         
      }
   }

   json(body: any): void {
      try {
         const stringifiedBody: string = typeof body !== 'string' ? JSON.stringify(body) : body;         
         this.setHeader('Content-Type', this.#content_type);
         this.write(stringifiedBody);
         this.end();
      } catch (e) {
         this.statusCode = StatusCodes.SERVER_ERROR;
         this.write(`{ "statusCode": ${StatusCodes.SERVER_ERROR}, "message": "Some internal error at parsing given response" }`);
         this.end();
      }    
   }
}

export class Router {
   routeHandlers: IRoutingHandlers[] = [];

   get(url: string = '/', ...middlewares: Middleware[]) {
      this.routeHandlers?.push({handler: middlewares, url, method: 'GET'});
   };

   use({path, router, middlewares = []}: IRouterMiddleWare) {
      router.routeHandlers.map(child => [
         this.routeHandlers.push({
            url: path + child?.url,
            method: child?.method,
            handler: [...middlewares, ...child?.handler]
         })
      ]);
   }

   post(url: string, ...middlewares: Middleware[]) {
      this.routeHandlers?.push({
         url,
         method: 'POST',
         handler: middlewares,
      });
   };
}

class Server {
   // RUN COMMAND TO START NODE SERVER ==> npm run node SSL=true || SSL=true npm run node

   #httpServer: http.Server | https.Server = process.env.SSL !== 'true' ? new http.Server({ServerResponse: MyResponse}) : new https.Server({
      key: fs.readFileSync(key, 'utf-8'),
      cert: fs.readFileSync(cert, 'utf-8'),
   });

   get(url: string, ...middlewares: Middleware[]) {
      handlers?.push({
         url: url,
         method: 'GET',
         handler: middlewares,
      });
   };

   post(url: string, ...middlewares: Middleware[]) {
      handlers?.push({
         url: url,
         method: 'POST',
         handler: middlewares,
      });
   };

   use({path, middlewares = [], router}: IRouterMiddleWare) {
      router.routeHandlers.map(({handler, url, method}) => {
         handlers?.push({
            handler: [...middlewares, ...handler],
            url: path + url,
            method,
         })
      });
   };

   address() {
      return this.#httpServer.address();
   }

   close() {
      this.#httpServer.close();
   }

   // #onRequest(req: Request, res: Response) {
   //    const request = req;
   //    const response = res;
   //    const url: string | undefined = request?.url;
   //    const method: Methods | undefined = request?.method as Methods;
   //    const api: IRoutingHandlers | undefined = handlers?.filter(h => h?.url === url && h?.method === method)[0];
   // }

   listen(port: number = 3000, callback: () => void) {
      const seconds = 1000;

      // if API response not sent during this time, server will throw timeout error
      this.#httpServer.timeout = 20 * seconds;
      this.#httpServer.listen(port, callback);   
      this.#httpServer.on('request', (req: Request, res: Response) => {
         let request = req;
         let response = res;

         response.locals = {};
   
         const url: string | undefined = request?.url;
         const method: Methods | undefined = request?.method as Methods;
         const api: IRoutingHandlers | undefined = handlers?.filter(h => h?.url === url && h?.method === method)[0];
   
         response.setHeader('Content-Type', 'application/json'); // setting it by default
   
         if (!api) {
            response.statusCode = 404;
               response?.write({ statusCode: 404, message: "Route not found/ does not exist" });
               response?.end();
               return;
            // response.json("Route not found/ does not exist");
         }         
   
         const middlewaresInitiation = () => {
            for (var i = 0; i < api?.handler?.length; i++) {
               api.handler[i]?.(request, response);
               const isResponseEnded: boolean = response?.writableEnded;
   
               if (isResponseEnded) break;
            };
         };

         const onData = (chunk: Buffer): void => {
            try {
               const data = chunk?.toString();
               const json = JSON.parse(data);
               request.body = json;
            } catch (e) {
               request.body = null;
            }
         };

         const onEnd = (): void => {
            if (!request?.body) {
               response.statusCode = StatusCodes.BAD_REQUEST;
               response.write(JSON.stringify({
                  status: 500,
                  error: false,
                  message: "Invalid/ Empty payload"
               }));
               response.end();
            } else {
               middlewaresInitiation(); // calling here again because this function is getting called even before 'data' event is triggered
            }
         }
   
         if (method === 'POST') { // this is for both POST and PUT
            request.on('data', onData).on('end', onEnd);
         } else {
            middlewaresInitiation();
         }               
      });
   };
}

export const server = new Server();
