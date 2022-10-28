export interface BaseOption {
    noCheck?: boolean
}
export interface ParamsOption extends BaseOption {
}

export interface QueryOption extends BaseOption {
    allowAny?: boolean
    allowNonObject?: boolean
}

export interface BodyOption extends BaseOption {
}

export interface ResponseOption extends BaseOption {
}

export interface PacketOption extends BaseOption {
}


export interface EventOption extends BaseOption {
}


export interface SendReceiveOption extends BaseOption {
}

export interface RequestResponseOption extends BaseOption {
}
