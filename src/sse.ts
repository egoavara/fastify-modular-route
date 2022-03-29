import { pito } from "pito";
import { MethodSSE } from "./methods";
import { ParseRouteKeys } from "./utils";

export type SSE<Path extends string> = {
    method: MethodSSE,
    path: Path,
    params: pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    headers: pito.obj<Record<string, pito>>,
    query: pito.obj<Record<string, pito>>,
    // 
    outputMessage: pito,
}