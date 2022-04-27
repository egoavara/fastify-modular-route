import { pito } from 'pito'
import tap from 'tap'
import { Multipart } from '../cjs'


tap.test('builder', async t => {
    const header = pito.Obj({
        Help: pito.Regex('^Help [a-zA-Z_\-]+')
    })
    const query = pito.Obj({
        Q: pito.Num()
    })
    const param = pito.Obj({
        c: pito.Num()
    })
    const body = pito.Str()
    const res = pito.Int()


    const def = Multipart("/a/b/:c/d", 'Test')
        .withHeaders(header)
        .withParams(param)
        .withQuery(query)
        .build()

    t.same(
        def.domain,
        'Test',
    )
    t.same(
        pito.strict(def.headers),
        pito.strict(header),
    )
    t.same(
        pito.strict(def.params),
        pito.strict(param),
    )
    t.same(
        pito.strict(def.query),
        pito.strict(query),
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
    const morePresets = Multipart("/a/b/c/d").withPresets('a', 'b').build()
    t.same(noPreset.presets, [])
    t.same(morePresets.presets, ['a', 'b'])
})