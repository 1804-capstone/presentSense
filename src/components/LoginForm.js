import React from "react";
import firebase from "react-native-firebase";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import { Button } from "react-native-elements";
import { connect } from 'react-redux'
import { signUpUser, signIn } from '../store/firebase'

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleSignup = this.handleSignup.bind(this)
  }

  handleLogin() {
    const { email, password } = this.state;
    const { navigate } = this.props.navigation
    this.props.signIn(email, password, navigate)
  }

  handleSignup() {
    const { navigate } = this.props.navigation
    this.props.signUpUser(this.state.email, this.state.password, navigate)
  }

  render() {
    return (
      <View style={{ backgroundColor: "#E0F2F1" }}>
        <Text>Login!</Text>
        {this.props.errorMessage && (
          <Text style={{ color: "red" }}>{this.props.errorMessage}</Text>
        )}
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button
          title="Login"
          raised
          borderRadius={10}
          large={false}
          fontSize={24}
          backgroundColor="#00796B"
          onPress={this.handleLogin}
        />
        <Button
          title="Sign Up"
          raised
          borderRadius={10}
          large={false}
          fontSize={24}
          backgroundColor="#00796B"
          onPress={this.handleSignup}
        />
      </View>
    );
  }
}

const mapState = state => {
  return {
    errorMessage: state.firestoreStore.errorMessage
  }
}

const mapDispatch = dispatch => {
  return {
    signUpUser: (email, password, navigate) => dispatch(signUpUser(email, password, navigate)),
    signIn: (email, password, navigate) => dispatch(signIn(email, password, navigate))
  }
}

export default connect(mapState, mapDispatch)(LoginForm)
