export type Presets =
    | 'jwt-bearer'
    | 'manual-authid'
    | (string & Record<never, never>)
    | undefined