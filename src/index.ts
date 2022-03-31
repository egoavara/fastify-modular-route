import { pito } from 'pito'
import { HTTPBody, InferHTTPBody } from './http-body'
import { HTTPNoBody, InferHTTPNoBody } from './http-nobody'
import { MethodHTTPBody, MethodHTTPNoBody } from './methods'
import { Security } from './security'
import { InferSSE, SSE } from './sse'

export * from './utils'
export * from './headers'
export * from './methods'
export * from './http-body'
export * from './http-nobody'
export * from './sse'


export type Route =
    | HTTPBody<string, MethodHTTPBody, string, any, any, any, any, any, Security>
    | HTTPNoBody<string, MethodHTTPNoBody, string, any, any, any, any, Security>
    | SSE<string, MethodHTTPNoBody, any, any, any, any, Security>
export type RouteArguments<R extends Route> =
    R extends HTTPBody<string, MethodHTTPBody, string, any, any, any, any, any, Security>
    ? {
        body: pito.Type<InferHTTPBody<R>['Body']>,
        query: pito.Type<InferHTTPBody<R>['Query']>,
        params: pito.Type<InferHTTPBody<R>['Params']>,
    }
    : R extends HTTPNoBody<string, MethodHTTPNoBody, string, any, any, any, any, Security>
    ? {
        query: pito.Type<InferHTTPNoBody<R>['Query']>,
        params: pito.Type<InferHTTPNoBody<R>['Params']>,
    }
    : R extends SSE<string, MethodHTTPNoBody, any, any, any, any, Security>
    ? {
        query: pito.Type<InferSSE<R>['Query']>,
        params: pito.Type<InferSSE<R>['Params']>,
    }
    : never
export type RouteResult<R extends Route> =
    R extends HTTPBody<string, MethodHTTPBody, string, any, any, any, any, any, Security>
    ? pito.Type<InferHTTPBody<R>['Response']>
    : R extends HTTPNoBody<string, MethodHTTPNoBody, string, any, any, any, any, Security>
    ? pito.Type<InferHTTPNoBody<R>['Response']>
    : R extends SSE<string, MethodHTTPNoBody, any, any, any, any, Security>
    ? pito.Type<InferSSE<R>['Packet']>
    : never

