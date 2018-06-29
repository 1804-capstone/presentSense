import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { GameEngine } from "react-native-game-engine";
import {
  createStream,
  assignFinger,
  moveStream,
  releaseFinger,
  endStream
} from "./StreamFunction";

export default class StressGame extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>Tap anywhere!</Text>
        <GameEngine
          systems={[
            createStream,
            assignFinger,
            moveStream,
            releaseFinger,
            endStream
          ]}
          entities={{}}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#1d423d"
  },
  txt: {
    textAlign: "center",
    fontSize: 20,
    color: "#E0F2F1"
  }
});
