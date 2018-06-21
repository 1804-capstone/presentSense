import React from "react";
import firebase from "react-native-firebase";
import { StyleSheet, Text, View, Image } from "react-native";

import LoginForm from "./LoginForm";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.unsubscriber = null;
    this.state = {
      user: null
    };
  }
  componentDidMount() {
    console.log("LOGINLOGINLOGIN");
    this.unsubscriber = firebase.auth().onAuthStateChanged(user => {
      this.setState({ user });
    });
  }
  componentWillUnmount() {
    if (this.unsubscriber) {
      this.unsubscriber();
    }
  }

  render() {
    const { user } = this.state;
    if (!this.state.user) {
      return <LoginForm />;
    }
    return (
      <View style={{ flex: 1, backgroundColor: "steelblue" }}>
        <Image
          source={require("../images/confusedsmiley.png")}
          // style={{ width: 350, height: 350 }}
        />
      </View>
    );
  }
}
// const dumbLogin = props => {
//   return (
//     <View style={{ flex: 1, backgroundColor: "steelblue" }}>
//       <Image
//         source={require("../images/confusedsmiley.png")}
//         // style={{ width: 350, height: 350 }}
//       />
//       <Text>Hi</Text>
//       <Text>Hey</Text>
//     </View>
//   );
// };

export default Login;
