import { pito } from "pito"
import { AnyPresets, KnownPresets } from "./preset.js"

export type Share<Domain extends string, Presets extends AnyPresets, Topic extends string, Payload extends pito> = {
    readonly method: 'SHARE'
    readonly domain: Domain
    readonly presets: Presets[]
    readonly description?: string
    readonly summary?: string
    readonly externalDocs?: { url: string, description?: string }
    readonly topic: Topic
    readonly payload: Payload
}
export type ShareBuilder<Domain extends string, Presets extends AnyPresets, Topic extends string, Payload extends pito> = {
    // metadata
    presets<NewPresets extends KnownPresets>(preset: NewPresets): ShareBuilder<Domain, Presets | NewPresets, Topic, Payload>
    presets<NewPresets extends [AnyPresets] | [...AnyPresets[]]>(...presets: NewPresets): ShareBuilder<Domain, Presets | NewPresets[number], Topic, Payload>
    description(contents: string): ShareBuilder<Domain, Presets, Topic, Payload>
    summary(contents: string): ShareBuilder<Domain, Presets, Topic, Payload>
    externalDocs(url: string, description?: string): ShareBuilder<Domain, Presets, Topic, Payload>
    // arguments
    payload<NewPayload extends pito>(newPayload: NewPayload): ShareBuilder<Domain, Presets, Topic, NewPayload>
    // build
    build(): Share<Domain, Presets, Topic, Payload>
}
export function Share<Topic extends string, Domain extends string = ''>(topic: Topic, domain?: Domain): ShareBuilder<Domain, 'share', Topic, pito.Any> {
    if (topic.match(/[^0-9a-zA-Z_\.\-]/) !== null) {
        throw new Error(`ModularEvent(${topic}, ...) not allowed topic, topic must not contains other than ascii alphabet, ascii numeric, '.', '_', '-'`)
    }
    const result: any = {
        method: 'SHARE',
        domain: domain ?? '',
        presets: ['share'],
        topic,
        payload: pito.Any() as pito
    }
    return {
        // @ts-expect-error
        presets(...presets) {
            result.presets.push(...presets)
            return this
        },
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
            result.presets = Array.from(new Set([...result.presets, 'share']))
            return result as any
        },
    }
}
