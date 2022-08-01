import { randomBytes } from 'crypto'
import { pito } from 'pito'
import tap from 'tap'
import { SSE } from '../cjs'

tap.test('builder', async t => {
    const query = PitoObj({
        Q: pito.Num()
    })
    const param = PitoObj({
        c: pito.Num()
    })
    const pack = pito.Str()
    const fail = pito.UUID()
    const def = SSE("/a/b/:c/d", 'SSE')
        .params(param)
        .query(query)
        .packet(pack)
        .fail(fail)
        .build()

    t.same(
        def.domain,
        'SSE',
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
        pito.strict(def.packet),
        pito.strict(pack),
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
    const def = SSE("/a/b/c/d")
        .description(description)
        .summary(summary)
        .build()

    t.same(def.description, description,)
    t.same(def.summary, summary,)
    t.same(SSE("/a/b/c/d").externalDocs(url).build().externalDocs, { url: url })
    t.same(SSE("/a/b/c/d").externalDocs(url, urlDesc).build().externalDocs, { url: url, description: urlDesc })
})

tap.test('builder other branch', async t => {
    const def = SSE("/a/b/c/d").build()

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
    const noPreset = SSE("/a/b/c/d").build()
    const morePresets = SSE("/a/b/c/d").presets('a').presets('b').build()
    const morePresets2 = SSE("/a/b/c/d").presets('a', 'b').build()
    t.same(new Set(noPreset.presets), new Set(['http', 'sse']))
    t.same(new Set(morePresets.presets), new Set(['a', 'b', 'http', 'sse']))
    t.same(new Set(morePresets2.presets), new Set(['a', 'b', 'http', 'sse']))
})