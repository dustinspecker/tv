import {Link} from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MovieLink from '../movie-link/'
import React from 'react'

export default class extends React.Component {
  state = {
    shows: []
  }

  componentDidMount() {
    fetch(
      `/tv/${this.props.match.params.showname}/${
        this.props.match.params.season
      }`
    )
      .then(response => response.json())
      .then(({shows}) => {
        this.setState({shows})
      })
  }

  render() {
    return (
      <List>
        {this.state.shows.map(({name, show}) => (
          <MovieLink key={name} mediaUrl={show} name={name} />
        ))}
      </List>
    )
  }
}
