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
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,

    Query extends pito = pito,
    Response extends pito = pito.Any,
    Preset extends AnyPresets = never,
    > = {
        domain: Domain,
        method: 'MULTIPART',
        path: Path,
        params: Params,

        query: Query,
        response: Response,
        presets: Preset[],
    }
export type InferMultipart<T> = T extends Multipart<infer Domain, infer Path, infer Params, infer Query, infer Response, infer Preset>
    ? {
        Domain: Domain,
        Path: Path,
        Params: Params,
        Query: Query,
        Response: Response,
        Preset: Preset
    }
    : never

export type MultipartBuilder
    <
    Domain extends string,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,

    Query extends pito,
    Response extends pito,
    Preset extends AnyPresets,
    > = {
        working: Multipart<Domain, Path, Params, Query, Response, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : MultipartBuilder<Domain, Path, NewParams, Query, Response, Preset>
        withQuery
            <NewQuery extends pito.Obj<Record<string, pito>>>
            (query: NewQuery)
            : MultipartBuilder<Domain, Path, Params, NewQuery, Response, Preset>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : MultipartBuilder<Domain, Path, Params, Query, NewResponse, Preset>


        addPreset<NewPreset extends KnownPresets>(preset: NewPreset): MultipartBuilder<Domain, Path, Params, Query, Response, Preset | NewPreset>
        addPreset<NewPreset extends string>(preset: NewPreset): MultipartBuilder<Domain, Path, Params, Query, Response, Preset | NewPreset>
        withPresets<NewPresets extends [string] | [...string[]]>(...preset: NewPresets): MultipartBuilder<Domain, Path, Params, Query, Response, NewPresets[number]>


        build(): Multipart<Domain, Path, Params, Query, Response, Preset>
    }
export function Multipart
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : MultipartBuilder<
        Domain,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number, any, any, any>>>,
        pito.Any,
        pito.Any,
        never
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            path: path,
            method: "MULTIPART",
            // @ts-expect-error
            params: pito.Obj(params),
            query: pito.Any(),
            headers: pito.Any(),
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