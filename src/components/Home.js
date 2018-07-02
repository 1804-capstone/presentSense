import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import AppleHealthKit from "rn-apple-healthkit";
import { connect } from "react-redux";
import { signOutUser, fetchUserInfo } from "../store/firebase";

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

  componentDidMount() {
    const { navigate } = this.props.navigation;
    this.props.fetchUserInfo(navigate);
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
        <View style={styles.header}>
          <Button
            title="Account"
            raised
            buttonStyle={{ width: "75%", alignSelf: "flex-start" }}
            borderRadius={10}
            fontSize={15}
            backgroundColor="#80CBC4"
            onPress={() => navigate("Preferences")}
          />
          <Button
            title="Logout"
            raised
            buttonStyle={{ width: "75%", alignSelf: "flex-end" }}
            borderRadius={10}
            fontSize={15}
            backgroundColor="#80CBC4"
            onPress={() => this.handleLogout()}
          />
        </View>
        <Button
          title="My Data"
          raised
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#4DB6AC"
          onPress={() => navigate("Dashboard")}
        />
        <Button
          title="Abstract Data"
          raised
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#26A69A"
          onPress={() => navigate("Heartrate")}
        />
        <Button
          title="My Journal"
          raised
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#009688"
          onPress={() => navigate("MyJournals")}
        />
        <Button
          title="Stress Relief"
          raised
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#00897B"
          onPress={() => navigate("StressRelief")}
        />
        <Button
          title="Mood Map"
          raised
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#00796B"
          onPress={() => navigate("MoodMap")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#E0F2F1",
    // alignItems: 'center',
    justifyContent: "space-between",
    paddingTop: "5%",
    paddingBottom: "10%"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});

const mapDispatch = dispatch => {
  return {
    signOutUser: navigate => dispatch(signOutUser(navigate)),
    fetchUserInfo: navigate => dispatch(fetchUserInfo(navigate))
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
