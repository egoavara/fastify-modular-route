export type ParseRouteKeys<Route extends string> =
    Route extends `/${infer POST}`
    ? ParseRouteKeys<POST>
    : Route extends `${string}/:${infer K}/${infer POST}`
    ? K | ParseRouteKeys<POST>
    : Route extends `:${infer K}/${infer POST}`
    ? K | ParseRouteKeys<POST>
    : Route extends `${string}/:${infer K}`
    ? K
    : Route extends `:${infer K}`
    ? K
    : never