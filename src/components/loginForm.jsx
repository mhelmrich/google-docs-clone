import React from 'react';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
    }
  }
  submit() {
    console.log('submit login');
    this.props.login(this.state.username, this.state.password);
  }
  render() {
    return (
      <div id="loginForm">
        <input id="username" type="text" placeholder="Username"
          onChange={(e) => this.setState({username: e.target.value})}/>
        <input id="password" type="password" placeholder="Password"
          onChange={(e) => this.setState({password: e.target.value})}/>
        <button onClick={() => this.submit()}>Log in</button>
        <button onClick={this.props.toRegistration}>Register here</button>
      </div>
    );
  }
}

export default LoginForm;
