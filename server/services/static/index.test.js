'use strict'

const Fastify = require('fastify')
const path = require('path')
const proxyquire = require('proxyquire')
const test = require('ava')

test.before(t => {
  const staticService = proxyquire('.', {
    fs: {
      promises: {
        readFile(filePath) {
          const expectedPath = path.join(
            __dirname,
            '..',
            '..',
            'public',
            'index.html'
          )
          t.is(filePath, expectedPath)

          return Promise.resolve('index')
        }
      }
    }
  })

  t.context = Fastify().register(staticService, {})
})

test.after.always(t => {
  t.context.close()
})

test('GET /* returns index.html', t =>
  t.context
    .inject({
      method: 'GET',
      url: '/some/path'
    })
    .then(response => {
      t.is(response.headers['content-type'], 'text/html')
      t.is(response.body, 'index')
    }))
