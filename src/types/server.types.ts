import {IncomingMessage, ServerResponse, AddressInfo} from "./export.types";

export type Request = IncomingMessage & {body: any, params: any};
export type Response = ServerResponse & {locals: any, json(status: StatusCode, body: any): void};

/**
* Contains list of Http Methods - `GET`, `POST`, `PUT` and `DELETE`
*/
export enum Method {
   GET = 'GET',
   POST = 'POST',
   PUT = 'PUT',
   DELETE = 'DELETE'
}

export enum StatusCode {
   OK = 200,
   CREATED = 201,
   NO_DATA = 204,
   NOT_MODIFIED = 304,
   BAD_REQUEST = 400,
   UNAUTHORISE = 401,
   FORBIDDEN = 403,
   NOT_FOUND = 404,
   SERVER_ERROR = 500,
   TIMEOUT = 504,
}

export namespace RouterNameSpace { 
   /**
    * Type that defines the signature of the methods that work with http request & response cycles
    * @param {Request} request - Http request object that got extended with object `locals: any` which acts as common storage variable through out the request-response cycle
    * @param {Response} response - Http response object that got extended with method `json()` that automatically converts given payload into json type  
    * and attaches `Content-Type` header to `application/json` as default
    * @returns void - Sends response to the client or goes to next middleware
    */
   export type Middleware = (request: Request, response: Response) => void;

   /**
    * Type that defines signature of methods like `GET`, `POST`, `PUT` and `DELETE`
    * @param {string} url - URL of the API End point. Appends provided URL to its parent URL to create complete end point.
    * @param {Middleware[]} middlewares - Array of middlewares that gets processed in the provided URL end point
    */
   type HttpMethodAttributes = (url: string, ...middlewares: Middleware[]) => void;

   /**
    * Attributes or Type used at `use()` method from the **Router** class. Used as parent router<br><br>
    * #### List of Properties:
    * 
    * ```typescript
    * path: string,
    * router: IRouter,
    * middlewares: Middleware[] | undefined,
    * ```
    */
   export interface IRouterAttributes {
      path: string;
      router: IRouter;
      middlewares?: Middleware[];
   }

   /**
    * Type that defines the object structure that process array of middlewares for the given `url` and `method` like `GET`, `POST`, `PUT` or `DELETE`
    */
   export interface IRouterHandlers {
      method?: Method;
      url: string;
      handler: Middleware[];
      params?: {[key: string]: any}[];
   }

   /**
    * Interface that gets implemented by `Router` class
    */
   export interface IRouter {
      /**
       * List of all middlewares for the given `url` and `method`
       */
      routeHandlers: IRouterHandlers[];

      /**
       * method that used for `GET` request
       */
      get: HttpMethodAttributes;

      /**
       * method that used for `POST` request
       */
      post: HttpMethodAttributes;

      /**
       * method that will be used for initial routing
       */
      use: (attributes: IRouterAttributes) => void;
   }
}

export namespace ServerNameSpace {
   export interface IServer {
      address(): string | AddressInfo | null;
      close(): void;
      listen(port: number, callback: () => void): void;
   }

   export interface IResponseJson<T> {
      statusCode: number;
      httpCode: number;
      body: T;
   }
}