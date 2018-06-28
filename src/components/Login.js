import React from "react";
import firebase from "react-native-firebase";
import { StyleSheet, Text, View, Image } from "react-native";
import AnimBlob from "./AnimBlob";
import LoginForm from "./LoginForm";

const Login = props => {
  return (
    <View style={styles.container}>
      <View>
        <AnimBlob />
      </View>
      <View style={styles.loginContainer}>
        <LoginForm navigation={props.navigation}/>
      </View>
    </View>
  );
}

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0F2F1",
    height: '100%',
    width: '100%',
    display: 'flex'
  },
  loginContainer: {
    marginTop: '20%',
    position: 'absolute',
    alignSelf: 'center'
  }
})
