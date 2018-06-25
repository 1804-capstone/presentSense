import React from "react";
import firebase from "react-native-firebase";
import { StyleSheet, Text, View, Image, TextInput, Button } from "react-native";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: null
    };
    this.handleLogin = this.handleLogin.bind(this);
  }
  handleLogin = async () => {
    const { email, password } = this.state;
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      this.props.navigation.navigate("HomeScreen");
    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log(err);
    }
  };
  handleSignup = async () => {
    try {
      await firebase
        .auth()
        .createUserWithEmailAndPassword(this.state.email, this.state.password);
      this.props.navigation.navigate("HomeScreen");
    } catch (err) {
      console.log(err);
      this.setState({ errorMessage: err.message });
    }
  };
  render() {
    return (
      <View style={{ backgroundColor: "green" }}>
        <Text>Login!</Text>
        {this.state.errorMessage && (
          <Text style={{ color: "red" }}>{this.state.errorMessage}</Text>
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
        <Button title="Login" onPress={this.handleLogin} />
        <Button title="Sign Up" onPress={this.handleSignup} />
      </View>
    );
  }
}
