import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';
import Button from 'material-ui/Button';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';

class ColorMenu extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <div>
        <button onClick={this.handleClick}>
          Open Menu
        </button>
        {/*<Button
          aria-owns={anchorEl ? 'simple-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          Open Menu
        </Button>*/}
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem className="colorOption" style={{backgroundColor: 'red'}} onClick={this.handleClose}>Red</MenuItem>
          <MenuItem className="colorOption" style={{backgroundColor: 'blue'}} onClick={this.handleClose}>Blue</MenuItem>
          <MenuItem className="colorOption" style={{backgroundColor: 'yellow'}} onClick={this.handleClose}>Yellow</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default ColorMenu;
