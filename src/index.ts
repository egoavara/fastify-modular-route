import { pito } from 'pito'
import { HTTPBody } from './http-body.js'
import { HTTPNoBody } from './http-nobody.js'
import { MethodHTTPBody, MethodHTTPNoBody } from './methods.js'
import { Multipart } from './multipart.js'
import { Share } from './share.js'
import { SSE } from './sse.js'
import { PathToTopic } from './utils.js'
import { WS } from './ws.js'

export * from './failure.js'
export * from './http-body.js'
export * from './http-nobody.js'
export * from './methods.js'
export * from './multipart.js'
export * from './preset.js'
export * from './share.js'
export * from './sse.js'
export * from './utils.js'
export * from './ws.js'

export type Route =
    | HTTPBody<string, any, MethodHTTPBody, any, any, any, any, any>
    | HTTPNoBody<string, any, MethodHTTPNoBody, any, any, any, any>
    | Multipart<string, any, string, any, any, any>
    | SSE<string, any, string, any, any, any>
    | WS<string, any, string, any, any, any, any, any, any>
    | Share<string, any, string, any, any>

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
        Fail: Fail
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
        Fail: Fail
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
        Fail: Fail
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
        Fail: Fail
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
        Fail: Fail
    }
    : never

export type InferShare<R extends Route> =
    R extends Share<infer Domain, infer Presets, infer Path, infer Params, infer Payload>
    ? {
        Domain: Domain
        Presets: Presets
        Path: Path
        Topic: PathToTopic<Path>
        Params: Params
        Payload: Payload
    }
    : never

export type InferCommons<R extends Route> =
    R extends HTTPBody<infer Domain, infer Presets, infer Method, any, any, any, any, any>
    ? {
        Domain: Domain
        Presets: Presets
        Method: Method
    }
    : R extends HTTPNoBody<infer Domain, infer Presets, infer Method, any, any, any, any>
    ? {
        Domain: Domain
        Presets: Presets
        Method: Method
    }
    : R extends Multipart<infer Domain, infer Presets, any, any, any, any>
    ? {
        Domain: Domain
        Presets: Presets
        Method: 'MULTIPART'
    }
    : R extends SSE<infer Domain, infer Presets, any, any, any, any>
    ? {
        Domain: Domain
        Presets: Presets
        Method: 'SSE'
    }
    : R extends WS<infer Domain, infer Presets, any, any, any, any, any, any, any>
    ? {
        Domain: Domain
        Presets: Presets
        Method: 'WS'
    }
    : R extends Share<infer Domain, infer Presets, any, any, any>
    ? {
        Domain: Domain
        Presets: Presets
        Method: 'SHARE'
    }
    : never

export type InferPresets<R extends Route> =
    R extends HTTPBody<string, infer Presets, MethodHTTPBody, any, any, any, any, any>
    ? Presets
    : R extends HTTPNoBody<string, infer Presets, MethodHTTPNoBody, any, any, any, any>
    ? Presets
    : R extends Multipart<string, infer Presets, any, any, any, any>
    ? Presets
    : R extends SSE<string, infer Presets, any, any, any, any>
    ? Presets
    : R extends WS<string, infer Presets, any, any, any, any, any, any, any>
    ? Presets
    : R extends Share<string, infer Presets, any, any, any>
    ? Presets
    : never

export function func<Caller extends Record<string, { args: [pito] | [...pito[]], return: pito }>>(caller: Caller): Caller {
    return caller
}