import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import storage from 'electron-json-storage';
import AppBar from 'material-ui/AppBar';
import ToolBar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import {ExitToApp, FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatListBulleted, FormatListNumbered, FormatSize, FormatColorText} from 'material-ui-icons';
import Login from './components/login';
import DocumentView from './components/documentView';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: 0,
      user: null,
      anchorEl: null,
      showMenu: false,
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
    this.socket.on('authenticated', (user) => {
      storage.set('session', {sessionID});
      this.setState({user, loggedIn: 1});
    });
    this.socket.on('authenticationFailed', () => this.logout());
  }
  logout() {
    this.socket.disconnect();
    storage.remove('session', () => {
      this.setState({user: null, loggedIn: -1});
    });
  }
  render() {
    if (!this.state.loggedIn) return <h2>Loading...</h2>;
    if (this.state.loggedIn < 0) return <Login login={() => this.login()}/>
    const avatars = [(
      <Avatar style={{margin: 10, color: '#fff', backgroundColor: 'orange'}}>
        M
      </Avatar>
      ),
      (<Avatar style={{margin: 10, color: '#fff', backgroundColor: "red"}}>
        D
      </Avatar>)];
    return (
      <div>
        <AppBar title="HDocs" iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonClick={(e) => this.setState({
            anchorEl: e.currentTarget,
            showMenu: true
          })}>
          {avatars[0]} {avatars[1]}
          <Popover open={this.state.showMenu} anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => this.setState({showMenu: false})}>
            <Menu>
              <MenuItem onClick={(e) => this.setState({showMenu:false})}>
                My Documents
              </MenuItem>
              <MenuItem onClick={(e) => this.setState({showMenu:false})}>
                Share Documents
              </MenuItem>
              <MenuItem onClick={(e) => this.logout()}>
                Logout
              </MenuItem>
            </Menu>
          </Popover>
        </AppBar>
        <DocumentView user={this.state.user} socket={this.socket}/>
      </div>
    );
  }
}
