export type KnownPresets =
    | 'jwt-bearer'
    | 'manual-authid'
export type AnyPresets =
    | KnownPresets
    | (string & Record<never, never>)