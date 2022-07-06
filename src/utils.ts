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
export function intoRegexTopic(topic: string): RegExp {
    const parts = topic.split('.').map(v=>{
        if(v.startsWith(':')){
            return `(?<${v.substring(1)}>[a-zA-Z_\-]+)`
        }else{
            return v
        }
    })
    
    return new RegExp('^' + parts.join('\\.') + '$')
}