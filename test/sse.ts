import { pito } from 'pito'
import tap from 'tap'
import { SSE } from '../cjs'

tap.test('builder', async t => {
    const header = pito.obj({
        Help: pito.regex('^Help [a-zA-Z_\-]+')
    })
    const query = pito.obj({
        Q: pito.num()
    })
    const param = pito.obj({
        c: pito.num()
    })
    const pack = pito.str()
    const def = SSE("/a/b/:c/d", 'SSE')
        .withHeaders(header)
        .withParams(param)
        .withQuery(query)
        .withPacket(pack)
        .build()

    t.same(
        def.domain,
        'SSE',
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
    const morePresets = SSE("/a/b/c/d").withPresets('a', 'b').build()
    t.same(noPreset.presets, [])
    t.same(morePresets.presets, ['a', 'b'])
})