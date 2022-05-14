import { pito } from "pito"
import { MethodSSE } from "./methods.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { ParseRouteKeys } from "./utils.js"


export type SSE
    <
    Domain extends string,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Query extends pito = pito,
    Packet extends pito = pito,
    Preset extends AnyPresets = never,
    > = {
        domain: Domain,
        method: MethodSSE,
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        packet: Packet,
        presets: Preset[],
    }
export type InferSSE<T> = T extends SSE<infer Domain, infer Path, infer Params, infer Query, infer Packet, infer Preset>
    ? {
        Domain: Domain,
        Path: Path,
        Params: Params,
        Query: Query,
        Packet: Packet,
        Preset: Preset,
    }
    : never

export type SSEBuilder
    <
    Domain extends string,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,

    Query extends pito,
    Packet extends pito,
    Preset extends AnyPresets,
    > = {
        working: SSE<Domain, Path, Params, Query, Packet, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : SSEBuilder<Domain, Path, NewParams, Query, Packet, Preset>

        withQuery
            <NewQuery extends pito>
            (query: NewQuery)
            : SSEBuilder<Domain, Path, Params, NewQuery, Packet, Preset>
        withPacket
            <NewPacket extends pito>
            (packet: NewPacket)
            : SSEBuilder<Domain, Path, Params, Query, NewPacket, Preset>


        withPreset<NewPreset extends KnownPresets>(preset: NewPreset): SSEBuilder<Domain, Path, Params, Query, Packet, Preset | NewPreset>
        withPreset<NewPreset extends string>(preset: NewPreset): SSEBuilder<Domain, Path, Params, Query, Packet, Preset | NewPreset>

        build(): SSE<Domain, Path, Params, Query, Packet, Preset>
    }

export function SSE
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : SSEBuilder<
        Domain,
        Path,
        pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        pito.Any,
        pito.Any,
        never
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            method: 'SSE',
            path: path,
            // @ts-expect-error
            params: pito.Obj(params),
            query: pito.Any(),
            packet: pito.Any(),
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
        withPacket(packet) {
            this.working.packet = packet as any
            return this as any
        },
        withPreset(preset: any) {
            // @ts-expect-error
            this.working.presets.push(preset)
            return this as any
        },
        build() {
            return this.working
        }

    }
}