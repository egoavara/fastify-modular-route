import { ReflectType } from "pito"

export type ParseRouteKeysForPath<Route extends string> =
    Route extends `/${infer POST}`
    ? ParseRouteKeysForPath<POST>
    : Route extends `:${infer K}/${infer POST}`
    ? K | ParseRouteKeysForPath<POST>
    : Route extends `${string}/:${infer K}/${infer POST}`
    ? K | ParseRouteKeysForPath<POST>
    : Route extends `${string}/:${infer K}`
    ? K
    : Route extends `:${infer K}`
    ? K
    : never

export type PathToTopic<Path extends string> =
    Path extends `/${infer POST}`
    ? `${PathToTopic<POST>}`
    : Path extends `${infer PRE}/${infer POST}`
    ? `${PRE}.${PathToTopic<POST>}`
    : Path extends string
    ? Path
    : never
export function PathToTopic<Path extends string>(path: Path): PathToTopic<Path> {
    const temp = path.replaceAll('/', '.').replace(/^./, '')
    return temp as PathToTopic<Path>
}
export function intoRegexTopic(topic: string, option?: { namedRegex?: boolean }): RegExp {
    const namedRegex = option?.namedRegex ?? true
    const parts = topic.split('.').map(v => {
        if (v.startsWith(':')) {
            if (namedRegex) {
                return `(?<${v.substring(1)}>[a-zA-Z0-9_\-]+)`
            } else {
                return `([a-zA-Z0-9_\-]+)`
            }
        } else {
            return v
        }
    })
    return new RegExp('^' + parts.join('\\.') + '$')
}

export function formatAPI(method: string, path: string, domain?: string): string {
    if(typeof domain === 'string'){
        return `${domain} ${method.toUpperCase()} ${path}`
    }
    return `${method.toUpperCase()} ${path}`
}

export function isObject(reflect : ReflectType): boolean{
    if(reflect.$typeof === 'object'){
        return true
    }
    if(reflect.$typeof === 'union'){
        return reflect.$args.map(v=>isObject(v)).reduce((curr, val)=>curr && val)
    }
    if(reflect.$typeof === 'intersect'){
        return reflect.$args.map(v=>isObject(v)).reduce((curr, val)=>curr || val)
    }
    return false
}

