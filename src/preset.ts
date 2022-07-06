export type KnownPresets =
    | 'jwt-bearer'
    | 'http'
    | 'multipart'
    | 'sse'
    | 'ws'
    | 'share'
export type AnyPresets =
    | KnownPresets
    | (string & Record<never, never>)