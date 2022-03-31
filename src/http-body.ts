import { pito } from "pito"
import { PitoHeader } from "./headers"
import { MethodHTTPBody } from "./methods"
import { Security } from "./security"
import { ParseRouteKeys } from "./utils"

export type HTTPBody
    <
    Domain extends string,
    Method extends MethodHTTPBody,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends PitoHeader = PitoHeader,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Body extends pito = pito,
    Response extends pito = pito,
    Secure extends Security = undefined,
    > = {
        domain: Domain,
        method: Method,
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        body: Body,
        response: Response,
        secure: Secure,
    }
export type InferHTTPBody<T> = T extends HTTPBody<infer Domain, infer Method, infer Path, infer Params, infer Headers, infer Query, infer Body, infer Response, infer Secure>
    ? {
        Domain: Domain,
        Method: Method,
        Path: Path,
        Params: Params,
        Headers: Headers,
        Query: Query,
        Body: Body,
        Response: Response,
        Secure: Secure,
    }
    : never

export type HTTPBodyBuilder
    <
    Domain extends string,
    Method extends MethodHTTPBody,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>,
    Headers extends PitoHeader = PitoHeader,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Body extends pito = pito,
    Response extends pito = pito,
    Secure extends Security = undefined,
    > = {
        working: HTTPBody<Domain, Method, Path, Params, Headers, Query, Body, Response, Secure>
        withParams
            <NewParams extends pito.obj<Record<ParseRouteKeys<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams)
            : HTTPBodyBuilder<Domain, Method, Path, NewParams, Headers, Query, Body, Response, Secure>
        withHeaders
            <NewHeaders extends PitoHeader>
            (headers: NewHeaders)
            : HTTPBodyBuilder<Domain, Method, Path, Params, NewHeaders, Query, Body, Response, Secure>
        withQuery
            <NewQuery extends pito.obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Headers, NewQuery, Body, Response, Secure>
        withBody
            <NewBody extends pito>
            (body: NewBody)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Headers, Query, NewBody, Response, Secure>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Headers, Query, Body, NewResponse>
        withSecure
            <NewSecure extends Security>
            (secure: NewSecure)
            : HTTPBodyBuilder<Domain, Method, Path, Params, Headers, Query, Body, Response, NewSecure>
        build(): HTTPBody<Domain, Method, Path, Params, Headers, Query, Body, Response, Secure>
    }


export function HTTPBody
    <Method extends MethodHTTPBody, Path extends string, Domain extends string = ''>
    (method: Method, path: Path, domain?: Domain)
    : HTTPBodyBuilder<
        Domain,
        Method,
        Path,
        pito.obj<Record<ParseRouteKeys<Path>, pito.str>>,
        pito.obj<{}>,
        pito.obj<{}>,
        pito.obj<{}>,
        pito.obj<{}>
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g);
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.str()]))
    return {
        working: {
            domain: (domain ?? '') as Domain,
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
        withBody(body) {
            this.working.body = body as any
            return this as any
        },
        withResponse(response) {
            this.working.response = response as any
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