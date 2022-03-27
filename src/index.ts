import { pito } from 'pito'
// 
type ParseRouteKeys<Route extends string> =
    Route extends `/${string}:${infer K}/${infer LEFT}`
    ? K | ParseRouteKeys<LEFT>
    : Route extends `/${string}:${infer K}`
    ? K
    : never
// 

export type RouteMethodNoBody = "GET" | "HEAD"
export type RouteMethodBody = "POST" | "PUT" | "PATCH" | "DELETE"
export type RouteMethod = RouteMethodNoBody | RouteMethodBody
// 
export type ModularRouteNoBody<Route extends string> = {
    method: RouteMethodNoBody,
    route: Route,
    params: pito.obj<Record<ParseRouteKeys<Route>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    headers: pito.obj<Record<string, pito>>,
    query: pito.obj<Record<string, pito>>,
    response: pito,
}
export type ModularRouteBody<Route extends string> = {
    method: RouteMethodBody,
    route: Route,
    params: pito.obj<Record<ParseRouteKeys<Route>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    headers: pito.obj<Record<string, pito>>,
    query: pito.obj<Record<string, pito>>,
    body: pito,
    response: pito,
}
export type ModularRoute<Route extends string> = ModularRouteBody<Route> | ModularRouteNoBody<Route>


// ====================================================== //
export type ModularRouteBuilder<Route extends string> = {
    route: ModularRoute<Route>,
    
}