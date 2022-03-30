import { pito } from "pito"

export type HeaderKeys =
    | 'Authorization'
    | 'Content-Type'
    | (string & Record<never, never>)

export type PitoHeader = pito.obj<Record<string, pito>>
export type AddPitoHeader<Header extends PitoHeader, HKey extends HeaderKeys, HVal extends pito> = Header extends pito.obj<infer Obj>
    ? pito.obj<Obj & { [_ in HKey]: HVal }>
    : never