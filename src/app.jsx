import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import storage from 'electron-json-storage';
import AppBar from 'material-ui/AppBar';
import Login from './components/login';
import Draft from './components/draft';
import ToolBar from 'material-ui/Toolbar'
import IconButton from "material-ui/IconButton"
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Popover from 'material-ui/Popover'
import { ExitToApp, FormatBold, FormatItalic, FormatUnderlined, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, FormatListBulleted, FormatListNumbered, FormatSize, FormatColorText} from 'material-ui-icons';

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
if (this.state.loggedIn === 1) return (<div>
       <AppBar
          title="HDocs"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonClick={(e) => this.setState({
            anchorEl: e.currentTarget,
            showMenu: true
          })}
        >
          <Popover
            open={this.state.showMenu}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
             targetOrigin={{horizontal: 'left', vertical: 'top'}}
             onRequestClose={() => this.setState({
               showMenu: false
             })}
          >
            <Menu>
              <MenuItem onClick={(e) => this.setState({
                showMenu:false
              })}>My Documents</MenuItem>
              <MenuItem onClick={(e) => this.setState({
                showMenu:false
              })}>Share Documents</MenuItem>
              <MenuItem onClick={(e) => this.logout()}>Logout</MenuItem>
            </Menu>
          </Popover>
        </AppBar>
       {/*<AppBar
          title="HDocs"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        >

        </AppBar>*/}
        <Draft socket={this.socket}/>
    </div>);
    return <Login login={() => this.login()}/>
  }
}
