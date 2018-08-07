import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import AppBar from 'material-ui/AppBar';
import Login from './components/login';
import Draft from './components/draft';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    };
  }
  login() {
    axios.get('http://localhost:8080/session')
    .then((response) => {
      if (response.data.sessionID) {
        this.socket = io('http://localhost:8080');
        this.socket.emit('authenticate', response.data.sessionID);
        this.setState({loggedIn: true});
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
  logout() {
    this.socket.disconnect();
    this.setState({loggedIn: false});
  }
  render() {
    if (this.state.loggedIn) return (<div>
      <AppBar
        title="Title"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <Draft socket={this.socket}/>
    </div>);
    return <Login login={() => this.login()}/>
  }
}
