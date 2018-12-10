'use strict'

const {findInDirectory} = require('../../utils/file')
const fs = require('fs')
const path = require('path')

module.exports = function(fastify, opts, next) {
  fastify.get('/videos', (request, reply) => {
    const base = `tv/`

    return findInDirectory(
      opts.mediaDir,
      file => file.isDirectory(),
      'show',
      base
    ).then(shows => {
      reply.send({shows})
    })
  })

  fastify.get('/tv/:show', (request, reply) => {
    const base = `tv/${request.params.show}/`
    const showPath = path.join(opts.mediaDir, unescape(request.params.show))

    return findInDirectory(
      showPath,
      file => file.isDirectory(),
      'season',
      base
    ).then(seasons => {
      reply.send({seasons})
    })
  })

  fastify.get('/tv/:show/:season', (request, reply) => {
    const base = `tv/${escape(request.params.show)}/${escape(
      request.params.season
    )}/`
    const seasonPath = path.join(
      opts.mediaDir,
      unescape(request.params.show),
      unescape(request.params.season)
    )

    return findInDirectory(
      seasonPath,
      file => file.isFile(),
      'show',
      base
    ).then(shows => {
      reply.send({shows})
    })
  })

  fastify.get('/tv/:show/:season/:episode', (request, reply) => {
    const episodePath = path.join(
      opts.mediaDir,
      unescape(request.params.show),
      unescape(request.params.season),
      unescape(request.params.episode)
    )
    fastify.log.info(episodePath)

    const range = request.headers.range

    if (range) {
      fs.promises.stat(episodePath).then(stat => {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1
        const chunksize = end - start + 1

        reply
          .header('Content-Range', `bytes ${start}-${end}/${stat.size}`)
          .header('Accept-Ranges', 'bytes')
          .header('Content-Length', chunksize)
          .header('Content-Type', 'video/mp4')
          .code(206)
          .send(fs.createReadStream(episodePath, {start, end}))
      })
    } else {
      fs.promises.stat(episodePath).then(stat => {
        reply
          .header('Content-Length', stat.size)
          .header('Content-Type', 'video/mp4')
          .send(fs.createReadStream(episodePath))
      })
    }
  })

  next()
}