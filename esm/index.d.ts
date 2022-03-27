import { pito } from 'pito';
declare type ParseRouteKeys<Route extends string> = Route extends `/${string}:${infer K}/${infer LEFT}` ? K | ParseRouteKeys<LEFT> : Route extends `/${string}:${infer K}` ? K : never;
export declare type RouteMethodNoBody = "GET" | "HEAD";
export declare type RouteMethodBody = "POST" | "PUT" | "PATCH" | "DELETE";
export declare type RouteMethod = RouteMethodNoBody | RouteMethodBody;
export declare type ModularRouteNoBody<Route extends string> = {
    method: RouteMethodNoBody;
    route: Route;
    params: pito.obj<Record<ParseRouteKeys<Route>, pito<any, any, {
        type: 'string' | 'number' | 'integer' | 'boolean';
    }, any>>>;
    headers: pito.obj<Record<string, pito>>;
    query: pito.obj<Record<string, pito>>;
    response: pito;
};
export declare type ModularRouteBody<Route extends string> = {
    method: RouteMethodBody;
    route: Route;
    params: pito.obj<Record<ParseRouteKeys<Route>, pito<any, any, {
        type: 'string' | 'number' | 'integer' | 'boolean';
    }, any>>>;
    headers: pito.obj<Record<string, pito>>;
    query: pito.obj<Record<string, pito>>;
    body: pito;
    response: pito;
};
export declare type ModularRoute<Route extends string> = ModularRouteBody<Route> | ModularRouteNoBody<Route>;
export declare type ModularRouteBuilder<Route extends ModularRoute<string>> = {
    route: Route;
};
export {};
//# sourceMappingURL=index.d.ts.map