import { AxiosRequestTransformer, AxiosResponseTransformer } from "axios"
const localInCodeTokenManager = {
    token: undefined,
    reftoken: undefined,
    getToken() { return this.token },
    setToken(token: string) { return this.token },
    getRefreshToken() { return this.reftoken },
    setRefreshToken(token: string) { return this.reftoken },
}
export class Requester<KnownDomains extends string> {
    private domains: Record<KnownDomains, URL>
    beforeReq?: AxiosRequestTransformer
    afterRes?: AxiosResponseTransformer
    // token 관리자
    private token: {
        getToken: () => string | undefined,
        setToken: (token?: string) => void,
        getRefreshToken: () => string | undefined,
        setRefreshToken: (token?: string) => void,
    }
    constructor(
        knowns: Record<KnownDomains, string | URL>,
        options?: {
            token?: {
                getToken: () => string,
                setToken: (token: string) => void,
                getRefreshToken: () => string,
                setRefreshToken: (token: string) => void,
            }
            beforeReq?: AxiosRequestTransformer
            afterRes?: AxiosResponseTransformer
        }
    ) {
        const tmp: Partial<Record<KnownDomains, URL>> = {}
        for (const key in knowns) {
            const val = knowns[key]
            if (val instanceof URL) {
                tmp[key] = val
            } else {
                tmp[key] = new URL(val)
            }
        }
        // 기본 값들 설정

        this.domains = tmp as Record<KnownDomains, URL>
        this.token = localInCodeTokenManager
        // 
        this.beforeReq = options?.beforeReq
        this.afterRes = options?.afterRes
    }
    addDomain<NDomain extends string>(domain: NDomain, url: URL | string): Requester<KnownDomains | NDomain> {
        const ndom = Object.assign(this.domains, { [domain]: url })
        return new Requester(ndom)
    }

}