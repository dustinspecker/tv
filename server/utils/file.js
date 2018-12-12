'use strict'

const fs = require('fs')
const path = require('path')

const findInDirectory = (
  directoryToSearch,
  matcher,
  keyForReturnedFilePath,
  baseUrl
) =>
  fs.promises.readdir(directoryToSearch, {withFileTypes: true}).then(allFiles =>
    allFiles
      .filter(file => matcher(file))
      .map(file => ({
        name: file.name,
        [keyForReturnedFilePath]: path.join(baseUrl, escape(file.name))
      }))
  )

module.exports = {
  findInDirectory
}
