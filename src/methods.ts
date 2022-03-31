
export type MethodHTTPNoBody = "GET" | "HEAD"
export type MethodHTTPBody = "POST" | "PUT" | "PATCH" | "DELETE"
export type MethodHTTP = MethodHTTPNoBody | MethodHTTPBody
export type MethodWS = "WS"
export type MethodSSE = "SSE"
export type MethodAll = MethodHTTP | MethodWS | MethodSSE
