import { randomBytes } from 'crypto'
import { pito } from 'pito'
import tap from 'tap'
import { Share } from '../cjs'


tap.test('builder', async t => {
    const payload = pito.Obj({
        c: pito.Num()
    })


    const def = Share("test.hello", 'Test')
        .payload(payload)
        .build()

    t.same(pito.strict(def.payload), pito.strict(payload))
})

tap.test('meta', async t => {
    const description = randomBytes(10).toString('hex')
    const summary = randomBytes(10).toString('hex')
    const url = `http://www.${randomBytes(2).toString('hex')}.com`
    const urlDesc = randomBytes(10).toString('hex')
    const def = Share("test.hello", 'Test')
        .description(description)
        .summary(summary)
        .build()

    t.same(def.description, description)
    t.same(def.summary, summary)
    t.same(Share("test.hello", 'Test').externalDocs(url).build().externalDocs, { url: url })
    t.same(Share("test.hello", 'Test').externalDocs(url, urlDesc).build().externalDocs, { url: url, description: urlDesc })
})

tap.test('builder no param', async t => {
    const def = Share("test.hello", "Test").build()

    t.same(def.domain, 'Test')
    t.same(def.topic, 'test.hello')
})

tap.test('constraint', async t => {
    t.throws(() => { Share('test/hello') })
})