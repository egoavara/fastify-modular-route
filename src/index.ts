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
    | HTTPBody<string, MethodHTTPBody, string, any, any, any, any, any>
    | HTTPNoBody<string, MethodHTTPNoBody, string, any, any, any, any>
    | Multipart<string, string, any, any, any, any>
    | SSE<string, string, any, any, any, any>
    | WS<string, string, any, any, any, any, any, any, any>

export function wsCaller<Caller extends Record<string, { args: [...pito[]], return: pito }>>(caller: Caller): Caller {
    return caller
}