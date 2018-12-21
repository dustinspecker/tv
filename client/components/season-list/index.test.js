import SeasonList from '.'
import React from 'react'
import renderer from 'react-test-renderer'
import {StaticRouter} from 'react-router'

test('SeasonList displays list of seasons', () => {
  fetch.mockResponseOnce(
    JSON.stringify({
      seasons: [
        {name: 'Season 1', season: '/show/season1'},
        {name: 'Season 2', season: '/show/season2'}
      ]
    })
  )

  const props = {
    match: {
      params: {
        showname: 'showname'
      }
    }
  }

  const element = (
    <StaticRouter context={{}}>
      <SeasonList {...props} />
    </StaticRouter>
  )

  const component = renderer.create(element)
  expect(component.toJSON()).toMatchSnapshot()

  return new Promise(resolve => setTimeout(resolve, 0)).then(() => {
    component.update(element)
    expect(component.toJSON()).toMatchSnapshot()
    expect(fetch.mock.calls.length).toEqual(1)
    expect(fetch.mock.calls[0][0]).toEqual('/tv/showname')
  })
})
