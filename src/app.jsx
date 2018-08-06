import React from 'react';
import io from 'socket.io-client';
import AppBar from 'material-ui/AppBar';
import Draft from './components/draft.jsx';

export default class App extends React.Component {
 constructor(props) {
   super(props);
   console.log('constructor');
   this.socket = io('http://localhost:8080');
 }

 componentDidMount() {
   console.log('mounted');
   this.socket.on('connect', () => {
     console.log('connected');
   });
 }

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
