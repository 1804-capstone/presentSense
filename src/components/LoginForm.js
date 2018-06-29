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
    this.setState({email: "", password: ""})
  }

  handleSignup() {
    const { navigate } = this.props.navigation
    this.props.signUpUser(this.state.email, this.state.password, navigate)
    this.setState({email: "", password: ""})
  }

  render() {
    return (
      <View>
        {this.props.errorMessage && (
          <Text style={{ color: "red" }}>{this.props.errorMessage}</Text>
        )}
        <TextInput
          style={styles.txt}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          style={styles.txt}
          secureTextEntry
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <View style={styles.btnContainer}>
          <Button
            title="Login"
            raised
            borderRadius={10}
            fontSize={24}
            style={styles.btn}
            backgroundColor="#00796B"
            onPress={this.handleLogin}
          />
          <Button
            title="Sign Up"
            raised
            borderRadius={10}
            fontSize={24}
            style={styles.btn}
            backgroundColor="#00796B"
            onPress={this.handleSignup}
          />
        </View>
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

const styles = StyleSheet.create({
  txt: {
    padding: 10,
    margin: 10,
    fontSize: 25,
    borderBottomWidth: 1
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  btn: {
    width: 150,
    margin: 10,
    marginTop: 30,
  }
})
