import React from 'react'

export default class extends React.Component {
  render() {
    if (this.props.showLauncher) {
      return <div id='cast'>
        <google-cast-launcher></google-cast-launcher>
      </div>
    }

    return null
  }
}
