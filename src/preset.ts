export type Presets =
    | 'JWT-bearer'
    | (string & Record<never, never>)
    | undefined