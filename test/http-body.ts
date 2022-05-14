import { pito } from 'pito'
import tap from 'tap'
import { HTTPBody } from '../cjs'


tap.test('builder', async t => {
    const query = pito.Obj({
        Q: pito.Num()
    })
    const param = pito.Obj({
        c: pito.Num()
    })
    const body = pito.Str()
    const res = pito.Int()


    const def = HTTPBody("POST", "/a/b/:c/d", 'Test')
        .withParams(param)
        .withQuery(query)
        .withBody(body)
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
        pito.strict(def.body),
        pito.strict(body),
    )
    t.same(
        pito.strict(def.response),
        pito.strict(res),
    )
})


tap.test('builder no param', async t => {
    const def = HTTPBody("POST", "/a/b/c/d").build()

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
    const noPreset = HTTPBody("POST", "/a/b/c/d").build()
    const morePresets = HTTPBody("POST", "/a/b/c/d").withPreset('a').withPreset('b').build()
    t.same(noPreset.presets, [])
    t.same(morePresets.presets, ['a', 'b'])
})