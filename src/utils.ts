export type ParseRouteKeys<Route extends string> =
    Route extends `/${string}:${infer K}/${infer LEFT}`
    ? K | ParseRouteKeys<LEFT>
    : Route extends `/${string}:${infer K}`
    ? K
    : never