import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import {AccountCircle} from 'material-ui-icons'
import Avatar from 'material-ui/Avatar';

export default class RegistrationForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      username: '',
      password: '',
      confirm: '',
    }
  }
  submit() {
    if (this.state.password === this.state.confirm) {
      this.props.register(this.state.email, this.state.username, this.state.password);
    }
  }
  render() {
    return (
      <div id="registrationForm">
        <Paper style={{padding:100}}>
          <AccountCircle style={{paddingLeft: 75, opacity: 0.5, height: 75, width: 75}}/>
          <br/>
          <TextField autoFocus id="email" label="Email Address" type="email"
              placeholder="Email Address" onChange={(e) => this.setState({email: e.target.value})}
            />
          <br/>
          <TextField autoFocus id="username" label="Username" type="text"
              placeholder="Username" onChange={(e) => this.setState({username: e.target.value})}
            />
          <br/>
          <TextField autoFocus id="password" label="Password" type="password"
              placeholder="Password" onChange={(e) => this.setState({password: e.target.value})}
            />
          <br/>
          <TextField autoFocus id="confirm" label="Confirm Password" type="password"
              placeholder="Confirm Password" onChange={(e) => this.setState({confirm: e.target.value})}
            />
          <br/>
          <RaisedButton label="Register" primary={true} onClick={() => this.submit()}></RaisedButton>
          <br/> <br/>
          <FlatButton label="Sign in instead" primary={true} onClick={this.props.toLogin}/>

          {/*<RaisedButton onClick={() => this.submit()}>Register</RaisedButton>
          <RaisedButton onClick={this.props.toLogin}>Login here</RaisedButton>*/}
        </Paper>
        {/*<input id="email" type="text" placeholder="Email Address"
          onChange={(e) => this.setState({email: e.target.value})}/>
        <input id="username" type="text" placeholder="Username"
          onChange={(e) => this.setState({username: e.target.value})}/>
        <input id="password" type="password" placeholder="Password"
          onChange={(e) => this.setState({password: e.target.value})}/>
        <input id="confirm" type="password" placeholder="Confirm Password"
          onChange={(e) => this.setState({confirm: e.target.value})}/>
        <button onClick={() => this.submit()}>Register</button>
        <button onClick={this.props.toLogin}>Login here</button>*/}
      </div>
    );
  }
}
