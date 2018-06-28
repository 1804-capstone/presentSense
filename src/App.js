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
  Heartrate,
  StepsGraph,
  Signup,
  Preferences,
  MyEntries
} from "./components";

import MoodInputForm from "./components/forms/MoodInputForm";
import OuterInfluenceForm from "./components/forms/OuterInfluenceForm";
import AccomplishForm from "./components/forms/AccomplishForm";
import StruggleForm from "./components/forms/StruggleForm";
import JournalForm from "./components/forms/JournalForm";

const StackNavigator = createStackNavigator(
  {
    LoginScreen: { screen: Login },
    HomeScreen: { screen: Home },
    Dashboard: { screen: Dashboard },
    LoginForm: { screen: LoginForm },
    Loading: { screen: Loading },
    Heartrate: { screen: Heartrate },
    StepsGraph: { screen: StepsGraph },
    MoodInputForm: { screen: MoodInputForm },
    OuterInfluenceForm: { screen: OuterInfluenceForm },
    AccomplishForm: { screen: AccomplishForm },
    StruggleForm: { screen: StruggleForm },
    JournalForm: { screen: JournalForm },
    Preferences: { screen: Preferences },
    MyEntries: { screen: MyEntries }
  },

  {
    initialRouteName: "Loading"
  }
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    );
  }
}

