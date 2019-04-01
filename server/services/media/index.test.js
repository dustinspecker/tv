'use strict'

const Fastify = require('fastify')
const path = require('path')
const proxyquire = require('proxyquire')
const test = require('ava')

const tvMediaDirectory = '/media'

const startMedia = (t, findInDirectoryAssertionsFn, directoryFindings = []) => {
  const mediaService = proxyquire('.', {
    fs: {
      createReadStream(path, {start, end} = {}) {
        return 'file'.slice(start || 0, end || 3)
      },
      promises: {
        stat() {
          return Promise.resolve({size: 4})
        }
      }
    },
    '../../utils/file': {
      findInDirectory(dirPath, matcher, key, base) {
        findInDirectoryAssertionsFn(dirPath, matcher, key, base)

        return Promise.resolve(directoryFindings)
      }
    }
  })

  t.context = Fastify()
  t.context.config = {
    TV_MEDIA_DIRECTORY: tvMediaDirectory
  }
  t.context.register(mediaService, {})
}

test.afterEach.always(t => {
  t.context.close()
})

test('GET /videos returns list of media', t => {
  const findInDirectoryAssertionsFn = (dirPath, matcher, key, base) => {
    const directory = {isDirectory: () => true}
    const file = {isDirectory: () => false}

    t.is(dirPath, tvMediaDirectory)
    t.true(matcher(directory))
    t.false(matcher(file))
    t.is(key, 'show')
    t.is(base, '/tv/')
  }

  startMedia(t, findInDirectoryAssertionsFn)

  return t.context
    .inject({
      method: 'GET',
      url: '/videos'
    })
    .then(response => {
      t.deepEqual(JSON.parse(response.body), {shows: []})
    })
})

test('GET /tv/:show returns list of seasons', t => {
  const findInDirectoryAssertionsFn = (dirPath, matcher, key, base) => {
    const directory = {isDirectory: () => true}
    const file = {isDirectory: () => false}

    t.is(dirPath, path.join(tvMediaDirectory, 'Some Show'))
    t.true(matcher(directory))
    t.false(matcher(file))
    t.is(key, 'season')
    t.is(base, '/tv/Some%20Show')
  }

  startMedia(t, findInDirectoryAssertionsFn)

  return t.context
    .inject({
      method: 'GET',
      url: '/tv/Some%20Show'
    })
    .then(response => {
      t.deepEqual(JSON.parse(response.body), {seasons: []})
    })
})

test('GET /tv/:show/:season returns list of episodes', t => {
  const findInDirectoryAssertionsFn = (dirPath, matcher, key, base) => {
    const directory = {isFile: () => false}
    const file = {isFile: () => true}

    t.is(dirPath, path.join(tvMediaDirectory, 'Some Show', 'Season 1'))
    t.false(matcher(directory))
    t.true(matcher(file))
    t.is(key, 'episode')
    t.is(base, '/tv/Some%20Show/Season%201')
  }

  const directoryFindings = [
    {
      name: 'episode 1.mp4',
      episode: '/tv/Some%20Show/Season%201/Episode%201.mp4'
    },
    {
      name: 'episode 1.vtt',
      episode: '/tv/Some%20Show/Season%201/Episode%201.vtt'
    },
    {
      name: 'episode 2.mp4',
      episode: '/tv/Some%20Show/Season%201/Episode%202.mp4'
    }
  ]

  startMedia(t, findInDirectoryAssertionsFn, directoryFindings)

  return t.context
    .inject({
      method: 'GET',
      url: '/tv/Some%20Show/Season%201'
    })
    .then(response => {
      const expected = [
        {
          name: 'episode 1.mp4',
          episode: '/tv/Some%20Show/Season%201/Episode%201.mp4',
          captions: ['/tv/Some%20Show/Season%201/Episode%201.vtt']
        },
        {
          name: 'episode 2.mp4',
          episode: '/tv/Some%20Show/Season%201/Episode%202.mp4',
          captions: []
        }
      ]
      t.deepEqual(JSON.parse(response.body), {shows: expected})
    })
})

test('GET /tv/:show/:season/:episode returns read stream if range header missing', t => {
  startMedia(t)

  return t.context
    .inject({
      method: 'GET',
      url: '/tv/Some%20Show/Season%201/Episode%201.mp4'
    })
    .then(response => {
      t.is(response.headers['content-length'], 4)
      t.is(response.headers['content-type'], 'video/mp4')
      t.is(response.body, 'fil')
    })
})

test('GET /tv/:show/:season/:episode returns stream for range with only start', t => {
  startMedia(t)

  return t.context
    .inject({
      method: 'GET',
      url: '/tv/Some%20Show/Season%201/Episode%201.mp4',
      headers: {
        range: 'bytes=1'
      }
    })
    .then(response => {
      t.is(response.statusCode, 206)
      t.is(response.headers['content-range'], 'bytes 1-3/4')
      t.is(response.headers['accept-ranges'], 'bytes')
      t.is(response.headers['content-length'], 3)
      t.is(response.headers['content-type'], 'video/mp4')
      t.is(response.body, 'il')
    })
})

test('GET /tv/:show/:season/:episode returns stream for full range', t => {
  startMedia(t)

  return t.context
    .inject({
      method: 'GET',
      url: '/tv/Some%20Show/Season%201/Episode%201.webm',
      headers: {
        range: 'bytes=1-4'
      }
    })
    .then(response => {
      t.is(response.statusCode, 206)
      t.is(response.headers['content-range'], 'bytes 1-4/4')
      t.is(response.headers['accept-ranges'], 'bytes')
      t.is(response.headers['content-length'], 4)
      t.is(response.headers['content-type'], 'video/webm')
      t.is(response.body, 'ile')
    })
})
