import ConfigContext from '../../config-context'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'

export default class extends React.Component {
  static contextType = ConfigContext

  handleClick = () => {
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession()
    const mediaInfo = new chrome.cast.media.MediaInfo(
      `${this.context.apiServer}${this.props.mediaUrl}`,
      'video/mp4'
    )

    if (this.props.captions.length) {
      const subtitle = new chrome.cast.media.Track(
        1,
        chrome.cast.media.TrackType.TEXT
      )
      subtitle.trackContentId = `${this.context.apiServer}${
        this.props.captions[0]
      }`
      subtitle.subtype = chrome.cast.media.TextTrackType.SUBTITLES
      subtitle.name = 'English Subtitles'
      subtitle.language = 'en-US'

      mediaInfo.tracks = [subtitle]
      mediaInfo.textTrackStyle = new chrome.cast.media.TextTrackStyle()
    }

    const request = new chrome.cast.media.LoadRequest(mediaInfo)
    if (this.props.captions.length) {
      request.activeTrackIds = [1]
    }
    castSession.loadMedia(request).then(
      function() {
        console.log('Load succeed')
      },
      function(errorCode) {
        console.log('Error code: ' + errorCode)
      }
    )
  }

  render() {
    return (
      <ListItem button onClick={this.handleClick}>
        <ListItemText primary={this.props.name} />
      </ListItem>
    )
  }
}
