import { pito } from 'pito'
import tap from 'tap'
import { InferWS, WS, wsCaller } from '../cjs'

tap.test('builder', async t => {
    const query = pito.Obj({
        Q: pito.Num()
    })
    const param = pito.Obj({
        c: pito.Num()
    })
    const send = pito.Str()
    const recv = pito.Num()
    const req = wsCaller({ a: { args: [], return: pito.Num() } })
    const res = wsCaller({ b: { args: [pito.Num()], return: pito.Num() } })
    const def = WS("/a/b/:c/d", 'WS')
        .withParams(param)
        .withQuery(query)
        .withSend(send)
        .withRecv(recv)
        .withRequest(req)
        .withResponse(res)
        .build()
    t.same(
        def.domain,
        'WS',
    )
    t.same(
        pito.strict(def.params),
        pito.strict(param),
    )
    t.same(
        pito.strict(def.query),
        pito.strict(query),
    )
    t.same(
        pito.strict(def.send),
        pito.strict(send),
    )
    t.same(
        pito.strict(def.recv),
        pito.strict(recv),
    )
    t.same(
        def.request,
        req
    )
    t.same(
        def.response,
        res
    )
})
tap.test('builder other branch', async t => {
    const def = WS("/a/b/c/d").build()

    t.same(
        def.domain,
        '',
    )
    t.same(
        def.path,
        '/a/b/c/d',
    )
})
tap.test('presets', async t => {
    const noPreset = WS("/a/b/c/d").build()
    const morePresets = WS("/a/b/c/d").withPreset('a').withPreset('b').build()
    t.same(noPreset.presets, [])
    t.same(morePresets.presets, ['a', 'b'])
})