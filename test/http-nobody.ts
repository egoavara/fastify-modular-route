import { pito } from 'pito'
import tap from 'tap'
import { HTTPNoBody } from '../cjs'


tap.test('builder', async t => {
    const query = pito.Obj({
        Q: pito.Num()
    })
    const param = pito.Obj({
        c: pito.Num()
    })
    const res = pito.Int()


    const def = HTTPNoBody("GET", "/a/b/:c/d", 'Test')
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
    const def = HTTPNoBody("GET", "/a/b/c/d").build()
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
    const noPreset = HTTPNoBody("GET", "/a/b/c/d").build()
    const morePresets = HTTPNoBody("GET", "/a/b/c/d").addPreset('a').addPreset('b').build()
    const morePresets2 = HTTPNoBody("GET", "/a/b/c/d").withPresets('a', 'b').build()
    t.same(noPreset.presets, [])
    t.same(morePresets.presets, ['a', 'b'])
    t.same(morePresets2.presets, ['a', 'b'])
})