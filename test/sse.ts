import { pito } from 'pito'
import tap from 'tap'
import { SSE } from '../cjs'

tap.test('builder', async t => {
    const query = pito.Obj({
        Q: pito.Num()
    })
    const param = pito.Obj({
        c: pito.Num()
    })
    const pack = pito.Str()
    const def = SSE("/a/b/:c/d", 'SSE')
        .withParams(param)
        .withQuery(query)
        .withPacket(pack)
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
    const morePresets = SSE("/a/b/c/d").addPreset('a').addPreset('b').build()
    const morePresets2 = SSE("/a/b/c/d").withPresets('a', 'b').build()
    t.same(noPreset.presets, [])
    t.same(morePresets.presets, ['a', 'b'])
    t.same(morePresets2.presets, ['a', 'b'])
})