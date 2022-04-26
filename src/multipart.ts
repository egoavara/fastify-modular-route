import { pito } from "pito"
import { PitoHeader } from "./headers"
import { Presets } from "./preset"
import { ParseRouteKeys } from "./utils"
import { Readable } from 'stream'

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
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends PitoHeader = PitoHeader,
    Query extends pito.Obj<Record<string, pito>> = pito.Obj<Record<string, pito>>,
    Preset extends Presets = undefined,
    > = {
        domain: Domain,
        method: 'MULTIPART',
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        response: Response,
        presets: Preset[],
    }
export type InferMultipart<T> = T extends Multipart<infer Domain, infer Path, infer Params, infer Headers, infer Query, infer Preset>
    ? {
        Domain: Domain,
        Path: Path,
        Params: Params,
        Headers: Headers,
        Query: Query,
        Preset: Preset
    }
    : never

export type MultipartBuilder
    <
    Domain extends string,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends PitoHeader = PitoHeader,
    Query extends pito.Obj<Record<string, pito>> = pito.Obj<Record<string, pito>>,
    Preset extends Presets = undefined,
    > = {
        working: Multipart<Domain, Path, Params, Headers, Query, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : MultipartBuilder<Domain, Path, NewParams, Headers, Query, Preset>
        withHeaders
            <NewHeaders extends PitoHeader>
            (headers: NewHeaders)
            : MultipartBuilder<Domain, Path, Params, NewHeaders, Query, Preset>
        withQuery
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : MultipartBuilder<Domain, Path, Params, Headers, NewQuery, Preset>
        withPresets
            <NewPresets extends Presets[]>
            (...presets: NewPresets)
            : MultipartBuilder<Domain, Path, Params, Headers, Query, NewPresets[number]>
        build(): Multipart<Domain, Path, Params, Headers, Query, Preset>
    }
export function Multipart
    <Path extends string, Domain extends string,>
    (path: Path, domain?: Domain)
    : MultipartBuilder<
        Domain,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
        pito.Obj<{}>,
        pito.Obj<{}>
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g);
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            path: path,
            method : "MULTIPART",
            // @ts-expect-error
            params: pito.Obj(params),
            query: pito.Obj({}),
            headers: pito.Obj({}),
            body: pito.Obj({}),
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
        withPresets(...presets) {
            this.working.presets = presets as any
            return this as any
        },
        build() {
            return this.working
        }

    }
}