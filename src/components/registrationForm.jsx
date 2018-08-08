import React from 'react';

class RegistrationForm extends React.Component {
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
        <input id="email" type="text" placeholder="Email Address"
          onChange={(e) => this.setState({email: e.target.value})}/>
        <input id="username" type="text" placeholder="Username"
          onChange={(e) => this.setState({username: e.target.value})}/>
        <input id="password" type="password" placeholder="Password"
          onChange={(e) => this.setState({password: e.target.value})}/>
        <input id="confirm" type="password" placeholder="Confirm Password"
          onChange={(e) => this.setState({confirm: e.target.value})}/>
        <button onClick={() => this.submit()}>Register</button>
        <button onClick={this.props.toLogin}>Login here</button>
      </div>
    );
  }
}

export default RegistrationForm;
