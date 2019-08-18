'use strict'

const proxyquire = require('proxyquire')
const test = require('ava')

test('findInDirectory returns matched files', t => {
  const pathToSearch = '/some/path'

  const {findInDirectory} = proxyquire('./file', {
    fs: {
      promises: {
        readdir(dirPath, options) {
          t.is(dirPath, pathToSearch)
          t.deepEqual(options, {withFileTypes: true})

          return Promise.resolve([
            {name: 'Some Movie', isFile: () => true},
            {name: 'Not a Movie', isFile: () => false}
          ])
        }
      }
    }
  })

  return findInDirectory(
    pathToSearch,
    file => file.isFile(),
    'movie',
    '/movie'
  ).then(foundFiles => {
    t.deepEqual(foundFiles, [
      {name: 'Some Movie', movie: '/movie/Some%20Movie'}
    ])
  })
})
