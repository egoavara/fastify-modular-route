import { pito, PitoAny, PitoObj } from "pito"
import { AnyPresets, KnownPresets } from "./preset.js"
import { ParseRouteKeysForPath } from "./utils.js"

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
        Params extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>> = PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito = pito,
        Response extends pito = PitoAny,
        Fail extends pito = PitoAny,
    > = {
        readonly domain: Domain
        readonly presets: Presets[]
        readonly description?: string
        readonly summary?: string
        readonly externalDocs?: { url: string, description?: string }
        readonly method: 'MULTIPART',
        readonly path: Path,
        readonly params: Params,
        readonly query: Query,
        readonly response: Response,
        readonly fail: Fail,
    }

export type MultipartBuilder
    <
        Domain extends string,
        Presets extends AnyPresets,
        Path extends string,

        Params extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito,
        Response extends pito,
        Fail extends pito,
    > = {
        // metadata
        presets<NewPresets extends KnownPresets>(preset: NewPresets): MultipartBuilder<Domain, Presets | NewPresets, Path, Params, Query, Response, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): MultipartBuilder<Domain, Presets | NewPresets[number], Path, Params, Query, Response, Fail>
        description(contents: string): MultipartBuilder<Domain, Presets, Path, Params, Query, Response, Fail>
        summary(contents: string): MultipartBuilder<Domain, Presets, Path, Params, Query, Response, Fail>
        externalDocs(url: string, description?: string): MultipartBuilder<Domain, Presets, Path, Params, Query, Response, Fail>
        // arguments
        params
            <NewParams extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : MultipartBuilder<Domain, Presets, Path, NewParams, Query, Response, Fail>
        query
            <NewQuery extends PitoObj<Record<string, pito>>>
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
        // build
        build(): Multipart<Domain, 'http' | 'multipart' | Presets, Path, Params, Query, Response, Fail>
    }
export function Multipart
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : MultipartBuilder<
        Domain,
        'http' | 'multipart',
        Path,
        PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number, any, any, any>>>,
        PitoAny,
        PitoAny,
        PitoAny
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: any = {
        domain: domain ?? '',
        method: 'MULTIPART',
        presets: ['http', 'multipart'],
        path: path,
        params: PitoObj(params),
        query: PitoAny(),
        response: PitoAny(),
        fail: PitoAny(),
    }
    return {
        // ==================================================
        // shorts
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
        // ==================================================
        // build
        build() {
            target.presets = Array.from(new Set([...target.presets, 'http', 'multipart']))
            return target
        }

    }
}