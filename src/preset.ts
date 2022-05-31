export type KnownPresets =
    | 'jwt-bearer'
    | 'http'
    | 'multipart'
    | 'sse'
    | 'ws'
export type AnyPresets =
    | KnownPresets
    | (string & Record<never, never>)