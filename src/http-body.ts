import { pito, PitoAny, PitoObj, PitoStr } from "pito"
import { MethodHTTPBody } from "./methods.js"
import { BodyOption, ParamsOption, QueryOption, ResponseOption } from "./options.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { formatAPI, isObject, ParseRouteKeysForPath } from "./utils.js"

export type HTTPBody
    <
        Domain extends string,
        Presets extends AnyPresets,
        Method extends MethodHTTPBody,
        Path extends string,
        Params extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>> = PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito = PitoAny,
        Body extends pito = PitoAny,
        Response extends pito = PitoAny,
        Fail extends pito = PitoAny
    > = {
        readonly domain: Domain
        readonly presets: Presets[]
        readonly description?: string
        readonly summary?: string
        readonly externalDocs?: { url: string, description?: string }
        // 
        readonly method: Method,
        readonly path: Path,
        readonly params: Params,
        readonly query: Query,
        readonly body: Body,
        readonly response: Response,
        readonly fail: Fail,
    }

export type HTTPBodyBuilder
    <
        Domain extends string,
        Presets extends AnyPresets,
        Method extends MethodHTTPBody,
        Path extends string,
        Params extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito,
        Body extends pito,
        Response extends pito,
        Fail extends pito
    > = {
        presets<NewPresets extends KnownPresets>(preset: NewPresets): HTTPBodyBuilder<Domain, Presets | NewPresets, Method, Path, Params, Query, Body, Response, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): HTTPBodyBuilder<Domain, Presets | NewPresets[number], Method, Path, Params, Query, Body, Response, Fail>
        description(contents: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response, Fail>
        summary(contents: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response, Fail>
        externalDocs(url: string, description?: string): HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response, Fail>
        // 
        params
            <NewParams extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams, option?: ParamsOption)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, NewParams, Query, Body, Response, Fail>
        query
            <NewQuery extends pito>
            (query: NewQuery, option?: QueryOption)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, NewQuery, Body, Response, Fail>
        body
            <NewBody extends pito>
            (body: NewBody, option?: BodyOption)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, NewBody, Response, Fail>
        response
            <NewResponse extends pito>
            (response: NewResponse, option?: ResponseOption)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, NewResponse, Fail>
        fail
            <NewFail extends pito>
            (fail: NewFail)
            : HTTPBodyBuilder<Domain, Presets, Method, Path, Params, Query, Body, Response, NewFail>
        build(): HTTPBody<Domain, Presets, Method, Path, Params, Query, Body, Response, Fail>
    }

export function HTTPBody
    <Method extends MethodHTTPBody, Path extends string, Domain extends string = ''>
    (method: Method, path: Path, domain?: Domain)
    : HTTPBodyBuilder<
        Domain,
        'http',
        Method,
        Path,
        PitoObj<Record<ParseRouteKeysForPath<Path>, PitoStr>>,
        PitoAny,
        PitoAny,
        PitoAny,
        PitoAny
    > {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const target: any = {
        domain: domain ?? '',
        method: method,
        presets: ['http'],
        path: path,
        params: PitoObj(params),
        query: PitoAny(),
        body: PitoAny(),
        response: PitoAny(),
        fail: PitoAny(),
    }
    return {
        // ==================================================
        // short
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
        params(params, opt) {
            target.params = params as any
            if (opt?.noCheck === true) {
                return this as any
            }
            return this as any
        },
        query(query: pito, opt) {
            target.query = query as pito
            if (opt?.noCheck === true) {
                return this as any
            }
            if(opt?.allowAny !== true && query.$typeof ==='any'){
                throw new Error(`${formatAPI(method, path, domain)} : query : not allowed 'any'`)
            }
            if(opt?.allowNonObject !== true && !isObject(query)){
                throw new Error(`${formatAPI(method, path, domain)} : query : not allowed non object type`)
            }
            return this as any
        },
        body(body: any, opt) {
            target.body = body as any
            if (opt?.noCheck === true) {
                return this as any
            }
            return this as any
        },
        response(response: any, opt) {
            target.response = response as any
            if (opt?.noCheck === true) {
                return this as any
            }
            return this as any
        },
        fail(fail) {
            target.fail = fail as any
            return this as any
        },
        // ==================================================
        // build
        build() {
            target.presets = Array.from(new Set(['http', ...target.presets]))
            return target
        }
    }
}