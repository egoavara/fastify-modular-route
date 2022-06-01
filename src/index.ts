import { pito } from 'pito'
import { HTTPBody } from './http-body.js'
import { HTTPNoBody } from './http-nobody.js'
import { MethodHTTPBody, MethodHTTPNoBody } from './methods.js'
import { Multipart } from './multipart.js'
import { SSE } from './sse.js'
import { WS } from './ws.js'

export * from './http-body.js'
export * from './http-nobody.js'
export * from './methods.js'
export * from './multipart.js'
export * from './preset.js'
export * from './sse.js'
export * from './utils.js'
export * from './ws.js'

export type Route =
    | HTTPBody<string, string, MethodHTTPBody, any, any, any, any, any>
    | HTTPNoBody<string, string, MethodHTTPNoBody, any, any, any, any>
    | Multipart<string, string, string, any, any, any>
    | SSE<string, string, string, any, any, any>
    | WS<string, string, string, any, any, any, any, any, any>
export type InferPrefix<R extends Route> =
    R extends HTTPBody<string, infer Prefix, MethodHTTPBody, any, any, any, any, any>
    ? Prefix
    : R extends HTTPNoBody<string, infer Prefix, MethodHTTPNoBody, any, any, any, any>
    ? Prefix
    : R extends Multipart<string, infer Prefix, any, any, any, any>
    ? Prefix
    : R extends SSE<string, infer Prefix, any, any, any, any>
    ? Prefix
    : R extends WS<string, infer Prefix, any, any, any, any, any, any, any>
    ? Prefix
    : never

export function func<Caller extends Record<string, { args: [pito] | [...pito[]], return: pito }>>(caller: Caller): Caller {
    return caller
}