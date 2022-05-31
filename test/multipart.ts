import { pito } from 'pito'
import tap from 'tap'
import { Multipart } from '../cjs'


tap.test('builder', async t => {
    const query = pito.Obj({
        Q: pito.Num()
    })
    const param = pito.Obj({
        c: pito.Num()
    })
    const res = pito.Int()


    const def = Multipart("/a/b/:c/d", 'Test')
        .withParams(param)
        .withQuery(query)
        .withResponse(res)
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
    const morePresets = Multipart("/a/b/c/d").addPreset('a').addPreset('b').build()
    const morePresets2 = Multipart("/a/b/c/d").withPresets('a', 'b').build()
    t.same(new Set(noPreset.presets), new Set((['http', 'multipart'])))
    t.same(new Set(morePresets.presets), new Set((['a', 'b', 'http', 'multipart'])))
    t.same(new Set(morePresets2.presets), new Set((['a', 'b', 'http', 'multipart'])))
})