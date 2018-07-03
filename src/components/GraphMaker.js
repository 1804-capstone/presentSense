import React from "react";
import {
  View,
  Text,
  ART,
  StyleSheet,
  Dimensions,
  ActivityIndicator
} from "react-native";
const { Surface, Group, Shape } = ART;
import { scaleLinear, scaleTime } from "d3-scale";
import { connect } from "react-redux";
import { line, rec } from "d3-shape";
import * as d3Array from "d3-array";
import { axisBottom } from "d3-axis";
import * as d3 from "d3";
import { timeDay } from "d3-time";
import StepsGraph from "./StepsGraph";
import LineGraph from "./LineGraph";
import moment from "moment";

//thunks we're gonna need
import {
  fetchHeartRateOverTime,
  fetchLatestHeartRate
} from "../store/heartrate";
import { fetchLatestSteps } from "../store/steps";
import { fetchSleep } from "../store/sleep";
let queryOptions = {
  startDate: new Date(2018, 5, 1).toISOString(), // required
  endDate: new Date().toISOString() // optional; default now
};

class Graphmaker extends React.Component {
  constructor(props) {
    super(props);
    //arrays for all the types of data we are expecting
    this.state = {
      steps: [],
      heartRate: [],
      sleep: [],
      xAxis: 0,
      xAxisLine: ""
    };
    // this.getSteps = this.getSteps.bind(this);
    this.getHeartRate = this.getHeartRate.bind(this);
    this.getXAxis = this.getXAxis.bind(this);
  }
  componentDidMount() {
    if (!this.props.heartRateSamples || !this.props.heartRateSamples.length) {
      this.props.fetchHeartRateOverTime(queryOptions);
      this.setState({ heartRate: this.props.heartRateSamples });
    }
    if (!this.props.stepSamples || !this.props.stepSamples.length) {
      this.props.fetchStepsOverTime(queryOptions);
      this.setState({ steps: this.props.stepSamples });
    }
    if (!this.props.sleepSamples || !this.props.sleepSamples.length) {
      this.props.fetchSleep(queryOptions);
      this.setState({ sleep: this.props.sleepSamples });
    }
    if (this.state.xAxis === 0) {
      this.getXAxis();
    }
  }
  newQueryOptions() {
    queryOptions = { ...queryOptions, endDate: new Date().toISOString() };
  }

  getXAxis() {
    let start = moment(queryOptions.startDate);
    let end = moment(queryOptions.endDate);
    const width = Dimensions.get("window").width;
    const xAxis = end.diff(start, "days");
    this.setState({ xAxis: xAxis });
    // const x = scaleTime()
    //   .domain([
    //     new Date(queryOptions.startDate),
    //     new Date(queryOptions.endDate)
    //   ])
    //   .range([0, width * 0.8]);
    const x = scaleTime()
      .domain([0, 1])
      .range([0, width * 0.8]);
    // const xAxisLine = axisBottom(x).ticks(26);
    console.log("what is X", x);
    let arr = [];
    for (let i = 0; i < xAxis; i++) {
      arr.push(i);
    }
    let xAxisLine = line()
      .x(function(d) {
        return x(d);
      })
      .y(() => 0);
    let myLine = xAxisLine(arr);
    this.setState({ xAxisLine: myLine });
    console.log("what is my line", myLine);
  }

  // async getSteps() {
  //   try {
  //   } catch (err) {
  //     console.log("error gettting steps", err);
  //   }
  // }
  getHeartRate() {
    this.newQueryOptions();
    this.props.fetchHeartRateOverTime(heartOptions);
  }
  render() {
    console.log("here is my state", this.state);
    let minDate = new Date(queryOptions.startDate);
    let maxDate = new Date(queryOptions.endDate);
    const { height, width } = Dimensions.get("window");
    // const x = scaleTime()
    //   .domain([minDate, maxDate])
    //   .range([0, width * 0.8]);
    // const ticks = x.ticks(timeDay.every(1));
    const theStartDate = queryOptions.startDate;
    const newStart = moment(new Date(theStartDate));
    const now = moment(new Date());

    let diff = now.diff(theStartDate, "days");

    const graphContent = (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View style={styles.dateStyle}>
            <Text>{minDate.toString().slice(4, 11)}</Text>
          </View>

          {/* <View style={styles.graph}>
            <StepsGraph
              startDate={queryOptions.startDate}
              endDate={queryOptions.endDate}
              data={{
                steps: this.props.stepSamples,
                heartRate: this.props.heartRateSamples
              }}
            />
          </View> */}
          <View style={styles.graph}>
            <LineGraph
              startDate={queryOptions.startDate}
              endDate={queryOptions.endDate}
              data={{
                steps: this.props.stepSamples,
                heartRate: this.props.heartRateSamples
              }}
            />
          </View>
          <View style={styles.dateStyle}>
            <Text>{maxDate.toString().slice(4, 11)}</Text>
          </View>
        </View>
        {/* <View style={styles.xAxis}> */}
        {/* <View style={[styles.tickLabelX, { flex: 1, flexDirection: "row" }]}> */}
        {/* <View style={{ backgroundColor: "yellow" }}>
          <View style={{ flex: 1, flexDirection: "row" }}>
            {ticks.map(tick => {
              return (
                <Text key={tick} style={{ left: x(tick) }}>
                  '
                </Text>
              );
            })}
          </View> */}
        {/* <Surface
            width={Dimensions.get("window").width * 0.8}
            height={Dimensions.get("window").height * 0.02}
          >
            <Group x={0} y={5}>
              <Shape
                d={this.state.xAxisLine}
                stroke={"#2ca02c"}
                strokeWidth={10}
              />
            </Group>
          </Surface> */}
        {/* </View> */}
        <View>
          <Text style={{ color: "red", fontWeight: "bold" }}>
            Your heartrate for the past {diff + 1} days
          </Text>
          <Text style={{ color: "blue", fontWeight: "bold" }}>
            Your steps for the past {diff + 1} days
          </Text>
        </View>
      </View>
    );
    const noData = (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
    return this.props.stepSamples.length && this.props.heartRateSamples.length
      ? graphContent
      : noData;
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchHeartRateOverTime: queryOptions =>
      dispatch(fetchHeartRateOverTime(queryOptions)),
    fetchStepsOverTime: queryOptions =>
      dispatch(fetchLatestSteps(queryOptions)),
    fetchSleep: queryOptions => dispatch(fetchSleep(queryOptions))
  };
};
const mapStateToProps = state => {
  return {
    heartRateSamples: state.heartRate.hrSamples,
    stepSamples: state.steps,
    sleepSamples: state.sleep
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  },
  subContainer: {
    flex: 0.6,
    flexDirection: "row",
    alignItems: "center"
    // backgroundColor: "red",
    // marginTop: -5
  },
  graph: {
    backgroundColor: "green"
  },
  dateStyle: {
    transform: [{ rotate: "90deg" }]
    // marginTop: -5
  }
  // xAxis: {
  //   backgroundColor: "yellow"
  //   // flex: 1,
  //   // flexDirection: "column"
  // },
  // tickLabelX: {
  //   position: "absolute",
  //   bottom: 0,
  //   fontSize: 12,
  //   textAlign: "center"
  // }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Graphmaker);
