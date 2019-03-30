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
    const request = new chrome.cast.media.LoadRequest(mediaInfo)
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
