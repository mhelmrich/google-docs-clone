import React from 'react';
import AppBar from 'material-ui/AppBar';
import TextField from 'material-ui/TextField'
import {Editor, EditorState, RichUtils, convertFromRaw, convertToRaw} from 'draft-js';
//import ColorMenu from './color-menu.jsx'
import Colors from './colors.jsx'

export default class Draft extends React.Component {
  constructor(props) {
    super(props);
    let editorState = EditorState.createEmpty();
    this.state = {
      editorState,
      textAlignment: 'left',
      colorHex: ''
    };
    this.onChange = (editorState) => {
      this.setState({editorState});
      this.props.socket.emit('editorChange', editorState);
    }
  }
  componentDidMount() {
    if (this.props.doc.content !== 'new') this.setContent(this.props.doc.content);
  }
  getContent() {
    return JSON.stringify(convertToRaw(this.state.editorState.getCurrentContent()));
  }
  setContent(rawContent) {
    this.setState({editorState: convertFromRaw(JSON.parse(rawContent))});
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
    </div>);
  }
}
