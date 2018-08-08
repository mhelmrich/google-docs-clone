import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
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
      loggedIn: false,
      anchorEl: null,
      showMenu: false,
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
    //if (this.state.loggedIn)
     return (<div>
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
    //return <Login login={() => this.login()}/>
  }
}
