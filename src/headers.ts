import { pito } from "pito"

export type HeaderKeys =
    | 'Authorization'
    | 'Content-Type'
    | (string & Record<never, never>)

export type PitoHeader = pito.Obj<Record<string, pito>>