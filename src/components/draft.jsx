import React from 'react';
import io from 'socket.io-client';
import AppBar from 'material-ui/AppBar';
import { Editor, EditorState, RichUtils } from 'draft-js';
import TextField from 'material-ui/TextField'
//import ColorMenu from './color-menu.jsx'
import Colors from './colors.jsx'

export default class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      textAlignment: 'left',
      colorHex: ''
    };
    this.onChange = (editorState) => this.setState({editorState});
    this.socket = io('http://localhost:8080');
  }
  componentDidMount() {
    this.socket.on('connect', () => {
      //handle socket events
    });
  }
  _onBoldClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }
  _onItalClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  }
  _onUnderClick(e) {
    e.preventDefault();
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  }
  _onLeftClick(e) {
    e.preventDefault();
    this.onChange(console.log(this));
  }
  _onCenterClick(e) {
    e.preventDefault();
    this.onChange(this.setState({
      textAlignment: 'center'
    }));
  }
  _onRightClick(e) {
    e.preventDefault();
    this.onChange(this.setState({
      textAlignment: 'right'
    }));
  }

  handleText(e) {
    this.setState({
      colorHex: e.target.value
    });
    console.log(this.state.colorHex)
  }

  render() {
    return (<div>
      <Colors />
      {/*<button onMouseDown={(e) => this._onBoldClick(e)}>BOLD</button>
      <button onMouseDown={(e) => this._onItalClick(e)}>ITALICS</button>
      <button onMouseDown={(e) => this._onUnderClick(e)}>UNDERLINE</button>
      <button onMouseDown={(e) => this._onLeftClick(e)}>Left</button>
      <button onMouseDown={(e) => this._onCenterClick(e)}>Center</button>
      <button onMouseDown={(e) => this._onRightClick(e)}>Right</button>

      <TextField
          id="with-placeholder"
          label="With placeholder"
          placeholder="Color Hex Value"
          className='colorHex'
          onChange={(events) => this.handleText(events)}
        />
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
      /> */}
    </div>);
  }
}
