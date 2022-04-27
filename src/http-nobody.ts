import { pito } from "pito"
import { PitoHeader } from "./headers"
import { MethodHTTPNoBody } from "./methods"
import { Presets } from "./preset"
import { ParseRouteKeys } from "./utils"

export type HTTPNoBody
    <
    Domain extends string,
    Method extends MethodHTTPNoBody,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends pito = PitoHeader,
    Query extends pito = pito,
    Response extends pito = pito,
    Preset extends Presets = undefined,
    > = {
        domain: Domain,
        method: Method,
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        response: Response,
        presets: Preset[],
    }
export type InferHTTPNoBody<T> = T extends HTTPNoBody<infer Domain, infer Method, infer Path, infer Params, infer Headers, infer Query, infer Response, infer Preset>
    ? {
        Domain: Domain,
        Method: Method,
        Path: Path,
        Params: Params,
        Headers: Headers,
        Query: Query,
        Response: Response,
        Preset: Preset
    }
    : never

export type HTTPNoBodyBuilder
    <
    Domain extends string,
    Method extends MethodHTTPNoBody,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends pito,
    Query extends pito,
    Response extends pito,
    Preset extends Presets,
    > = {
        working: HTTPNoBody<Domain, Method, Path, Params, Headers, Query, Response, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPNoBodyBuilder<Domain, Method, Path, NewParams, Headers, Query, Response, Preset>
        withHeaders
            <NewHeaders extends PitoHeader>
            (headers: NewHeaders)
            : HTTPNoBodyBuilder<Domain, Method, Path, Params, NewHeaders, Query, Response, Preset>
        withQuery
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPNoBodyBuilder<Domain, Method, Path, Params, Headers, NewQuery, Response, Preset>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPNoBodyBuilder<Domain, Method, Path, Params, Headers, Query, NewResponse, Preset>
        withPresets
            <NewPresets extends Presets[]>
            (...presets: NewPresets)
            : HTTPNoBodyBuilder<Domain, Method, Path, Params, Headers, Query, Response, NewPresets[number]>
        build(): HTTPNoBody<Domain, Method, Path, Params, Headers, Query, Response, Preset>
    }
export function HTTPNoBody
    <Method extends MethodHTTPNoBody, Path extends string, Domain extends string,>
    (method: Method, path: Path, domain?: Domain)
    : HTTPNoBodyBuilder<
        Domain,
        Method,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
        pito.Any,
        pito.Any,
        pito.Any,
        never
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g);
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            method: method,
            path: path,
            // @ts-expect-error
            params: pito.Obj(params),
            headers: pito.Any(),
            query: pito.Any(),
            response: pito.Any(),
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