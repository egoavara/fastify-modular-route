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
        Fail extends pito = pito,
    > = {
        readonly domain: Domain
        presets: Presets[]
        description?: string
        summary?: string
        externalDocs?: { url: string, description?: string }
        // 
        readonly method: Method
        readonly path: Path
        params: Params
        query: Query
        response: Response
        fail: Fail
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
        Fail extends pito = pito,
    > = {
        presets<NewPresets extends KnownPresets>(preset: NewPresets): HTTPNoBodyBuilder<Domain, Presets | NewPresets, Method, Path, Params, Query, Response, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): HTTPNoBodyBuilder<Domain, Presets | NewPresets[number], Method, Path, Params, Query, Response, Fail>
        description(contents: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, Fail>
        summary(contents: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, Fail>
        externalDocs(url: string, description?: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, Fail>
        // 
        params
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, NewParams, Query, Response, Fail>
        query
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, NewQuery, Response, Fail>
        response
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, NewResponse, Fail>
        fail
            <NewFail extends pito>
            (fail: NewFail)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, NewFail>
        // withs
        withPresets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): HTTPNoBodyBuilder<Domain, Presets | NewPresets[number], Method, Path, Params, Query, Response, Fail>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, NewParams, Query, Response, Fail>
        withQuery
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, NewQuery, Response, Fail>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, NewResponse, Fail>
        withFail
            <NewFail extends pito>
            (fail: NewFail)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, NewFail>
        build(): HTTPNoBody<Domain, 'http' | Presets, Method, Path, Params, Query, Response, Fail>
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
        fail: pito.Any()
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
        query(query) {
            target.query = query as any
            return this as any
        },
        response(response) {
            target.response = response as any
            return this as any
        },
        fail(fail) {
            target.fail = fail
            return this as any
        },
        // ==================================================
        // withs
        withPresets(...presets) {
            target.presets.push(...presets)
            return this
        },
        withParams(params) {
            target.params = params as any
            return this as any
        },
        withQuery(query) {
            target.query = query as any
            return this as any
        },
        withResponse(response) {
            target.response = response as any
            return this as any
        },
        withFail(fail) {
            target.fail = fail
            return this as any
        },
        // ==================================================
        // @ts-expect-error
        build() {
            target.presets = Array.from(new Set([...target.presets, 'http']))
            return target
        }

    }
}