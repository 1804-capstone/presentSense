import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import LineGraph from "./LineGraph";
import Preferences from "../Preferences";
// import visMeta from "../../store/visMeta";
import { setEndDate } from "../../store/visMeta";
import { connect } from "react-redux";
import moment from "moment";

const GraphRender = props => {
  // let diff = props.endDate(props.startDate, "days");
  let end = moment(props.endDate);
  let start = moment(props.startDate);
  let diff = end.diff(start, "days");
  // <View style={styles.container}>
  //   <View style={styles.subContainer}>
  //     <View style={styles.dateStyle}>
  //       <Text>{props.startDate.toString().slice(4, 11)}</Text>
  //     </View>
  //     <View style={styles.graph}>
  //       <LineGraph />
  //     </View>
  //     <View style={styles.dateStyle}>
  //       <Text>{props.endDate.toString().slice(4, 11)}</Text>
  //     </View>
  //   </View>
  // </View>
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: 100,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 20 }}>Wellness data for {props.name}</Text>
        <Text style={{ fontSize: 15 }}>Swipe right for an abstract view</Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          marginTop: 30
          // transform: [{ rotate: "90deg" }]
        }}
      >
        <Text>{props.startDate.toString().slice(4, 11)}</Text>
        <Text>{props.endDate.toString().slice(4, 11)}</Text>
      </View>
      {/* <View style={styles.subContainer}> */}
      {/* <View><Text>Data for {props.user}</Text><View> */}
      {/* <View style={styles.dateStyle}>
        <Text>{props.startDate.toString().slice(4, 11)}</Text>
        <Text>{props.endDate.toString().slice(4, 11)}</Text>
      </View> */}
      <View style={styles.graph}>
        <LineGraph />
      </View>
      {/* <View style={styles.dateStyle} /> */}
      {/* </View> */}
      <View style={styles.labels}>
        {props.moodOn ? (
          <Text style={{ color: "#006400", fontWeight: "bold", fontSize: 30 }}>
            Mood
          </Text>
        ) : (
          <Text />
        )}
        {props.stepCountOn ? (
          <Text style={{ color: "#008b8b", fontWeight: "bold", fontSize: 30 }}>
            Steps
          </Text>
        ) : (
          <Text />
        )}
        {props.sleepOn ? (
          <Text style={{ color: "#104e8b", fontWeight: "bold", fontSize: 30 }}>
            Sleep
          </Text>
        ) : (
          <Text />
        )}
        {props.heartRateOn ? (
          <Text style={{ color: "#68228b", fontWeight: "bold", fontSize: 30 }}>
            Heartrate
          </Text>
        ) : (
          <Text />
        )}
      </View>
    </View>
  );
};

const mapState = state => {
  return {
    startDate: state.visMeta.startDate,
    endDate: state.visMeta.endDate,
    heartRateOn: state.visMeta.heartrate,
    stepCountOn: state.visMeta.stepCount,
    sleepOn: state.visMeta.sleep,
    moodOn: state.visMeta.mood,
    name: state.firestoreStore.preferences.name
  };
};

export default connect(mapState)(GraphRender);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    height: "100%",
    width: "100%",
    padding: 10
  },
  // subContainer: {
  //   flex: 0.5,
  //   flexDirection: "row",
  //   alignItems: "center",
  //   // backgroundColor: "red",
  //   marginTop: 10
  // },
  graph: {
    // top: 5,
    // left: -10,
    // left: -40,
    // width: "50%",
    borderColor: "white",
    marginTop: 10
    // top: "auto",
    // bottom: "auto"
    // marginTop: 100,
    // height: 100
  },
  labels: {
    position: "absolute",
    top: 500,
    flex: 1,
    flexDirection: "row"
  },
  dateStyle: {
    transform: [{ rotate: "90deg" }],
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100
    // backgroundColor: "red"

    // marginTop: -5
  }
});
