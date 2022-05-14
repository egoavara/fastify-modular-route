import { pito } from "pito"
import { MethodWS } from "./methods.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { ParseRouteKeys } from "./utils.js"


export type WS
    <
    Domain extends string,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Query extends pito = pito,
    // 
    Send extends pito = pito,
    Recv extends pito = pito,
    Request extends Record<string, { args: [...pito[]], return: pito }> = {},
    Response extends Record<string, { args:  [...pito[]], return: pito }> = {},
    // 
    Preset extends AnyPresets = never,
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
    infer Params, infer Query,
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
    Query extends pito,
    Send extends pito,
    Recv extends pito,
    Request extends Record<string, { args:  [...pito[]], return: pito }>,
    Response extends Record<string, { args:  [...pito[]], return: pito }>,
    Preset extends AnyPresets,
    > = {
        working: WS<Domain, Path, Params, Query, Send, Recv, Request, Response, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : WSBuilder<Domain, Path, NewParams, Query, Send, Recv, Request, Response, Preset>

        withQuery
            <NewQuery extends pito>
            (query: NewQuery)
            : WSBuilder<Domain, Path, Params, NewQuery, Send, Recv, Request, Response, Preset>

        withSend
            <NewSend extends pito>
            (send: NewSend)
            : WSBuilder<Domain, Path, Params, Query, NewSend, Recv, Request, Response, Preset>

        withRecv
            <NewRecv extends pito>
            (recv: NewRecv)
            : WSBuilder<Domain, Path, Params, Query, Send, NewRecv, Request, Response, Preset>

        withRequest
            <NewRequest extends Record<string, { args:  [...pito[]], return: pito }>>
            (request: NewRequest)
            : WSBuilder<Domain, Path, Params, Query, Send, Recv, NewRequest, Response, Preset>

        withResponse
            <NewResponse extends Record<string, { args:  [...pito[]], return: pito }>>
            (response: NewResponse)
            : WSBuilder<Domain, Path, Params, Query, Send, Recv, Request, NewResponse, Preset>

        withPreset<NewPreset extends KnownPresets>(preset: NewPreset): WSBuilder<Domain, Path, Params, Query, Send, Recv, Request, Response, Preset | NewPreset>
        withPreset<NewPreset extends string>(preset: NewPreset): WSBuilder<Domain, Path, Params, Query, Send, Recv, Request, Response, Preset | NewPreset>

        build(): WS<Domain, Path, Params, Query, Send, Recv, Request, Response, Preset>
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
        {},
        {},
        never
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            method: 'WS',
            path: path,
            // @ts-expect-error
            params: pito.Obj(params),
            query: pito.Any(),
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


        withPreset(preset: any) {
            // @ts-expect-error
            this.working.presets.push(preset)
            return this as any
        },

        build() {
            return this.working
        }

    }
}