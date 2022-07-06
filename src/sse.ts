import { pito } from "pito"
import { MethodSSE } from "./methods.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { ParseRouteKeysForPath } from "./utils.js"


export type SSE
    <
        Domain extends string,
        Presets extends AnyPresets,
        Path extends string,
        Params extends pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito = pito,
        Packet extends pito = pito,
        Fail extends pito = pito.Any,
    > = {
        readonly domain: Domain
        readonly presets: Presets[]
        readonly description?: string
        readonly summary?: string
        readonly externalDocs?: { url: string, description?: string }

        readonly method: MethodSSE,
        readonly path: Path,
        readonly params: Params,
        readonly query: Query,
        readonly packet: Packet,
        readonly fail: Fail,
    }

export type SSEBuilder
    <
        Domain extends string,
        Presets extends AnyPresets,

        Path extends string,
        Params extends pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito,
        Packet extends pito,
        Fail extends pito,
    > = {
        // metadata
        presets<NewPresets extends KnownPresets>(preset: NewPresets): SSEBuilder<Domain, Presets | NewPresets, Path, Params, Query, Packet, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): SSEBuilder<Domain, Presets | NewPresets[number], Path, Params, Query, Packet, Fail>
        description(contents: string): SSEBuilder<Domain, Presets, Path, Params, Query, Packet, Fail>
        summary(contents: string): SSEBuilder<Domain, Presets, Path, Params, Query, Packet, Fail>
        externalDocs(url: string, description?: string): SSEBuilder<Domain, Presets, Path, Params, Query, Packet, Fail>
        // arguments
        params
            <NewParams extends pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : SSEBuilder<Domain, Presets, Path, NewParams, Query, Packet, Fail>
        query
            <NewQuery extends pito>
            (query: NewQuery)
            : SSEBuilder<Domain, Presets, Path, Params, NewQuery, Packet, Fail>
        packet
            <NewPacket extends pito>
            (packet: NewPacket)
            : SSEBuilder<Domain, Presets, Path, Params, Query, NewPacket, Fail>
        fail
            <NewFail extends pito>
            (fail: NewFail)
            : SSEBuilder<Domain, Presets, Path, Params, Query, Packet, NewFail>
        // build
        build(): SSE<Domain, 'http' | 'sse' | Presets, Path, Params, Query, Packet, Fail>
    }

export function SSE
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : SSEBuilder<
        Domain,
        'http' | 'sse',
        Path,
        pito.Obj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        pito.Any,
        pito.Any,
        pito.Any
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: any = {
        domain: domain ?? '',
        method: 'SSE',
        presets: ['http', 'sse'],
        path: path,
        params: pito.Obj(params),
        query: pito.Any(),
        packet: pito.Any(),
        fail: pito.Any()
    }
    return {
        // ==================================================
        // metadata
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
        // ==================================================
        // arguments
        params(params) {
            target.params = params as any
            return this as any
        },
        query(query) {
            target.query = query as any
            return this as any
        },
        packet(packet) {
            target.packet = packet as any
            return this as any
        },
        fail(fail) {
            target.fail = fail as any
            return this as any
        },
        // ==================================================
        // build
        build() {
            target.presets = Array.from(new Set([...target.presets, 'http', 'sse']))
            return target
        }

    }
}