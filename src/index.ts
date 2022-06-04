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

export type InferHTTPNoBody<R extends Route> =
    R extends HTTPNoBody<infer Domain, infer Presets, infer Method, infer Path, infer Params, infer Query, infer Response, infer Fail>
    ? {
        Domain: Domain
        Presets: Presets
        Method: Method
        Path: Path
        Params: Params
        Query: Query
        Response: Response
        Fail :Fail
    }
    : never

export type InferHTTPBody<R extends Route> =
    R extends HTTPBody<infer Domain, infer Presets, infer Method, infer Path, infer Params, infer Query, infer Body, infer Response, infer Fail>
    ? {
        Domain: Domain
        Presets: Presets
        Method: Method
        Path: Path
        Params: Params
        Query: Query
        Body: Body
        Response: Response
        Fail :Fail
    }
    : never

export type InferMultipart<R extends Route> =
    R extends Multipart<infer Domain, infer Presets, infer Path, infer Params, infer Query, infer Response, infer Fail>
    ? {
        Domain: Domain
        Presets: Presets
        Path: Path
        Params: Params
        Query: Query
        Response: Response
        Fail :Fail
    }
    : never
export type InferSSE<R extends Route> =
    R extends SSE<infer Domain, infer Presets, infer Path, infer Params, infer Query, infer Packet, infer Fail>
    ? {
        Domain: Domain
        Presets: Presets
        Path: Path
        Params: Params
        Query: Query
        Packet: Packet
        Fail :Fail
    }
    : never

export type InferWS<R extends Route> =
    R extends WS<infer Domain, infer Presets, infer Path, infer Params, infer Query, infer Send, infer Recv, infer Request, infer Response, infer Fail>
    ? {
        Domain: Domain
        Presets: Presets
        Path: Path
        Params: Params
        Query: Query
        Send: Send
        Recv: Recv
        Request: Request
        Response: Response
        Fail :Fail
    }
    : never
export type InferCommons<R extends Route> =
    R extends HTTPBody<infer Domain, infer Prefix, infer Method, any, any, any, any, any>
    ? {
        Domain: Domain
        Prefix: Prefix
        Method: Method
    }
    : R extends HTTPNoBody<infer Domain, infer Prefix, infer Method, any, any, any, any>
    ? {
        Domain: Domain
        Prefix: Prefix
        Method: Method
    }
    : R extends Multipart<infer Domain, infer Prefix, any, any, any, any>
    ? {
        Domain: Domain
        Prefix: Prefix
        Method: 'MULTIPART'
    }
    : R extends SSE<infer Domain, infer Prefix, any, any, any, any>
    ? {
        Domain: Domain
        Prefix: Prefix
        Method: 'SSE'
    }
    : R extends WS<infer Domain, infer Prefix, any, any, any, any, any, any, any>
    ? {
        Domain: Domain
        Prefix: Prefix
        Method: 'WS'
    }
    : never
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