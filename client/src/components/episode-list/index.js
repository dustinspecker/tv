import ConfigContext from '../../config-context'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MediaLink from '../media-link/'
import React from 'react'

export default class extends React.Component {
  static contextType = ConfigContext

  state = {
    shows: []
  }

  componentDidMount() {
    fetch(
      `${this.context.secureApiServer}/tv/${this.props.match.params.showname}/${this.props.match.params.season}`
    )
      .then(response => response.json())
      .then(({shows}) => {
        this.setState({shows})
      })
  }

  render() {
    return (
      <List>
        {this.state.shows.map(({name, episode, captions}) => (
          <MediaLink
            key={name}
            mediaUrl={episode}
            name={name}
            captions={captions}
          />
        ))}
      </List>
    )
  }
}
