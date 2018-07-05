import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "react-navigation";
import { Provider } from "react-redux";
//redux store
import store from "./store";
import {
  Login,
  Home,
  MyData,
  LoginForm,
  Loading,
  Heartrate,
  StepsGraph,
  // GraphMaker,
  Signup,
  Preferences,
  StressRelief,
  Doodler,
  MyJournals,
  NewJournal,
  MoodMap,
  StressGame,
  SingleJournal,
  DataCarousel
} from "./components";

console.disableYellowBox = true;
const StackNavigator = createStackNavigator(
  {
    LoginScreen: { screen: Login },
    HomeScreen: { screen: Home },
    MyData: { screen: MyData },
    LoginForm: { screen: LoginForm },
    Loading: { screen: Loading },
    Heartrate: { screen: Heartrate },
    // GraphMaker: { screen: GraphMaker },
    Preferences: { screen: Preferences },
    StressGame: { screen: StressGame },
    StressRelief: { screen: StressRelief },
    Doodler: { screen: Doodler },
    MyJournals: { screen: MyJournals },
    NewJournal: { screen: NewJournal },
    DataCarousel: { screen: DataCarousel },
    MoodMap: { screen: MoodMap },
    SingleJournal: { screen: SingleJournal }
  },

  {
    initialRouteName: "Loading",
    navigationOptions: {
      headerStyle: {
        backgroundColor: "#B2DFDB"
      },
      headerTitle: "PresentSense"
    }
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
