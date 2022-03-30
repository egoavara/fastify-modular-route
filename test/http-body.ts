import { pito } from 'pito'
import tap from 'tap'
import { HTTPBody } from '../cjs'


tap.test('with test', async t => {
    const header = pito.obj({
        Help: pito.regex('^Help [a-zA-Z_\-]+')
    })
    const query = pito.obj({
        Q: pito.num()
    })
    const param = pito.obj({
        c: pito.num()
    })
    const body = pito.str()
    const res = pito.int()


    const def = HTTPBody("Test", "POST", "/a/b/:c/d")
        .withHeaders(header)
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
        pito.strict(def.body),
        pito.strict(body),
    )
    t.same(
        pito.strict(def.response),
        pito.strict(res),
    )
})