import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import AppleHealthKit from "rn-apple-healthkit";

let heartOptions = {
  unit: "bpm", // optional; default 'bpm'
  startDate: new Date(2017, 6, 20).toISOString(), // required
  endDate: new Date().toISOString(), // optional; default now
  ascending: false, // optional; default false
  limit: 10 // optional; default no limit
};

export default class Heartrate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 0
    };
    this.getHR = this.getHR.bind(this);
  }
  getHR() {
    heartOptions = { ...heartOptions, endDate: new Date().toISOString };
    AppleHealthKit.getHeartRateSamples(heartOptions, (err, results) => {
      if (err) {
        console.log("~~~~~~~~~~~~~~~error getting heart data");
        return;
      }
      console.log("LAST HEART SAMPLE", results);
      this.setState({ rate: results[0].value });
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <Button
          title={`HR: ${this.state.rate}`}
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#4DB6AC"
          onPress={() => this.getHR()}
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
