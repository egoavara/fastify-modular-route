import { pito } from "pito";
import { PitoHeader } from "./headers";
import { MethodSSE } from "./methods";
import { Security } from "./security";
import { ParseRouteKeys } from "./utils";


export type SSE
    <
    Domain extends string,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends PitoHeader = PitoHeader,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Packet extends pito = pito,
    Secure extends Security = undefined,
    > = {
        domain: Domain,
        method: MethodSSE,
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        packet: Packet,
        secure: Secure,
    }
export type InferSSE<T> = T extends SSE<infer Domain, infer Path, infer Params, infer Headers, infer Query, infer Packet, infer Secure>
    ? {
        Domain: Domain,
        Path: Path,
        Params: Params,
        Headers: Headers,
        Query: Query,
        Packet: Packet,
        Secure: Secure,
    }
    : never

export type SSEBuilder
    <
    Domain extends string,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends PitoHeader = PitoHeader,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Packet extends pito = pito,
    Secure extends Security = undefined,
    > = {
        working: SSE<Domain, Path, Params, Headers, Query, Packet, Secure>
        withParams
            <NewParams extends pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : SSEBuilder<Domain, Path, NewParams, Headers, Query, Packet, Secure>
        withHeaders
            <NewHeaders extends PitoHeader>
            (headers: NewHeaders)
            : SSEBuilder<Domain, Path, Params, NewHeaders, Query, Packet, Secure>
        withQuery
            <NewQuery extends pito.obj<Record<string, pito>>>
            (query: NewQuery)
            : SSEBuilder<Domain, Path, Params, Headers, NewQuery, Packet, Secure>
        withPacket
            <NewPacket extends pito>
            (packet: NewPacket)
            : SSEBuilder<Domain, Path, Params, Headers, Query, NewPacket, Secure>

        withSecure
            <NewSecure extends Security>
            (secure: NewSecure)
            : SSEBuilder<Domain, Path, Params, Headers, Query, Packet, NewSecure>
        build(): SSE<Domain, Path, Params, Headers, Query, Packet, Secure>
    }

export function SSE
    <Path extends string, Domain extends string = ''>
    (path: Path, domain?: Domain)
    : SSEBuilder<
        Domain,
        Path,
        pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
        pito.obj<{}>,
        pito.obj<{}>,
        pito.obj<{}>
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g);
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
            method: 'SSE',
            path: path,
            // @ts-expect-error
            params: pito.obj(params),
            query: pito.obj({}),
            headers: pito.obj({}),
            body: pito.obj({}),
            response: pito.obj({}),
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
        withSecure(secure) {
            this.working.secure = secure as any
            return this as any
        },
        build() {
            return this.working
        }

    }
}