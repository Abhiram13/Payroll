import * as http from 'http';
import { StatusCodes } from '../types/login.types';

export type Request = http.IncomingMessage & {body: any, params: any};
export type Response = http.ServerResponse & {locals: any};
type Middleware = (request: Request, response: Response) => void;
export type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

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
   #httpServer: http.Server = new  http.Server();

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
            response?.write('Route not found/ does not exist');
            response?.end();
            return;
         }
   
         const middlewaresInitiation = () => {
            for (var i = 0; i < api?.handler?.length; i++) {
               api.handler[i]?.(request, response);
               const isResponseEnded: boolean = response?.writableEnded;
   
               if (isResponseEnded) break;
            };
         };
   
         if (method === 'POST') { // this is for both POST and PUT             
            request.on('data', (chunk: Buffer) => {
               const data = chunk?.toString();
               const json = JSON.parse(data);
               request.body = json;               
            }).on('end', () => {
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
            });
         } else {
            middlewaresInitiation();
         }               
      });
   };

   close() {
      this.#httpServer.close();
   }
}

export const server = new Server();
