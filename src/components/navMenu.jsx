import React from 'react';
import AppBar from 'material-ui/AppBar';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import DocumentView from './documentView';

export default class NavMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      menuTitle: 'HDocs',
      anchorEl: null,
      showMenu: false,
      showDoc: false,
      user: this.props.user,
    };
  }
  componentDidMount() {
    this.props.socket.on('docs', (docs) => {
      this.props.user.docs = docs.docs;
      this.props.user.sharedDocs = docs.sharedDocs;
      this.setState({showDoc: false, showMenu: false});
    });
  }
  render() {
    const avatars = [(
      <Avatar style={{margin: 10, color: '#fff', backgroundColor: 'orange'}}>
        {this.props.user.username[0]}
      </Avatar>
      ),
      (<Avatar style={{margin: 10, color: '#fff', backgroundColor: 'red'}}>
        D
      </Avatar>)];
    return (
      <div>
        <AppBar
          title={this.state.menuTitle}
          iconClassNameRight="muidocs-icon-navigation-expand-more"
          onLeftIconButtonClick={(e) => this.setState({
            anchorEl: e.currentTarget,
            showMenu: true
          })}>
          {avatars[0]} {avatars[1]}
          <Popover
            open={this.state.showMenu}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={() => this.setState({showMenu: false})}>
            <Menu>
              <MenuItem onClick={() => this.props.socket.emit('getDocs')}>
                My Documents
              </MenuItem>
              <MenuItem onClick={(e) => this.setState({showMenu:false})}>
                Share Documents
              </MenuItem>
              <MenuItem onClick={(e) => this.props.logout()}>
                Logout
              </MenuItem>
            </Menu>
          </Popover>
        </AppBar>
        <DocumentView user={this.props.user} socket={this.props.socket}
          changeMenuTitle={(title) => this.setState({menuTitle: title})}
          toggleDocs={() => this.setState({showDoc: !this.state.showDoc})}
          showDoc={this.state.showDoc}
         />
      </div>
    )
  }
}
