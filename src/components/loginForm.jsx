import React from 'react';
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import {AccountCircle} from 'material-ui-icons'
import Avatar from 'material-ui/Avatar';

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }
  submit() {
    this.props.login(this.state.username, this.state.password);
  }

  render() {
    return (
      <div id="loginForm">
        <Paper style={{
          padding: 100,
          justifyContent: 'center'
        }}>
          <AccountCircle style={{paddingLeft: 75, opacity: 0.5, height: 75, width: 75}}/>
          <br/>
          <TextField autoFocus id="username" label="Document Name" type="text"
              placeholder="Username" onChange={(e) => this.setState({username: e.target.value})}
            />
          <br/>
          <TextField autoFocus id="password" label="Document Name" type="text"
              placeholder="Password" onChange={(e) => this.setState({password: e.target.value})}
            />
          <br/>
          <RaisedButton label="Login" primary={true} onClick={() => this.submit()}></RaisedButton>
          <br/> <br/>
          <FlatButton label="Create a new account" primary={true} onClick={this.props.toRegistration}/>
          {/*<RaisedButton onClick={this.props.toRegistration}>Register</RaisedButton>*/}
        </Paper>
      </div>
    );
  }
}
