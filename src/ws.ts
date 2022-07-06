import { pito } from "pito"
import { MethodWS } from "./methods.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { ParseRouteKeysForPath } from "./utils.js"


export type WS
    <
        Domain extends string,
        Presets extends AnyPresets,
        Path extends string,

        Params extends pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito = pito,
        Send extends pito = pito,
        Recv extends pito = pito,
        Request extends Record<string, { args: [...pito[]], return: pito }> = {},
        Response extends Record<string, { args: [...pito[]], return: pito }> = {},
        Fail extends pito = pito,
    // 
    > = {
        readonly domain: Domain
        readonly presets: Presets[]
        readonly description?: string
        readonly summary?: string
        readonly externalDocs?: { url: string, description?: string }

        readonly method: MethodWS,
        readonly path: Path,

        readonly params: Params,
        readonly query: Query,
        readonly send: Send,
        readonly recv: Recv,
        readonly request: Request,
        readonly response: Response,
        readonly fail: Fail
    }

export type WSBuilder
    <
        Domain extends string,
        Presets extends AnyPresets,
        Path extends string,
        Params extends pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito,
        Send extends pito,
        Recv extends pito,
        Request extends Record<string, { args: [...pito[]], return: pito }>,
        Response extends Record<string, { args: [...pito[]], return: pito }>,
        Fail extends pito,
    > = {
        // metadata
        presets<NewPresets extends KnownPresets>(preset: NewPresets): WSBuilder<Domain, Presets | NewPresets, Path, Params, Query, Send, Recv, Request, Response, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): WSBuilder<Domain, Presets | NewPresets[number], Path, Params, Query, Send, Recv, Request, Response, Fail>
        description(contents: string): WSBuilder<Domain, Presets, Path, Params, Query, Send, Recv, Request, Response, Fail>
        summary(contents: string): WSBuilder<Domain, Presets, Path, Params, Query, Send, Recv, Request, Response, Fail>
        externalDocs(url: string, description?: string): WSBuilder<Domain, Presets, Path, Params, Query, Send, Recv, Request, Response, Fail>
        // arguments
        params
            <NewParams extends pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : WSBuilder<Domain, Presets, Path, NewParams, Query, Send, Recv, Request, Response, Fail>
        query
            <NewQuery extends pito>
            (query: NewQuery)
            : WSBuilder<Domain, Presets, Path, Params, NewQuery, Send, Recv, Request, Response, Fail>
        send
            <NewSend extends pito>
            (send: NewSend)
            : WSBuilder<Domain, Presets, Path, Params, Query, NewSend, Recv, Request, Response, Fail>
        recv
            <NewRecv extends pito>
            (recv: NewRecv)
            : WSBuilder<Domain, Presets, Path, Params, Query, Send, NewRecv, Request, Response, Fail>
        request
            <NewRequest extends Record<string, { args: [pito] | [...pito[]], return: pito }>>
            (request: NewRequest)
            : WSBuilder<Domain, Presets, Path, Params, Query, Send, Recv, NewRequest, Response, Fail>
        response
            <NewResponse extends Record<string, { args: [pito] | [...pito[]], return: pito }>>
            (response: NewResponse)
            : WSBuilder<Domain, Presets, Path, Params, Query, Send, Recv, Request, NewResponse, Fail>
        fail
            <NewFail extends pito>
            (fail: NewFail)
            : WSBuilder<Domain, Presets, Path, Params, Query, Send, Recv, Request, Response, NewFail>

        // build
        build(): WS<Domain, 'ws' | Presets, Path, Params, Query, Send, Recv, Request, Response, Fail>
    }

export function WS
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : WSBuilder<
        Domain,
        'ws',
        Path,
        pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number, any, any, any>>>,
        pito.Any,
        pito.Any,
        pito.Any,
        {},
        {},
        pito.Any
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: any = {
        domain: domain ?? '',
        method: 'WS',
        presets: ['ws'],
        path: path,
        params: pito.Obj(params),
        query: pito.Any(),
        send: pito.Any(),
        recv: pito.Any(),
        request: {},
        response: {},
        fail: pito.Any(),
    }
    return {
        // ==================================================
        // metadata
        // @ts-expect-error
        presets(...presets) {
            target.presets.push(...presets)
            return this
        },
        description(contents) {
            target.description = contents
            return this
        },
        summary(contents) {
            target.summary = contents
            return this
        },
        externalDocs(url, description?) {
            target.externalDocs = { url, ...(description !== undefined ? { description } : {}) }
            return this
        },
        // ==================================================
        // arguments
        params(params) {
            target.params = params as any
            return this as any
        },
        query(query) {
            target.query = query as any
            return this as any
        },
        recv(recv) {
            target.recv = recv as any
            return this as any
        },
        send(send) {
            target.send = send as any
            return this as any
        },
        request(request) {
            target.request = request as any
            return this as any
        },
        response(response) {
            target.response = response as any
            return this as any
        },
        fail(fail) {
            target.fail = fail as any
            return this as any
        },
        // ==================================================
        // build
        build() {
            target.presets = Array.from(new Set([...target.presets, 'ws']))
            return target
        }

    }
}