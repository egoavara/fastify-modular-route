import { pito } from "pito"
import { AddPitoHeader, HeaderKeys, PitoHeader } from "./headers"
import { MethodHTTPBody } from "./methods"
import { ParseRouteKeys } from "./utils"

export type HTTPBody
    <
    Domain extends string,
    Method extends MethodHTTPBody,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    Headers extends PitoHeader = PitoHeader,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Body extends pito = pito,
    Response extends pito = pito,
    > = {
        domain: Domain,
        method: Method,
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        body: Body,
        response: Response,
    }
export type InferHTTPBody<T> = T extends HTTPBody<infer Domain, infer Method, infer Path, infer Params, infer Headers, infer Query, infer Body, infer Response>
    ? {
        Domain: Domain,
        Method: Method,
        Path: Path,
        Params: Params,
        Headers: Headers,
        Query: Query,
        Body: Body,
        Response: Response,
    }
    : never

export type HTTPBodyBuilder
    <
    Domain extends string,
    Method extends MethodHTTPBody,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    Headers extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Body extends pito = pito,
    Response extends pito = pito,
    > = {
        working: HTTPBody<Domain, Method, Path, Params, Headers, Query, Body, Response>
        withParams
            <NewParams extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>>
            (params: NewParams)
            : HTTPBodyBuilder<Domain, Method, Path, NewParams, Headers, Query, Body, Response>
        addHeaders
            <HKey extends HeaderKeys, HVal extends pito>
            (key: HKey, val: HVal)
            : HTTPBodyBuilder<Domain, Method, Path, Params, AddPitoHeader<Headers, HKey, HVal>, Query, Body, Response>
        withHeaders
            <NewHeaders extends pito.obj<Record<string, pito>>>
            (headers: NewHeaders)
            : HTTPBodyBuilder<Domain, Method, Path, Params, NewHeaders, Query, Body, Response>
        withQuery
            <NewQuery extends pito.obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Headers, NewQuery, Body, Response>
        withBody
            <NewBody extends pito>
            (body: NewBody)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Headers, Query, NewBody, Response>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Headers, Query, Body, NewResponse>
        build(): HTTPBody<Domain, Method, Path, Params, Headers, Query, Body, Response>
    }
export function HTTPBody
    <Domain extends string, Method extends MethodHTTPBody, Path extends string>
    (domain: Domain, method: Method, path: Path)
    : HTTPBodyBuilder<
        Domain,
        Method,
        Path,
        pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
        pito.obj<{}>,
        pito.obj<{}>,
        pito.obj<{}>,
        pito.obj<{}>
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g);
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.str()]))
    return {
        working: {
            domain: domain,
            method: method,
            path: path,
            // @ts-expect-error
            params: pito.obj(params),
            query: pito.obj({}),
            headers: pito.obj({}),
            body: pito.obj({}),
            response: pito.obj({}),
        },
        withParams(params) {
            this.working.params = params
            return this as any
        },
        addHeaders(key, val) {
            // @ts-expect-error
            this.working.headers.properties[key] = val
            // @ts-expect-error
            this.working.headers.required.push(key)
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
        withBody(body) {
            this.working.body = body as any
            return this as any
        },
        withResponse(response) {
            this.working.response = response as any
            return this as any
        },
        build() {
            return this.working
        }

    }
}