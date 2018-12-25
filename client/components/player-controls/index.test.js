import IconButton from '@material-ui/core/IconButton'
import PlayerControls from '.'
import React from 'react'
import renderer from 'react-test-renderer'
import Slider from '@material-ui/lab/Slider'

test('PlayerControls hides controls when showControls false', () => {
  const props = {
    showControls: false
  }

  const element = <PlayerControls {...props} />

  const component = renderer.create(element)

  expect(component.toJSON()).toMatchSnapshot()
})

test('PlayerControls Play/Pause button calls playOrPause', () => {
  const props = {
    currentTime: 0,
    playOrPause: jest.fn(),
    showControls: true
  }

  const element = <PlayerControls {...props} />

  const component = renderer.create(element)

  const playButton = component.root.findAllByType(IconButton)[0]

  playButton.props.onClick()

  expect(props.playOrPause.mock.calls.length).toEqual(1)
})

test('PlayerControls Slider onChange call seek with value', () => {
  const props = {
    currentTime: 0,
    seek: jest.fn(),
    showControls: true
  }

  const element = <PlayerControls {...props} />

  const component = renderer.create(element)

  const slider = component.root.findByType(Slider)

  slider.props.onChange(null, 73)

  expect(props.seek.mock.calls.length).toEqual(1)
  expect(props.seek.mock.calls[0][0]).toEqual(73)
})

test('PlayerControls Stop button calls stop', () => {
  const props = {
    currentTime: 0,
    showControls: true,
    stop: jest.fn()
  }

  const element = <PlayerControls {...props} />

  const component = renderer.create(element)

  const stopButton = component.root.findAllByType(IconButton)[1]

  stopButton.props.onClick()

  expect(props.stop.mock.calls.length).toEqual(1)
})

test('PlayerControl shows human readable time', () => {
  const props = {
    currentTime: 63,
    duration: 659,
    showControls: true
  }

  const element = <PlayerControls {...props} />

  const component = renderer.create(element)

  expect(() => {
    component.root.findByProps({children: '1:03'})
    component.root.findByProps({children: '10:59'})
  }).not.toThrow()
})
