import {Link} from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import MovieLink from '../movie-link/'
import React from 'react'

export default class extends React.Component {
  state = {
    seasons: []
  }

  componentDidMount() {
    fetch(`/tv/${this.props.match.params.showname}`)
      .then(response => response.json())
      .then(({seasons}) => {
        this.setState({seasons})
      })
  }

  render() {
    return (
      <List>
        {this.state.seasons.map(({name, season}) => {
          return (
            <Link
              key={season}
              to={`/show/${this.props.match.params.showname}/${name}`}
            >
              <ListItem>
                <ListItemText primary={name} />
              </ListItem>
            </Link>
          )
        })}
      </List>
    )
  }
}
