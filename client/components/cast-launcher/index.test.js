import CastLauncher from '.'
import React from 'react'
import renderer from 'react-test-renderer'

test('CastLauncher shows google-cast-launcher when showLauncher is true', () => {
  const props = {
    showLauncher: true
  }

  const element = <CastLauncher {...props} />

  const component = renderer.create(element)
  expect(component.toJSON()).toMatchSnapshot()
})

test('CastLauncher hides google-cast-launcher when showLauncher is false', () => {
  const props = {
    showLauncher: false
  }

  const element = <CastLauncher {...props} />

  const component = renderer.create(element)
  expect(component.toJSON()).toMatchSnapshot()
})
