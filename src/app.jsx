import React from 'react';
import AppBar from 'material-ui/AppBar';
import { Editor, EditorState, RichUtils } from 'draft-js';
import Draft from './components/draft.jsx'

export default class App extends React.Component {
  render() {
    return (<div>
      <h2>Welcome to React!</h2>
      <AppBar
        title="Title"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
      <Draft />
    </div>);
  }
}
