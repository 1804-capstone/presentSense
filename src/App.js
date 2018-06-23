import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import { Provider } from "react-redux";
//redux store
import store from "./store";
import {
  Login,
  Home,
  Dashboard,
  LoginForm,
  Loading,
  Heartrate
} from "./components";

import MoodInputForm from "./components/forms/MoodInputForm";
import OuterInfluenceForm from "./components/forms/OuterInfluenceForm";

const StackNavigator = createStackNavigator(
  {
    LoginScreen: { screen: Login },
    HomeScreen: { screen: Home },
    Dashboard: { screen: Dashboard },
    LoginForm: { screen: LoginForm },
    Loading: { screen: Loading },
    Heartrate: { screen: Heartrate },
    MoodInputForm: { screen: MoodInputForm },
    OuterInfluenceForm: { screen: OuterInfluenceForm }
  },
  {
    initialRouteName: "HomeScreen"
  }
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <StackNavigator />
      </Provider>
      // <View style={styles.container}>
      //   <Text>Hello</Text>
      //   <Text>Hey</Text>
      //   <Text>Shake your money maker</Text>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
