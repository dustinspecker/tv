import {Link} from 'react-router-dom'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import React from 'react'

export default class extends React.Component {
  render() {
    return (
      <List>
        {this.props.media.map(({name, show}) => {
          return (
            <Link key={show} to={`/show/${name}`}>
              <ListItem>
                <ListItemText primary={name} />
              </ListItem>
            </Link>
          )
        })}
      </List>
    )

    return null
  }
}
