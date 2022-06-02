import { pito } from "pito"
import { KnownPresets, AnyPresets } from "./preset.js"
import { ParseRouteKeys } from "./utils.js"

export type LimitFile = {
    fieldNameSize?: number,  // Max field name size in bytes
    fieldSize?: number,      // Max field value size in bytes
    fields?: number,         // Max number of non-file fields
    fileSize?: number,       // For multipart forms, the max file size in bytes
    files?: number,          // Max number of file fields
    headerPairs?: number     // Max number of header key=>value pairs
}

export type Multipart
    <
        Domain extends string,
        Presets extends AnyPresets,

        Path extends string,
        Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito = pito,
        Response extends pito = pito.Any,
        Fail extends pito = pito.Any,
    > = {
        readonly domain: Domain
        presets: Presets[]
        description?: string
        summary?: string
        externalDocs?: { url: string, description?: string }

        readonly method: 'MULTIPART',
        readonly path: Path,
        params: Params,
        query: Query,
        response: Response,
        fail: Fail,
    }

export type MultipartBuilder
    <
        Domain extends string,
        Presets extends AnyPresets,
        Path extends string,

        Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito,
        Response extends pito,
        Fail extends pito,
    > = {
        presets<NewPresets extends KnownPresets>(preset: NewPresets): MultipartBuilder<Domain, Presets | NewPresets, Path, Params, Query, Response, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): MultipartBuilder<Domain, Presets | NewPresets[number], Path, Params, Query, Response, Fail>
        description(contents: string): MultipartBuilder<Domain, Presets, Path, Params, Query, Response, Fail>
        summary(contents: string): MultipartBuilder<Domain, Presets, Path, Params, Query, Response, Fail>
        externalDocs(url: string, description?: string): MultipartBuilder<Domain, Presets, Path, Params, Query, Response, Fail>
        // 
        params
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : MultipartBuilder<Domain, Presets, Path, NewParams, Query, Response, Fail>
        query
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : MultipartBuilder<Domain, Presets, Path, Params, NewQuery, Response, Fail>
        response
            <NewResponse extends pito>
            (response: NewResponse)
            : MultipartBuilder<Domain, Presets, Path, Params, Query, NewResponse, Fail>
        fail
            <NewFail extends pito>
            (fail: NewFail)
            : MultipartBuilder<Domain, Presets, Path, Params, Query, Response, NewFail>

        build(): Multipart<Domain, 'http' | 'multipart' | Presets, Path, Params, Query, Response, Fail>
    }
export function Multipart
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : MultipartBuilder<
        Domain,
        'http' | 'multipart',
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number, any, any, any>>>,
        pito.Any,
        pito.Any,
        pito.Any
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: Multipart<Domain, string, Path, pito.Obj<Record<ParseRouteKeys<Path>, pito.Str>>, pito.Any, pito.Any> = {
        // @ts-expect-error
        domain: domain ?? '',
        method: 'MULTIPART',
        presets: ['http', 'multipart'],
        path: path,
        // @ts-expect-error
        params: pito.Obj(params),
        query: pito.Any(),
        response: pito.Any(),
        fail: pito.Any(),
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
        fail(fail) {
            target.fail = fail as any
            return this as any
        },
        // @ts-expect-error
        build() {
            target.presets = Array.from(new Set([...target.presets, 'http', 'multipart']))
            return target
        }

    }
}