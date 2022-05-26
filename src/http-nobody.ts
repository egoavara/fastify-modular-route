import { pito } from "pito"
import { MethodHTTPNoBody } from "./methods.js"
import { KnownPresets, AnyPresets } from "./preset.js"
import { ParseRouteKeys } from "./utils.js"

export type HTTPNoBody
    <
    Domain extends string,
    Method extends MethodHTTPNoBody,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Query extends pito = pito,
    Response extends pito = pito,
    Preset extends AnyPresets = never,
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
export type InferHTTPNoBody<T> = T extends HTTPNoBody<infer Domain, infer Method, infer Path, infer Params, infer Query, infer Response, infer Preset>
    ? {
        Domain: Domain,
        Method: Method,
        Path: Path,
        Params: Params,
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

    Query extends pito,
    Response extends pito,
    Preset extends AnyPresets,
    > = {
        working: HTTPNoBody<Domain, Method, Path, Params, Query, Response, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPNoBodyBuilder<Domain, Method, Path, NewParams, Query, Response, Preset>
        withQuery
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPNoBodyBuilder<Domain, Method, Path, Params, NewQuery, Response, Preset>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPNoBodyBuilder<Domain, Method, Path, Params, Query, NewResponse, Preset>

        addPreset<NewPreset extends KnownPresets>(preset: NewPreset): HTTPNoBodyBuilder<Domain, Method, Path, Params, Query, Response, Preset | NewPreset>
        addPreset<NewPreset extends string>(preset: NewPreset): HTTPNoBodyBuilder<Domain, Method, Path, Params, Query, Response, Preset | NewPreset>
        withPresets<NewPresets extends [string] | [...string[]]>(...preset: NewPresets): HTTPNoBodyBuilder<Domain, Method, Path, Params, Query, Response, NewPresets[number]>

        build(): HTTPNoBody<Domain, Method, Path, Params, Query, Response, Preset>
    }
export function HTTPNoBody
    <Method extends MethodHTTPNoBody, Path extends string, Domain extends string = ''>
    (method: Method, path: Path, domain?: Domain)
    : HTTPNoBodyBuilder<
        Domain,
        Method,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,

        pito.Any,
        pito.Any,
        never
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            method: method,
            path: path,
            // @ts-expect-error
            params: pito.Obj(params),
            query: pito.Any(),
            response: pito.Any(),
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
        withResponse(response) {
            this.working.response = response as any
            return this as any
        },
        addPreset(preset: any) {
            // @ts-expect-error
            this.working.presets.push(preset)
            return this as any
        },
        withPresets(...presets) {
            // @ts-expect-error
            this.working.presets = presets
            return this as any
        },
        build() {
            return this.working
        }

    }
}