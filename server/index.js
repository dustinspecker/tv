const {escape, unescape} = require('querystring')
const fastify = require('fastify')({
	logger: true
})
const fs = require('fs')
const ip = require('ip')
const path = require('path')

const port = 3000

const mediaDir = process.env.TV_MEDIA_DIRECTORY

fastify.register(require('fastify-cors'))

fastify.register(require('fastify-static'),
  {
    root: path.join(__dirname, 'public')
  }
)

fastify.get('/show/*', (request, reply) => {
  reply
    .header('Content-Type', 'text/html')
    .send(fs.readFileSync(path.join(__dirname, 'public', 'index.html')))
})

fastify.get('/videos', (request, reply) => {
  fs.promises.readdir(mediaDir, {withFileTypes: true})
    .then(allFiles => {
      const base = `http://${ip.address()}:${port}/tv/`

      const shows = allFiles
        .filter(file => file.isDirectory())
        .map(file => ({
          name: file.name,
          show: `${base}${escape(file.name)}`
        }))

      reply
        .send({shows})
    })
})

fastify.get('/tv/:show', (request, reply) => {
  const showPath = path.join(mediaDir, unescape(request.params.show))

  fs.promises.readdir(showPath, {withFileTypes: true})
    .then(allFiles => {
      const base = `http://${ip.address()}:${port}/tv/${request.params.show}/`

      const seasons = allFiles
        .filter(file => file.isDirectory())
        .map(file => ({
          name: file.name,
          season: `${base}${escape(file.name)}`
        }))

      reply
        .send({seasons})
    })
})

fastify.get('/tv/:show/:season', (request, reply) => {
  const seasonPath = path.join(mediaDir, unescape(request.params.show), unescape(request.params.season))

  fs.promises.readdir(seasonPath, {withFileTypes: true})
    .then(allFiles => {
      const base = `http://${ip.address()}:${port}/tv/${escape(request.params.show)}/${escape(request.params.season)}/`

      const shows = allFiles
        .filter(file => file.isFile())
        .map(file => ({
          name: file.name,
          show: `${base}${escape(file.name)}`
        }))

      reply
        .send({shows})

    })
})

fastify.get('/tv/:show/:season/:episode', (request, reply) => {
  const episodePath = path.join(mediaDir, unescape(request.params.show), unescape(request.params.season), unescape(request.params.episode))
  fastify.log.info(episodePath)

  const range = request.headers.range

  if (range) {
    fs.promises.stat(episodePath)
      .then(stat => {
        const parts = range.replace(/bytes=/, '').split('-')
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size-1
        const chunksize = (end - start) + 1

        reply
          .header('Content-Range', `bytes ${start}-${end}/${stat.size}`)
          .header('Accept-Ranges', 'bytes')
          .header('Content-Length', chunksize)
          .header('Content-Type', 'video/mp4')
          .code(206)
          .send(fs.createReadStream(episodePath, {start, end}))
      })
  }
  else {
    fs.promises.stat(episodePath)
      .then(stat => {
        reply
          .header('Content-Length', stat.size)
          .header('Content-Type', 'video/mp4')
          .send(fs.createReadStream(episodePath))
      })
  }
})

fastify.listen(port, '0.0.0.0', err => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  fastify.log.info(`server listening at http://${ip.address()}:${port}`)
  fastify.log.info(`using media from ${mediaDir}`)
})
