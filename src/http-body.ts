import { pito } from "pito"
import { MethodHTTPBody } from "./methods"
import { ParseRouteKeys } from "./utils"

export type HTTPBody
    <
    Method extends MethodHTTPBody,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    Headers extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Body extends pito = pito,
    Response extends pito = pito,
    > = {
        method: Method,
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        body: Body,
        response: Response,
    }
export type InferHTTPBody<T> = T extends HTTPBody<infer Method, infer Path, infer Params, infer Headers, infer Query, infer Body, infer Response>
    ? {
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
    Method extends MethodHTTPBody,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    Headers extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Body extends pito = pito,
    Response extends pito = pito,
    > = {
        working: HTTPBody<Method, Path, Params, Headers, Query, Body, Response>
        withParams
            <NewParams extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>>
            (params: NewParams)
            : HTTPBodyBuilder<Method, Path, NewParams, Headers, Query, Body, Response>
        withHeaders
            <NewHeaders extends pito.obj<Record<string, pito>>>
            (headers: NewHeaders)
            : HTTPBodyBuilder<Method, Path, Params, NewHeaders, Query, Body, Response>
        withQuery
            <NewQuery extends pito.obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPBodyBuilder<Method, Path, Params, Headers, NewQuery, Body, Response>
        withBody
            <NewBody extends pito>
            (body: NewBody)
            : HTTPBodyBuilder<Method, Path, Params, Headers, Query, NewBody, Response>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPBodyBuilder<Method, Path, Params, Headers, Query, Body, NewResponse>
        build(): HTTPBody<Method, Path, Params, Headers, Query, Body, Response>
    }
export function HTTPBody
    <Method extends MethodHTTPBody, Path extends string>
    (method: Method, path: Path)
    : HTTPBodyBuilder<
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