import { pito } from "pito"
import { MethodHTTPBody } from "./methods.js"
import { KnownPresets, AnyPresets } from "./preset.js"
import { ParseRouteKeys } from "./utils.js"

export type HTTPBody
    <
    Domain extends string,
    Method extends MethodHTTPBody,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Query extends pito = pito.Any,
    Body extends pito = pito.Any,
    Response extends pito = pito.Any,
    Preset extends AnyPresets = never,
    > = {
        domain: Domain,
        method: Method,
        path: Path,
        params: Params,
        query: Query,
        body: Body,
        response: Response,
        presets: Preset[],
    }
export type InferHTTPBody<T> = T extends HTTPBody<infer Domain, infer Method, infer Path, infer Params, infer Query, infer Body, infer Response, infer Preset>
    ? {
        Domain: Domain,
        Method: Method,
        Path: Path,
        Params: Params,
        Query: Query,
        Body: Body,
        Response: Response,
        Preset: Preset,
    }
    : never

export type HTTPBodyBuilder
    <
    Domain extends string,
    Method extends MethodHTTPBody,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,

    Query extends pito,
    Body extends pito,
    Response extends pito,
    Preset extends AnyPresets,
    > = {
        working: HTTPBody<Domain, Method, Path, Params, Query, Body, Response, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPBodyBuilder<Domain, Method, Path, NewParams, Query, Body, Response, Preset>
        withQuery
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPBodyBuilder<Domain, Method, Path, Params, NewQuery, Body, Response, Preset>
        withBody
            <NewBody extends pito>
            (body: NewBody)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Query, NewBody, Response, Preset>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Query, Body, NewResponse, Preset>

        addPreset<NewPreset extends KnownPresets>(preset: NewPreset): HTTPBodyBuilder<Domain, Method, Path, Params, Query, Body, Response, Preset | NewPreset>
        addPreset<NewPreset extends string>(preset: NewPreset): HTTPBodyBuilder<Domain, Method, Path, Params, Query, Body, Response, Preset | NewPreset>
        withPresets<NewPresets extends [string] | [...string[]]>(...preset: NewPresets): HTTPBodyBuilder<Domain, Method, Path, Params, Query, Body, Response, NewPresets[number]>

        build(): HTTPBody<Domain, Method, Path, Params, Query, Body, Response, 'http' | Preset>
    }


export function HTTPBody
    <Method extends MethodHTTPBody, Path extends string, Domain extends string = ''>
    (method: Method, path: Path, domain?: Domain)
    : HTTPBodyBuilder<
        Domain,
        Method,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito.Str>>,
        pito.Any,
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
            body: pito.Any(),
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
        withBody(body) {
            this.working.body = body as any
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
            // @ts-expect-error
            this.working.presets.push('http')
            this.working.presets = Array.from(new Set(this.working.presets))
            return this.working
        }

    }
}