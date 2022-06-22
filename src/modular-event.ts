import { pito } from "pito"

export type ModularEvent<Domain extends string, Topic extends string, Payload extends pito> = {
    readonly domain: Domain
    readonly description?: string
    readonly summary?: string
    readonly externalDocs?: { url: string, description?: string }
    readonly topic: Topic
    readonly payload: Payload
}
export type ModularEventBuilder<Domain extends string, Topic extends string, Payload extends pito> = {
    // metadata
    description(contents: string): ModularEventBuilder<Domain, Topic, Payload>
    summary(contents: string): ModularEventBuilder<Domain, Topic, Payload>
    externalDocs(url: string, description?: string): ModularEventBuilder<Domain, Topic, Payload>
    // arguments
    payload<NewPayload extends pito>(newPayload: NewPayload): ModularEventBuilder<Domain, Topic, NewPayload>
    // build
    build(): ModularEvent<Domain, Topic, Payload>
}
export function ModularEvent<Topic extends string, Domain extends string = ''>(topic: Topic, domain?: Domain): ModularEventBuilder<Domain, Topic, pito.Any> {
    if(topic.match(/[^0-9a-zA-Z_\.\-]/) !== null){
        throw new Error(`ModularEvent(${topic}, ...) not allowed topic, topic must not contains other than ascii alphabet, ascii numeric, '.', '_', '-'`)
    }
    const result: any = {
        domain: domain ?? '',
        topic,
        payload: pito.Any() as pito
    }
    return {
        description(contents) {
            result.description = contents
            return this
        },
        summary(contents) {
            result.summary = contents
            return this
        },
        externalDocs(url, description?) {
            result.externalDocs = { url, ...(description !== undefined ? { description } : {}) }
            return this
        },
        payload(newPayload) {
            result.payload = newPayload
            return this as any
        },
        build() {
            return result as any
        },
    }
}
