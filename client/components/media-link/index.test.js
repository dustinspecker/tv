import ListItem from '@material-ui/core/ListItem'
import MediaLink from '.'
import React from 'react'
import renderer from 'react-test-renderer'

test('MediaLink displays media button', () => {
  const props = {
    name: 'some media'
  }

  const element = <MediaLink {...props} />

  const component = renderer.create(element)
  expect(component.toJSON()).toMatchSnapshot()
})

test('MediaLink click casts media - success', () => {
  jest.spyOn(global.console, 'log').mockImplementation(() => undefined)

  const loadMedia = jest.fn(() => Promise.resolve())
  const getCurrentSession = jest.fn(() => ({
    loadMedia
  }))
  global.cast = {
    framework: {
      CastContext: {
        getInstance: jest.fn(() => ({getCurrentSession}))
      }
    }
  }

  const MediaInfo = jest.fn()
  const LoadRequest = jest.fn()
  global.chrome = {
    cast: {
      media: {
        LoadRequest,
        MediaInfo
      }
    }
  }

  const props = {
    mediaUrl: '/some/url'
  }

  const element = <MediaLink {...props} />

  const component = renderer.create(element)
  const button = component.root.findByType(ListItem)
  button.props.onClick()

  expect(MediaInfo.mock.calls[0]).toEqual([
    'http://localhost/some/url',
    'video/mp4'
  ])

  expect(loadMedia.mock.calls[0][0]).toBeInstanceOf(LoadRequest)

  return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
    expect(global.console.log.mock.calls[0][0]).toEqual('Load succeed')

    global.console.log.mockRestore()
  })
})

test('MediaLink click casts media - error', () => {
  jest.spyOn(global.console, 'log').mockImplementation(() => undefined)

  const loadMedia = jest.fn(() => Promise.reject('some error'))
  const getCurrentSession = jest.fn(() => ({
    loadMedia
  }))
  global.cast = {
    framework: {
      CastContext: {
        getInstance: jest.fn(() => ({getCurrentSession}))
      }
    }
  }

  const MediaInfo = jest.fn()
  const LoadRequest = jest.fn()
  global.chrome = {
    cast: {
      media: {
        LoadRequest,
        MediaInfo
      }
    }
  }

  const props = {
    mediaUrl: '/some/url'
  }

  const element = <MediaLink {...props} />

  const component = renderer.create(element)
  const button = component.root.findByType(ListItem)
  button.props.onClick()

  return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
    expect(global.console.log.mock.calls[0][0]).toEqual(
      'Error code: some error'
    )

    global.console.log.mockRestore()
  })
})