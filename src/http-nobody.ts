import { pito } from "pito";
import { MethodHTTPNoBody } from "./methods";
import { ParseRouteKeys } from "./utils";

export type HTTPNoBody
    <
    Method extends MethodHTTPNoBody, Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    Headers extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Response extends pito = pito,
    > = {
        method: Method,
        path: Path,
        params: Params,
        headers: Headers,
        query: Query,
        response: Response,
    }
export type InferHTTPNoBody<T> = T extends HTTPNoBody<infer Method, infer Path, infer Params, infer Headers, infer Query, infer Response>
    ? {
        Method: Method,
        Path: Path,
        Params: Params,
        Headers: Headers,
        Query: Query,
        Response: Response,
    }
    : never

export type HTTPNoBodyBuilder
    <
    Method extends MethodHTTPNoBody,
    Path extends string,
    Params extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>> = pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    Headers extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Query extends pito.obj<Record<string, pito>> = pito.obj<Record<string, pito>>,
    Response extends pito = pito,
    > = {
        working: HTTPNoBody<Method, Path, Params, Headers, Query, Response>
        withParams
            <NewParams extends pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>>
            (params: NewParams)
            : HTTPNoBodyBuilder<Method, Path, NewParams, Headers, Query, Response>
        withHeaders
            <NewHeaders extends pito.obj<Record<string, pito>>>
            (headers: NewHeaders)
            : HTTPNoBodyBuilder<Method, Path, Params, NewHeaders, Query, Response>
        withQuery
            <NewQuery extends pito.obj<Record<string, pito>>>
            (query: NewQuery)
            : HTTPNoBodyBuilder<Method, Path, Params, Headers, NewQuery, Response>
        withResponse
            <NewResponse extends pito>
            (response: NewResponse)
            : HTTPNoBodyBuilder<Method, Path, Params, Headers, Query, NewResponse>
        build(): HTTPNoBody<Method, Path, Params, Headers, Query, Response>
    }
export function HTTPNoBody
    <Method extends MethodHTTPNoBody, Path extends string>
    (method: Method, path: Path)
    : HTTPNoBodyBuilder<
        Method,
        Path,
        pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
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
        withResponse(response) {
            this.working.response = response as any
            return this as any
        },
        build() {
            return this.working
        }

    }
}