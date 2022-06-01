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
    > = {
        readonly domain: Domain
        presets: Presets[]
        description?: string
        summary?: string
        externalDocs?: { url: string, description?: string }
        // 
        readonly method: Method,
        readonly path: Path,
        params: Params,
        query: Query,
        body: Body,
        response: Response,
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
    > = {
        presets<NewPresets extends KnownPresets>(preset: NewPresets): HTTPBodyBuilder<Domain, Presets | NewPresets, Method, Path, Params, Query, Body, Response>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): HTTPBodyBuilder<Domain, Presets | NewPresets[number], Method, Path, Params, Query, Body, Response>
        description(contents: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response>
        summary(contents: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response>
        externalDocs(url: string, description?: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response>
        // 

        params
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, NewParams, Query, Body, Response>
        query
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, NewQuery, Body, Response>
        body
            <NewBody extends pito>
            (body: NewBody)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, NewBody, Response>
        response
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, NewResponse>
        build(): HTTPBody<Domain, Presets, Method, Path, Params, Query, Body, Response>
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
        pito.Any
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: HTTPBody<Domain, string, Method, Path, pito.Obj<Record<ParseRouteKeys<Path>, pito.Str>>, pito.Any, pito.Any, pito.Any> = {
        // @ts-expect-error
        domain: domain ?? '',
        method: method,
        presets: ['http'],
        path: path,
        // @ts-expect-error
        params: pito.Obj(params),
        query: pito.Any(),
        body: pito.Any(),
        response: pito.Any(),
    }
    return {
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

        // @ts-expect-error
        build() {
            target.presets = Array.from(new Set(['http', ...target.presets]))
            return target
        }
    }
}