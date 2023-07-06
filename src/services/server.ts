import * as http from 'http';

type Request = http.IncomingMessage & {body: any};
type Response = http.ServerResponse;
type Middleware = (request: Request, response: Response) => void;
type Methods = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface IRoutingHandlers {
   method?: Methods;
   url: string;
   handler: Middleware[];
};

interface IServer extends IRouter {
   listen: (port: number) => void;
   router: (router: Router) => void;
}

interface IRouter {
   get: (url: string, ...middlewares: Middleware[]) => void;
   post: (url: string, ...middlewares: Middleware[]) => void;
   handlers?: IRoutingHandlers[] | undefined;
   // use: (path: string, ...middlewares: Middleware[]) => void;
}

const MyServer: http.Server = new http.Server();
const handlers: IRoutingHandlers[] = [];

// registers GET request api handlers
function getMethod(url: string, ...middlewares: Middleware[]) {
   handlers?.push({
      url: url,
      method: 'GET',
      handler: middlewares,
   });
};

// registers POST request api handlers
function postMethod(url: string, ...middlewares: Middleware[]) {
   handlers?.push({
      url: url,
      method: 'POST',
      handler: middlewares,
   });
};

function routerMethod(router: Router) {};

function listenMethod(port: number = 3000) {
   MyServer.listen(port);
   
   MyServer.on('request', (req: Request, res: Response) => {
      let request = req;
      let response = res;

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
            request.body = chunk.toString();
            middlewaresInitiation(); // calling here again because this function is getting called even before 'data' event is triggered
         });
      } else {
         middlewaresInitiation();
      }               
   });
};

export const server: IServer = {
   get: getMethod,
   post: postMethod,
   listen: listenMethod,
   router: routerMethod,
}

export class Router {
   #path: string;
   #middlewares: Middleware[];

   constructor (path: string, ...middlewares: Middleware[]) {
      this.#path = path;
      this.#middlewares = middlewares;
   }

   get(url: string = '/', ...middlewares: Middleware[]) {      
      handlers?.push({
         url: this.#path + url,
         method: 'GET',
         handler: [...this.#middlewares, ...middlewares],
      });
   };

   post(url: string, ...middlewares: Middleware[]) {
      handlers?.push({
         url: this.#path + url,
         method: 'POST',
         handler: [...this.#middlewares, ...middlewares],
      });
   };
}