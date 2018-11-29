import AppBar from '@material-ui/core/AppBar'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import React from 'react'
import Slider from '@material-ui/lab/Slider'
import Toolbar from '@material-ui/core/Toolbar'
import { withStyles } from '@material-ui/core/styles'

const styles = () => ({
  appBar: {
    bottom: 0,
    top: 'auto'
  },
  sliderRoot: {
    margin: '0 10px'
  },
  sliderTrack: {
    color: 'default',
    height: 12
  }
})

const convertSecondsToHumanReadable = seconds => {
  const minutes = Math.floor(seconds / 60)
  const secondsRemainder = Math.round(seconds - minutes * 60).toFixed()
  const formattedSeconds = secondsRemainder < 10 ? `0${secondsRemainder}` : secondsRemainder

  return `${minutes}:${formattedSeconds}`
}

class PlayerControls extends React.Component {
  handleChange = (e, value) => {
    this.props.seek(value)
  }

  render() {
    if (this.props.showControls) {
      return <>
        <AppBar
          className={this.props.classes.appBar}
          color='default'
          position='fixed'
        >
          <Toolbar>
            <IconButton onClick={() => this.props.playOrPause()}>
              <Icon>{this.props.isPaused ? 'play_arrow' : 'pause'}</Icon>
            </IconButton>
            <div>{convertSecondsToHumanReadable(this.props.currentTime)}</div>
            <Slider
              classes={{
                root: this.props.classes.sliderRoot,
                track: this.props.classes.sliderTrack
              }}
              min={0}
              max={this.props.duration}
              onChange={this.handleChange}
              value={this.props.currentTime}
              variant='determinate'
            />
            <div>{convertSecondsToHumanReadable(this.props.duration)}</div>
            <IconButton onClick={() => this.props.stop()}>
              <Icon>{'stop'}</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
      </>
    }

    return null
  }
}

export default withStyles(styles)(PlayerControls)
