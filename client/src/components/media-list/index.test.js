import MediaList from '.'
import React from 'react'
import renderer from 'react-test-renderer'
import {StaticRouter} from 'react-router'

test('MediaList displays list of shows', () => {
  const props = {
    media: [{name: 'show1', show: '/show1'}, {name: 'show2', show: '/show2'}]
  }

  const component = renderer.create(
    <StaticRouter context={{}}>
      <MediaList {...props} />
    </StaticRouter>
  )

  expect(component.toJSON()).toMatchSnapshot()
})
