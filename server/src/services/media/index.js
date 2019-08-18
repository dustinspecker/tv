'use strict'

const {findInDirectory} = require('../../utils/file')
const fs = require('fs')
const mimeTypes = require('mime-types')
const path = require('path')

module.exports = function(fastify, opts, next) {
  fastify.get('/videos', (request, reply) => {
    const base = `/tv/`

    return findInDirectory(
      fastify.config.TV_MEDIA_DIRECTORY,
      file => file.isDirectory(),
      'show',
      base
    ).then(shows => {
      reply.send({shows})
    })
  })

  fastify.get('/tv/:show', (request, reply) => {
    const showPath = path.join(
      fastify.config.TV_MEDIA_DIRECTORY,
      unescape(request.params.show)
    )

    return findInDirectory(
      showPath,
      file => file.isDirectory(),
      'season',
      request.raw.originalUrl
    ).then(seasons => {
      reply.send({seasons})
    })
  })

  fastify.get('/tv/:show/:season', (request, reply) => {
    const seasonPath = path.join(
      fastify.config.TV_MEDIA_DIRECTORY,
      unescape(request.params.show),
      unescape(request.params.season)
    )

    return findInDirectory(
      seasonPath,
      file => file.isFile(),
      'episode',
      request.raw.originalUrl
    ).then(shows => {
      const aggregateEpisodesWithSubtitles = shows.reduce(
        (aggregated, show) => {
          if (path.extname(show.episode) === '.vtt') {
            const matchingShow = aggregated.find(({name}) => {
              const nameWithoutExtension = name.replace(path.extname(name), '')

              return show.name.startsWith(nameWithoutExtension)
            })

            if (matchingShow) {
              matchingShow.captions.push(show.episode)
            }
          } else {
            aggregated.push(Object.assign({captions: []}, show))
          }

          return aggregated
        },
        []
      )

      reply.send({shows: aggregateEpisodesWithSubtitles})
    })
  })

  fastify.get('/tv/:show/:season/:episode', (request, reply) => {
    const episodePath = path.join(
      fastify.config.TV_MEDIA_DIRECTORY,
      unescape(request.params.show),
      unescape(request.params.season),
      unescape(request.params.episode)
    )
    fastify.log.info(episodePath)

    const range = request.headers.range

    const contentType = mimeTypes.contentType(path.extname(episodePath))

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
          .header('Content-Type', contentType)
          .code(206)
          .send(fs.createReadStream(episodePath, {start, end}))
      })
    } else {
      fs.promises.stat(episodePath).then(stat => {
        reply
          .header('Content-Length', stat.size)
          .header('Content-Type', contentType)
          .send(fs.createReadStream(episodePath))
      })
    }
  })

  next()
}
