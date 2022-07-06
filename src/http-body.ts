import { pito } from "pito"
import { MethodHTTPBody } from "./methods.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { ParseRouteKeys } from "./utils.js"

export type HTTPBody
    <
        Domain extends string,
        Presets extends AnyPresets,
        Method extends MethodHTTPBody,
        Path extends string,
        Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito = pito.Any,
        Body extends pito = pito.Any,
        Response extends pito = pito.Any,
        Fail extends pito = pito.Any
    > = {
        readonly domain: Domain
        readonly presets: Presets[]
        readonly description?: string
        readonly summary?: string
        readonly externalDocs?: { url: string, description?: string }
        // 
        readonly method: Method,
        readonly path: Path,
        readonly params: Params,
        readonly query: Query,
        readonly body: Body,
        readonly response: Response,
        readonly fail: Fail,
    }

export type HTTPBodyBuilder
    <
        Domain extends string,
        Presets extends AnyPresets,
        Method extends MethodHTTPBody,
        Path extends string,
        Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito,
        Body extends pito,
        Response extends pito,
        Fail extends pito
    > = {
        presets<NewPresets extends KnownPresets>(preset: NewPresets): HTTPBodyBuilder<Domain, Presets | NewPresets, Method, Path, Params, Query, Body, Response, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): HTTPBodyBuilder<Domain, Presets | NewPresets[number], Method, Path, Params, Query, Body, Response, Fail>
        description(contents: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response, Fail>
        summary(contents: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response, Fail>
        externalDocs(url: string, description?: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response, Fail>
        // 
        params
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, NewParams, Query, Body, Response, Fail>
        query
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, NewQuery, Body, Response, Fail>
        body
            <NewBody extends pito>
            (body: NewBody)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, NewBody, Response, Fail>
        response
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, NewResponse, Fail>
        fail
            <NewFail extends pito>
            (fail: NewFail)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response, NewFail>
        build(): HTTPBody<Domain, Presets, Method, Path, Params, Query, Body, Response, Fail>
    }

export function HTTPBody
    <Method extends MethodHTTPBody, Path extends string, Domain extends string = ''>
    (method: Method, path: Path, domain?: Domain)
    : HTTPBodyBuilder<
        Domain,
        'http',
        Method,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito.Str>>,
        pito.Any,
        pito.Any,
        pito.Any,
        pito.Any
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: any = {
        domain: domain ?? '',
        method: method,
        presets: ['http'],
        path: path,
        params: pito.Obj(params),
        query: pito.Any(),
        body: pito.Any(),
        response: pito.Any(),
        fail: pito.Any(),
    }
    return {
        // ==================================================
        // short
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
        params(params) {
            target.params = params as any
            return this as any
        },
        query(query: any) {
            target.query = query as any
            return this as any
        },
        body(body: any) {
            target.body = body as any
            return this as any
        },
        response(response: any) {
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
            target.presets = Array.from(new Set(['http', ...target.presets]))
            return target
        }
    }
}