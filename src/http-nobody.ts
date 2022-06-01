import { pito } from "pito"
import { MethodHTTPNoBody } from "./methods.js"
import { KnownPresets, AnyPresets } from "./preset.js"
import { ParseRouteKeys } from "./utils.js"

export type HTTPNoBody
    <
    Domain extends string,
    Presets extends AnyPresets,
    Method extends MethodHTTPNoBody,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Query extends pito = pito,
    Response extends pito = pito,
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
        response: Response,
    }

export type HTTPNoBodyBuilder
    <
    Domain extends string,
    Presets extends AnyPresets,
    Method extends MethodHTTPNoBody,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Query extends pito,
    Response extends pito,
    > = {
        presets<NewPresets extends KnownPresets>(preset: NewPresets): HTTPNoBodyBuilder<Domain, Presets | NewPresets, Method, Path, Params, Query, Response>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): HTTPNoBodyBuilder<Domain, Presets | NewPresets[number], Method, Path, Params, Query, Response>
        description(contents: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response>
        summary(contents: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response>
        externalDocs(url: string, description?: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response>
        // 
        params
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, NewParams, Query, Response>
        query
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, NewQuery, Response>
        response
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, NewResponse>

        build(): HTTPNoBody<Domain, 'http' | Presets, Method, Path, Params, Query, Response>
    }
export function HTTPNoBody
    <Method extends MethodHTTPNoBody, Path extends string, Domain extends string = ''>
    (method: Method, path: Path, domain?: Domain)
    : HTTPNoBodyBuilder<
        Domain,
        'http',
        Method,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
        pito.Any,
        pito.Any
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: HTTPNoBody<Domain, string, Method, Path, pito.Obj<Record<ParseRouteKeys<Path>, pito.Str>>, pito.Any, pito.Any> = {
        // @ts-expect-error
        domain: domain ?? '',
        method: method,
        presets: ['http'],
        path: path,
        // @ts-expect-error
        params: pito.Obj(params),
        query: pito.Any(),
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
        query(query) {
            target.query = query as any
            return this as any
        },
        response(response) {
            target.response = response as any
            return this as any
        },
        // @ts-expect-error
        build() {
            target.presets = Array.from(new Set([...target.presets, 'http']))
            return target
        }

    }
}