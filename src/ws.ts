import { pito } from "pito";
import { PitoHeader } from "./headers";
import { MethodSSE, MethodWS } from "./methods";
import { Presets } from "./preset";
import { ParseRouteKeys } from "./utils";


export type WS
    <
    Domain extends string,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends pito = PitoHeader,
    Query extends pito = pito,
    // 
    Send extends pito = pito,
    Recv extends pito = pito,
    Request extends Record<string, { args: pito, return: pito }> = {},
    Response extends Record<string, { args: pito, return: pito }> = {},
    // 
    Preset extends Presets = undefined,
    > = {
        domain: Domain,
        method: MethodWS,
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        // 
        send: Send,
        recv: Recv,
        request: Request,
        response: Response,
        // 
        presets: Preset[],
    }
export type InferWS<T> = T extends WS<
    infer Domain, infer Path,
    infer Params, infer Headers, infer Query,
    infer Send, infer Recv,
    infer Request, infer Response,
    infer Preset>
    ? {
        Domain: Domain,
        Path: Path,
        Params: Params,
        Headers: Headers,
        Query: Query,
        Send: Send,
        Recv: Recv,
        Request: Request,
        Response: Response,
        Preset: Preset,
    }
    : never

export type WSBuilder
    <
    Domain extends string,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends pito,
    Query extends pito,
    Send extends pito,
    Recv extends pito,
    Request extends Record<string, { args: pito, return: pito }>,
    Response extends Record<string, { args: pito, return: pito }>,
    Preset extends Presets,
    > = {
        working: WS<Domain, Path, Params, Headers, Query, Send, Recv, Request, Response, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : WSBuilder<Domain, Path, NewParams, Headers, Query, Send, Recv, Request, Response, Preset>
        withHeaders
            <NewHeaders extends pito>
            (headers: NewHeaders)
            : WSBuilder<Domain, Path, Params, NewHeaders, Query, Send, Recv, Request, Response, Preset>
        withQuery
            <NewQuery extends pito>
            (query: NewQuery)
            : WSBuilder<Domain, Path, Params, Headers, NewQuery, Send, Recv, Request, Response, Preset>

        withSend
            <NewSend extends pito>
            (send: NewSend)
            : WSBuilder<Domain, Path, Params, Headers, Query, NewSend, Recv, Request, Response, Preset>

        withRecv
            <NewRecv extends pito>
            (recv: NewRecv)
            : WSBuilder<Domain, Path, Params, Headers, Query, Send, NewRecv, Request, Response, Preset>

        withRequest
            <NewRequest extends Record<string, { args: pito, return: pito }>>
            (request: NewRequest)
            : WSBuilder<Domain, Path, Params, Headers, Query, Send, Recv, NewRequest, Response, Preset>

        withResponse
            <NewResponse extends Record<string, { args: pito, return: pito }>>
            (response: NewResponse)
            : WSBuilder<Domain, Path, Params, Headers, Query, Send, Recv, Request, NewResponse, Preset>

        withPresets
            <NewPresets extends Presets[]>
            (...presets: NewPresets)
            : WSBuilder<Domain, Path, Params, Headers, Query, Send, Recv, Request, Response, NewPresets[number]>
        build(): WS<Domain, Path, Params, Headers, Query, Send, Recv, Request, Response, Preset>
    }

export function WS
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : WSBuilder<
        Domain,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number, any, any, any>>>,
        pito.Any,
        pito.Any,
        pito.Any,
        pito.Any,
        {},
        {},
        never
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g);
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            method: 'WS',
            path: path,
            // @ts-expect-error
            params: pito.Obj(params),
            query: pito.Any(),
            headers: pito.Any(),
            send: pito.Any(),
            recv: pito.Any(),
            request: {},
            response: {},
            presets: [],
        },
        withParams(params) {
            this.working.params = params as any
            return this as any
        },

        withHeaders(headers) {
            this.working.headers = headers as any
            return this as any
        },

        withQuery(query) {
            this.working.query = query as any
            return this as any
        },

        withRecv(recv) {
            this.working.recv = recv as any
            return this as any
        },

        withSend(send) {
            this.working.send = send as any
            return this as any
        },

        withRequest(request) {
            this.working.request = request as any
            return this as any
        },

        withResponse(response) {
            this.working.response = response as any
            return this as any
        },

        withPresets(...presets) {
            this.working.presets = presets as any
            return this as any
        },

        build() {
            return this.working
        }

    }
}