import React from "react";
import firebase from "react-native-firebase";
import { StyleSheet, Text, View, Image, TextInput, Button } from "react-native";

export default class LoginForm extends React.Component {
  state = {
    email: "",
    password: "",
    errorMessage: null
  };
  handleLogin = () => {
    // TODO: Firebase stuff...
    console.log("handleLogin");
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
      </View>
    );
  }
}
