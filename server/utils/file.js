const fs = require('fs')

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
        [keyForReturnedFilePath]: `${baseUrl}${escape(file.name)}`
      }))
  )

module.exports = {
  findInDirectory
}
