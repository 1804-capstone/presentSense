import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button
} from "react-native";
import firebase from "react-native-firebase";

export default class Loading extends React.Component {
  componentDidMount() {
    console.log("in loading page, PROPSSS", this.props.navigation.navigate);
    firebase.auth().onAuthStateChanged(user => {
      console.log("in loading page, ***********************", user);
      this.props.navigation.navigate(user ? "HomeScreen" : "LoginScreen");
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
        <Button
          title="do navigation"
          onPress={() => this.props.navigation.navigate("LoginScreen")}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
