import { pito } from 'pito'
import { HTTPBody, InferHTTPBody } from './http-body'
import { HTTPNoBody, InferHTTPNoBody } from './http-nobody'
import { MethodHTTPBody, MethodHTTPNoBody } from './methods'

export * from './utils'
export * from './headers'
export * from './methods'
export * from './http-body'
export * from './http-nobody'
export * from './sse'


export type Route =
    | HTTPBody<string, MethodHTTPBody, string>
    | HTTPNoBody<string, MethodHTTPNoBody, string>
export type RouteArguments<R extends Route> =
    R extends HTTPBody<string, MethodHTTPBody, string>
    ? {
        body: pito.Type<InferHTTPBody<R>['Body']>,
        query: pito.Type<InferHTTPBody<R>['Query']>,
        params: pito.Type<InferHTTPBody<R>['Params']>,
    }
    : R extends HTTPNoBody<string, MethodHTTPNoBody, string>
    ? {
        query: pito.Type<InferHTTPNoBody<R>['Query']>,
        params: pito.Type<InferHTTPNoBody<R>['Params']>,
    }
    : never
export type RouteResult<R extends Route> =
    R extends HTTPBody<string, MethodHTTPBody, string>
    ? pito.Type<InferHTTPBody<R>['Response']>
    : R extends HTTPNoBody<string, MethodHTTPNoBody, string>
    ? pito.Type<InferHTTPNoBody<R>['Response']>
    : never

