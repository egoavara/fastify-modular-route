import { pito } from "pito";
import { PitoHeader } from "./headers";
import { MethodSSE } from "./methods";
import { Presets } from "./preset";
import { ParseRouteKeys } from "./utils";


export type SSE
    <
    Domain extends string,
    Path extends string,
    Params extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends pito = PitoHeader,
    Query extends pito = pito,
    Packet extends pito = pito,
    Preset extends Presets = undefined,
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
export type InferSSE<T> = T extends SSE<infer Domain, infer Path, infer Params, infer Headers, infer Query, infer Packet, infer Preset>
    ? {
        Domain: Domain,
        Path: Path,
        Params: Params,
        Headers: Headers,
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
    Headers extends pito,
    Query extends pito,
    Packet extends pito,
    Preset extends Presets,
    > = {
        working: SSE<Domain, Path, Params, Headers, Query, Packet, Preset>
        withParams
            <NewParams extends pito.Obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : SSEBuilder<Domain, Path, NewParams, Headers, Query, Packet, Preset>
        withHeaders
            <NewHeaders extends pito>
            (headers: NewHeaders)
            : SSEBuilder<Domain, Path, Params, NewHeaders, Query, Packet, Preset>
        withQuery
            <NewQuery extends pito>
            (query: NewQuery)
            : SSEBuilder<Domain, Path, Params, Headers, NewQuery, Packet, Preset>
        withPacket
            <NewPacket extends pito>
            (packet: NewPacket)
            : SSEBuilder<Domain, Path, Params, Headers, Query, NewPacket, Preset>

        withPresets
            <NewPresets extends Presets[]>
            (...presets: NewPresets)
            : SSEBuilder<Domain, Path, Params, Headers, Query, Packet, NewPresets[number]>
        build(): SSE<Domain, Path, Params, Headers, Query, Packet, Preset>
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
        pito.Any,
        never
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g);
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            method: 'SSE',
            path: path,
            // @ts-expect-error
            params: pito.Obj(params),
            query: pito.Any(),
            headers: pito.Any(),
            packet: pito.Any(),
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
        withPacket(packet) {
            this.working.packet = packet as any
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