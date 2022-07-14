export const FailureSymbol = Symbol('Failure')
export type Failure<T> = {
    [FailureSymbol]: true
    cause: T,
    hcode: number
}

export function isFailure<T = any>(v: any): v is Failure<T> {
    return v[FailureSymbol] === true
}
export function failure<T = any>(cause: T, hcode: number = 406): Failure<T> {
    return {
        [FailureSymbol]: true,
        cause,
        hcode
    }
}