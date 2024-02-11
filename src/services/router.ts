import {RouterNameSpace, ServerNameSpace, Server, Request, Response, Method} from "../types/export.types";

export class Router implements RouterNameSpace.IRouter {
   routeHandlers: RouterNameSpace.IRouterHandlers[];

   constructor() {
      this.routeHandlers = [];
   }

   get(url: string, ...middlewares: RouterNameSpace.Middleware[]): void {
      this.routeHandlers?.push({ url, method: Method.GET, handler: middlewares });
   }

   post(url: string, ...middlewares: RouterNameSpace.Middleware[]): void {
      this.routeHandlers.push({ url, method: Method.POST, handler: middlewares });
   }

   use(attributes: RouterNameSpace.IRouterAttributes): void {
      const { middlewares, path, router } = attributes;
      const handles: RouterNameSpace.Middleware[] = middlewares || [];

      router?.routeHandlers?.map(route => {
         this.routeHandlers.push({
            handler: [...handles, ...route.handler],
            url: path + route.url,
            method: route.method
         });
      });
   }
}