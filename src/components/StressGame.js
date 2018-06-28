import React, { Component } from "react";
import { StyleSheet } from "react-native";
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
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#FFF"
//   }
// });
