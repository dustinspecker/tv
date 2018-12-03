import AppBar from '@material-ui/core/AppBar'
import CastLauncher from './components/cast-launcher/'
import EpisodeList from './components/episode-list'
import MediaList from './components/media-list/'
import PlayerControls from './components/player-controls/'
import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import './style.css'
import {render} from 'react-dom'
import SeasonList from './components/season-list'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

class App extends React.Component {
  state = {
    currentTime: 0,
    duration: 0,
    isPaused: false,
    page: 'media',
    shows: [],
    showControls: false,
    showMedia: false
  }

  componentDidMount() {
    fetch('/videos')
      .then(response => response.json())
      .then(({shows}) => {
        this.setState({shows})
      })

    const player = new cast.framework.RemotePlayer()
    this.player = player
    const controller = new cast.framework.RemotePlayerController(player)
    this.controller = controller

    controller.addEventListener(
      cast.framework.RemotePlayerEventType.ANY_CHANGE,
      event => {
        this.setState({
          currentTime: player.currentTime,
          duration: player.mediaInfo ? player.mediaInfo.duration : 0,
          isPaused: player.isPaused,
          showControls: player.isMediaLoaded
        })
      }
    )

    const context = cast.framework.CastContext.getInstance()

    context.requestSession()

    context.addEventListener(cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
      event => {
        switch (event.sessionState) {
          case cast.framework.SessionState.SESSION_STARTED:
          case cast.framework.SessionState.SESSION_RESUMED:
            this.setState({showMedia: true})
            break;
          default:
            this.setState({showMedia: false})
        }
      }
    )
  }

  render() {
    const seek = seekTime => {
      this.player.currentTime = seekTime
      this.controller.seek()
    }

    const stop = () => {
      cast.framework.CastContext.getInstance().getCurrentSession().endSession(true)
    }

    const mediaList = () => <MediaList media={this.state.shows} showMedia={true} />

    return <Router>
      <>
        <AppBar position='static'>
          <Toolbar>
            <Typography
              color='inherit'
              variant='h6'
            >
              {'TV'}
            </Typography>
          </Toolbar>
        </AppBar>
        <CastLauncher showLauncher={!this.state.showMedia} />
        <Route
          component={mediaList}
          exact
          path='/'
        />
        <Route
          component={SeasonList}
          exact
          path='/show/:showname'
        />
        <Route
          component={EpisodeList}
          path='/show/:showname/:season'
        />
        <PlayerControls
          currentTime={this.state.currentTime}
          duration={this.state.duration}
          isPaused={this.state.isPaused}
          playOrPause={() => this.controller.playOrPause()}
          seek={seek}
          showControls={this.state.showControls}
          stop={stop}
        />
      </>
    </Router>
  }
}


window['__onGCastApiAvailable'] = function(isAvailable) {
  if (isAvailable) {
    cast.framework.CastContext.getInstance().setOptions({
      receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    });

    render(React.createElement(App), document.getElementById('app'))
  }
};
