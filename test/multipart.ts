import { randomBytes } from 'crypto'
import { pito } from 'pito'
import tap from 'tap'
import { Multipart } from '../cjs'


tap.test('builder', async t => {
    const query = PitoObj({
        Q: pito.Num()
    })
    const param = PitoObj({
        c: pito.Num()
    })
    const res = pito.Int()
    const fail = pito.UUID()

    const def = Multipart("/a/b/:c/d", 'Test')
        .params(param)
        .query(query)
        .response(res)
        .fail(fail)
        .build()

    t.same(
        def.domain,
        'Test',
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
        pito.strict(def.response),
        pito.strict(res),
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
    const def = Multipart("/a/b/c/d")
        .description(description)
        .summary(summary)
        .build()

    t.same(def.description, description,)
    t.same(def.summary, summary,)
    t.same(Multipart("/a/b/c/d").externalDocs(url).build().externalDocs, { url: url })
    t.same(Multipart("/a/b/c/d").externalDocs(url, urlDesc).build().externalDocs, { url: url, description: urlDesc })
})


tap.test('builder no param', async t => {
    const def = Multipart("/a/b/c/d").build()

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
    const noPreset = Multipart("/a/b/c/d").build()
    const morePresets = Multipart("/a/b/c/d").presets('a').presets('b').build()
    const morePresets2 = Multipart("/a/b/c/d").presets('a', 'b').build()
    t.same(new Set(noPreset.presets), new Set((['http', 'multipart'])))
    t.same(new Set(morePresets.presets), new Set((['a', 'b', 'http', 'multipart'])))
    t.same(new Set(morePresets2.presets), new Set((['a', 'b', 'http', 'multipart'])))
})