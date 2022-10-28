import { pito, PitoAny, PitoObj, PitoStr } from "pito"
import { ParamsOption } from "./options.js"
import { AnyPresets, KnownPresets } from "./preset.js"
import { ParseRouteKeysForPath, PathToTopic } from "./utils.js"

export type Share<Domain extends string, Presets extends AnyPresets, Path extends string, Params extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>, Payload extends pito> = {
    readonly method: 'SHARE'
    readonly domain: Domain
    readonly presets: Presets[]
    readonly description?: string
    readonly summary?: string
    readonly externalDocs?: { url: string, description?: string }
    // 
    readonly path: Path
    readonly topic: PathToTopic<Path>
    readonly params: Params
    readonly payload: Payload
}
export type ShareBuilder<Domain extends string, Presets extends AnyPresets, Path extends string, Params extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>, Payload extends pito> = {
    // metadata
    presets<NewPresets extends KnownPresets>(preset: NewPresets): ShareBuilder<Domain, Presets | NewPresets, Path, Params, Payload>
    presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): ShareBuilder<Domain, Presets | NewPresets[number], Path, Params, Payload>
    description(contents: string): ShareBuilder<Domain, Presets, Path, Params, Payload>
    summary(contents: string): ShareBuilder<Domain, Presets, Path, Params, Payload>
    externalDocs(url: string, description?: string): ShareBuilder<Domain, Presets, Path, Params, Payload>
    // arguments
    params
        <NewParams extends PitoObj<Record<ParseRouteKeysForPath<Path>, pito<string | number | boolean, any, any, any>>>>
        (params: NewParams, option? :ParamsOption)
        : ShareBuilder<Domain, Presets, Path, NewParams, Payload>
    payload<NewPayload extends pito>(newPayload: NewPayload): ShareBuilder<Domain, Presets, Path, Params, NewPayload>
    // build
    build(): Share<Domain, Presets, Path, Params, Payload>
}
export function Share<Path extends string, Domain extends string = ''>(path: Path, domain?: Domain): ShareBuilder<Domain, 'share', Path, PitoObj<Record<ParseRouteKeysForPath<Path>, PitoStr>>, PitoAny> {
    const paramKeys = path.match(/:[a-zA-Z_\-]+/g)
    const params = Object.fromEntries((paramKeys ?? []).map(v => [v, pito.Str()]))
    const result: any = {
        method: 'SHARE',
        domain: domain ?? '',
        presets: ['share'],
        path: path,
        topic: PathToTopic(path),
        params: PitoObj(params),
        payload: PitoAny() as pito
    }
    return {
        // @ts-expect-error
        presets(...presets) {
            result.presets.push(...presets)
            return this
        },
        description(contents) {
            result.description = contents
            return this
        },
        summary(contents) {
            result.summary = contents
            return this
        },
        externalDocs(url, description?) {
            result.externalDocs = { url, ...(description !== undefined ? { description } : {}) }
            return this
        },
        params(params) {
            result.params = params as any
            return this as any
        },
        payload(newPayload) {
            result.payload = newPayload
            return this as any
        },
        build() {
            result.presets = Array.from(new Set([...result.presets, 'share']))
            return result as any
        },
    }
}


