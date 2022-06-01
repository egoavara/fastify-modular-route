import { randomBytes } from 'crypto'
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
        .params(param)
        .query(query)
        .body(body)
        .response(res)
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

tap.test('meta', async t => {
    const description = randomBytes(10).toString('hex')
    const summary = randomBytes(10).toString('hex')
    const url = `http://www.${randomBytes(2).toString('hex')}.com`
    const urlDesc = randomBytes(10).toString('hex')
    const def = HTTPBody("POST", "/a/b/c/d")
        .description(description)
        .summary(summary)
        .build()

    t.same(def.description, description,)
    t.same(def.summary, summary,)
    t.same(HTTPBody("POST", "/a/b/c/d").externalDocs(url).build().externalDocs, { url: url })
    t.same(HTTPBody("POST", "/a/b/c/d").externalDocs(url, urlDesc).build().externalDocs, { url: url, description: urlDesc })
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
    const morePresets = HTTPBody("POST", "/a/b/c/d").presets('a').presets('b').build()
    const morePresets2 = HTTPBody("POST", "/a/b/c/d").presets('a', 'b').build()
    t.same(new Set(noPreset.presets), new Set(['http']))
    t.same(new Set(morePresets.presets), new Set(['a', 'b', 'http']))
    t.same(new Set(morePresets2.presets), new Set(['a', 'b', 'http']))
})