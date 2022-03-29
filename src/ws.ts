import { pito } from "pito";
import { MethodWS } from "./methods";
import { ParseRouteKeys } from "./utils";

export type WS<Path extends string> = {
    method: MethodWS,
    path: Path,
    params: pito.obj<Record<ParseRouteKeys<Path>, pito<any, any, { type: 'string' | 'number' | 'integer' | 'boolean' }, any>>>,
    headers: pito.obj<Record<string, pito>>,
    query: pito.obj<Record<string, pito>>,
    // 
    inputMessage: pito,
    outputMessage: pito,
}