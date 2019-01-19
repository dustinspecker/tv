import EpisodeList from '.'
import React from 'react'
import renderer from 'react-test-renderer'

test('EpisodeList displays list of episodes', () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      shows: [
        {name: 'Episode 1', episode: '/show/season1/episode1'},
        {name: 'Episode 2', episode: '/show/season1/episode2'}
      ]
    })
  )

  const props = {
    match: {
      params: {
        season: 'seasonname',
        showname: 'showname'
      }
    }
  }

  const element = <EpisodeList {...props} />

  const component = renderer.create(element)
  expect(component.toJSON()).toMatchSnapshot()

  return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
    component.update(element)
    expect(component.toJSON()).toMatchSnapshot()
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('/tv/showname/seasonname')
  })
})
