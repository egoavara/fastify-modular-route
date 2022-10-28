import { pito, PitoAny, PitoObj } from "pito"
import { MethodHTTPNoBody } from "./methods.js"
import { ParamsOption, QueryOption, ResponseOption } from "./options.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { formatAPI, isObject, ParseRouteKeysForPath } from "./utils.js"

export type HTTPNoBody
    <
        Domain extends string,
        Presets extends AnyPresets,
        Method extends MethodHTTPNoBody,
        Path extends string,
        Params extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>> = PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito = pito,
        Response extends pito = pito,
        Fail extends pito = pito,
    > = {
        readonly domain: Domain
        readonly presets: Presets[]
        readonly description?: string
        readonly summary?: string
        readonly externalDocs?: { url: string, description?: string }
        // 
        readonly method: Method
        readonly path: Path
        readonly params: Params
        readonly query: Query
        readonly response: Response
        readonly fail: Fail
    }

export type HTTPNoBodyBuilder
    <
        Domain extends string,
        Presets extends AnyPresets,
        Method extends MethodHTTPNoBody,
        Path extends string,
        Params extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>,
        Query extends pito,
        Response extends pito,
        Fail extends pito = pito,
    > = {
        // metadata
        presets<NewPresets extends KnownPresets>(preset: NewPresets): HTTPNoBodyBuilder<Domain, Presets | NewPresets, Method, Path, Params, Query, Response, Fail>
        presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): HTTPNoBodyBuilder<Domain, Presets | NewPresets[number], Method, Path, Params, Query, Response, Fail>
        description(contents: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, Fail>
        summary(contents: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, Fail>
        externalDocs(url: string, description?: string): HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, Fail>
        // arguments
        params
            <NewParams extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>>
            (params: NewParams, option? :ParamsOption)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, NewParams, Query, Response, Fail>
        query
            <NewQuery extends pito>
            (query: NewQuery, option? :QueryOption)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, NewQuery, Response, Fail>
        response
            <NewResponse extends pito>
            (response: NewResponse, option? :ResponseOption)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, NewResponse, Fail>
        fail
            <NewFail extends pito>
            (fail: NewFail)
            : HTTPNoBodyBuilder<Domain, Presets, Method, Path, Params, Query, Response, NewFail>
        // build
        build(): HTTPNoBody<Domain, 'http' | Presets, Method, Path, Params, Query, Response, Fail>
    }
export function HTTPNoBody
    <Method extends MethodHTTPNoBody, Path extends string, Domain extends string = ''>
    (method: Method, path: Path, domain?: Domain)
    : HTTPNoBodyBuilder<
        Domain,
        'http',
        Method,
        Path,
        PitoObj<Record<ParseRouteKeysForPath<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
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
        response: PitoAny(),
        fail: PitoAny()
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
        params(params) {
            target.params = params as any
            return this as any
        },
        query(query, opt) {
            target.query = query as any
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
        response(response) {
            target.response = response as any
            return this as any
        },
        fail(fail) {
            target.fail = fail
            return this as any
        },
        // ==================================================
        build() {
            target.presets = Array.from(new Set([...target.presets, 'http']))
            return target
        }

    }
}