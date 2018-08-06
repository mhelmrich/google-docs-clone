import React from 'react';
import { Editor, EditorState, RichUtils } from 'draft-js';

class Draft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState: EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
  }

  _onBoldClick(e) {
    e.preventDefault()
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));
  }

  render() {
    return (<div>
      <button onMouseDown={(e) => this._onBoldClick(e)}>BOLD</button>
      <Editor
        editorState={this.state.editorState}
        onChange={this.onChange}
      />
    </div>);
  }
}

export default class App extends React.Component {
  render() {
    return (<div>
      <h2>Welcome to React!</h2>
      <Draft />
    </div>);
  }
}
