import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import AppleHealthKit from "rn-apple-healthkit";

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

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      available: false
    };
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
    return (
      <View style={styles.container}>
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
          onPress={() => navigate("MyAccount")}
        />
        <Button
          title="My Entries"
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#009688"
          onPress={() => navigate("MyEntries")}
        />
        <Button
          title="Stress Relief"
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#00897B"
          onPress={() => navigate("StressRelief")}
        />
        <Button
          title="Mood Maps"
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#00796B"
          onPress={() => navigate("HeatMap")}
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
    paddingTop: "10%",
    paddingBottom: "10%"
  },
  buttons: {
    // padding: '5%',
    // height: 200,
    // flex: 1
  }
});
