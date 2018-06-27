import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import AppleHealthKit from "rn-apple-healthkit";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { signOutUser } from "../store/firebase";

let options = {
  permissions: {
    read: [
      "StepCount",
      "DateOfBirth",
      "ActiveEnergyBurned",
      "SleepAnalysis",
      "Steps",
      "HeartRate",
      "BodyTemperature",
      "RespiratoryRate"
    ],
    write: ["MindfulSession", "StepCount", "Steps"]
  }
};

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available: false
    };
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    const { navigate } = this.props.navigation;
    this.props.signOutUser(navigate);
  }

  render() {
    AppleHealthKit.isAvailable((err, available) => {
      if (err) {
        console.log("error initializing Healthkit: ", err);
        return;
      } else {
        console.log("hEEEEEEEYYYYYOOOODONUTTTTTT!!!!!!***********");
      }
      // Healthkit is available
    });

    AppleHealthKit.initHealthKit(options, (err, results) => {
      if (err) {
        console.log("error initializing Healthkit: ", err);
        return;
      } else {
        console.log("HEALTHKIT IS INITIALIZED!!!!!!");
      }
      // Healthkit is initialized...
      // now safe to read and write Healthkit data...
    });
    const { navigate } = this.props.navigation;

    console.log("USERDOC!!!!!", this.props.userDocId);
    return (
      <View style={styles.container}>
        <Button
          title="Logout"
          raised
          style={styles.buttons}
          buttonStyle={{ width: "25%", alignSelf: "flex-end" }}
          borderRadius={10}
          fontSize={15}
          backgroundColor="#80CBC4"
          onPress={() => this.handleLogout()}
        />
        <Button
          title="Dashboard"
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#4DB6AC"
          onPress={() => navigate("Heartrate")}
        />
        <Button
          title="Preferences"
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#26A69A"
          onPress={() => navigate("Preferences")}
        />
        <Button
          title="My Entries"
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#009688"
          onPress={() => navigate("MoodInputForm")}
        />
        <Button
          title="Stress Relief"
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#00897B"
          onPress={() => navigate("")}
        />
        <Button
          title="Mood Maps"
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#00796B"
          onPress={() => navigate("StepsGraph")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2F1",
    // alignItems: 'center',
    justifyContent: "space-between",
    paddingTop: "5%",
    paddingBottom: "10%"
  },
  buttons: {
    // padding: '5%',
    // height: 200,
    // flex: 1
  }
});

const mapDispatch = dispatch => {
  return {
    signOutUser: navigate => dispatch(signOutUser(navigate))
  };
};

const mapState = state => {
  return {
    userDocId: state.firestoreStore.userDocId
  };
};

export default connect(
  mapState,
  mapDispatch
)(Home);
