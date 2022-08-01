import { randomBytes } from 'crypto'
import { pito } from 'pito'
import tap from 'tap'
import { WS, func } from '../cjs'

tap.test('builder', async t => {
    const query = PitoObj({
        Q: pito.Num()
    })
    const param = PitoObj({
        c: pito.Num()
    })
    const send = pito.Str()
    const recv = pito.Num()
    const req = func({ a: { args: [], return: pito.Num() } })
    const res = func({ b: { args: [pito.Num()], return: pito.Num() } })
    const fail = pito.UUID()

    const def = WS("/a/b/:c/d", 'WS')
        .params(param)
        .query(query)
        .send(send)
        .recv(recv)
        .request(req)
        .response(res)
        .fail(fail)
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
    t.same(
        pito.strict(def.fail),
        pito.strict(fail),
    )
})

tap.test('meta', async t => {
    const description = randomBytes(10).toString('hex')
    const summary = randomBytes(10).toString('hex')
    const url = `http://www.${randomBytes(2).toString('hex')}.com`
    const urlDesc = randomBytes(10).toString('hex')

    const def = WS("/a/b/c/d")
        .description(description)
        .summary(summary)
        .build()

    t.same(def.description, description,)
    t.same(def.summary, summary,)
    t.same(WS("/a/b/c/d").externalDocs(url).build().externalDocs, { url: url })
    t.same(WS("/a/b/c/d").externalDocs(url, urlDesc).build().externalDocs, { url: url, description: urlDesc })
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
    const morePresets = WS("/a/b/c/d").presets('a').presets('b').build()
    const morePresets2 = WS("/a/b/c/d").presets('a', 'b').build()
    t.same(new Set(noPreset.presets), new Set(['ws']))
    t.same(new Set(morePresets.presets), new Set(['a', 'b', 'ws']))
    t.same(new Set(morePresets2.presets), new Set(['a', 'b', 'ws']))
})