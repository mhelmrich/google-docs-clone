import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import AppBar from 'material-ui/AppBar';
import Login from './components/login';
import Draft from './components/draft';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: '',
    };
    this.socket = io('http://localhost:8080');
  }
  componentDidMount() {
    this.socket.on('connect', () => {
    });
    axios.get('http://localhost:8080/username')
    .then((response) => {
      if (response.data.success) {
        this.setState({loggedIn: true, username: response.data.username});
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }
  login(username) {
    this.setState({loggedIn: true, username: username});
  }
  logout() {
    this.setState({loggedIn: false, username: ''});
  }
  render() {
    if (this.state.loggedIn) return (<div>
      <AppBar
        title="Title"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <Draft />
    </div>);
    return <Login login={(username) => this.login(username)}/>
  }
}
