import { HTTPBody } from './http-body'
import { HTTPNoBody } from './http-nobody'
import { MethodHTTPBody, MethodHTTPNoBody } from './methods'
import { Multipart } from './multipart'
import { Presets } from './preset'
import { SSE } from './sse'

export * from './headers'
export * from './http-body'
export * from './http-nobody'
export * from './methods'
export * from './multipart'
export * from './preset'
export * from './sse'
export * from './utils'


export type Route =
    | HTTPBody<string, MethodHTTPBody, string, any, any, any, any, any, Presets>
    | HTTPNoBody<string, MethodHTTPNoBody, string, any, any, any, any, Presets>
    | Multipart<string, string, any, any, any, Presets>
    | SSE<string, string, any, any, any, any, Presets>

