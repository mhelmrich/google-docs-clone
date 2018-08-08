import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import storage from 'electron-json-storage';
import AppBar from 'material-ui/AppBar';
import Login from './components/login';
import Draft from './components/draft';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: 0
    };
  }
  componentDidMount() {
    storage.get('session', (err, session) => {
      if (session.sessionID) this.login(session.sessionID);
      else this.setState({loggedIn: -1});
    });
  }
  login(sessionID) {
    if (sessionID) this.connectSocket(sessionID);
    else {
      axios.get('http://localhost:8080/session')
      .then((res) => {
        if (res.data.sessionID) this.connectSocket(res.data.sessionID);
        else this.setState({loggedIn: -1});
      })
      .catch(() => this.setState({loggedIn: -1}));
    }
  }
  connectSocket(sessionID) {
    this.socket = io('http://localhost:8080');
    this.socket.emit('authenticate', sessionID);
    this.socket.on('authenticated', () => {
      storage.set('session', {sessionID});
      this.setState({loggedIn: 1});
    });
    this.socket.on('authenticationFailed', () => this.logout());
  }
  logout() {
    this.socket.disconnect();
    storage.remove('session', () => {
      this.setState({loggedIn: -1});
    });
  }
  render() {
    if (!this.state.loggedIn) return <h2>Loading...</h2>;
    if (this.state.loggedIn === 1) return (<div>
      <AppBar
        title="Title"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <Draft socket={this.socket}/>
    </div>);
    return <Login login={() => this.login()}/>
  }
}
