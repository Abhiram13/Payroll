import {RouterNameSpace, ServerNameSpace, Server, Request, Response, Method} from "../types/export.types";

export class Router implements RouterNameSpace.IRouter {
   routeHandlers: RouterNameSpace.IRouterHandlers[];

   constructor() {
      this.routeHandlers = [];
   }

   get<T extends string>(url: T, ...middlewares: RouterNameSpace.Middleware<T>[]): void { 
      this.routeHandlers?.push({ url, method: Method.GET, handler: middlewares});
   }

   post<T extends string>(url: T, ...middlewares: RouterNameSpace.Middleware<T>[]): void {
      this.routeHandlers.push({ url, method: Method.POST, handler: middlewares });
   }

   put<T extends string>(url: T, ...middlewares: RouterNameSpace.Middleware<T>[]): void {
      this.routeHandlers.push({ url, method: Method.PUT, handler: middlewares });
   }

   delete<T extends string>(url: T, ...middlewares: RouterNameSpace.Middleware<T>[]): void {
      this.routeHandlers.push({ url, method: Method.DELETE, handler: middlewares });
   }

   #queryParams(url: string) {
      const split: string[] = url?.split("/");
      let params: { [key: string]: any } = {};
      let queryParams: string[] = split?.filter(s => s?.startsWith(":"));

      queryParams?.map(q => q?.replace(":", ""))?.map(p => {
         params[p] = "";
      });

      return params;
   }

   use<T extends string>(attributes: RouterNameSpace.IRouterAttributes): void {
      const { middlewares, path, router } = attributes;
      const handles: RouterNameSpace.Middleware<T>[] = middlewares || [];

      router?.routeHandlers?.map(route => {

         const params = this.#queryParams(path + route.url);

         this.routeHandlers.push({
            handler: [...handles, ...route.handler],
            url: path + route.url,
            method: route.method,
            params,
         });
      });
   }
}