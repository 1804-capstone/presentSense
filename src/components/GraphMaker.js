import React from "react";
import { View, Text, ART, StyleSheet, Dimensions } from "react-native";
const { Surface, Group, Shape } = ART;
import { scaleLinear, scaleTime } from "d3-scale";
import { connect } from "react-redux";
import { line } from "d3-shape";
import * as d3Array from "d3-array";
import * as d3 from "d3";
import StepsGraph from "./StepsGraph";

//thunks we're gonna need
import {
  fetchHeartRateOverTime,
  fetchLatestHeartRate
} from "../store/heartrate";
import { fetchLatestSteps } from "../store/steps";
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
      heartRate: []
    };
    this.getSteps = this.getSteps.bind(this);
    this.getHeartRate = this.getHeartRate.bind(this);
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
  }
  newQueryOptions() {
    queryOptions = { ...queryOptions, endDate: new Date().toISOString() };
  }
  async getSteps() {
    try {
    } catch (err) {
      console.log("error gettting steps", err);
    }
  }
  getHeartRate() {
    this.newQueryOptions();
    this.props.fetchHeartRateOverTime(heartOptions);
  }
  render() {
    const graphContent = (
      <View style={styles.container}>
        <View style={styles.subContainer}>
          <View>
            <Text>Y</Text>
          </View>

          <View style={styles.graph}>
            <StepsGraph
              startDate={queryOptions.startDate}
              endDate={queryOptions.endDate}
              data={{
                steps: this.props.stepSamples,
                heartRate: this.props.heartRateSamples
              }}
            />
          </View>
          <View>
            <Text>Y</Text>
          </View>
        </View>
        <View style={styles.xAxis}>
          <Text>THIS IS THE X AXIS!!!</Text>
        </View>
      </View>
    );
    const noData = <Text>nope :(</Text>;
    return this.props.stepSamples.length && this.props.heartRateSamples.length
      ? graphContent
      : noData;
  }
}
const mapDispatchToProps = dispatch => {
  return {
    fetchHeartRateOverTime: queryOptions =>
      dispatch(fetchHeartRateOverTime(queryOptions)),
    fetchStepsOverTime: queryOptions => dispatch(fetchLatestSteps(queryOptions))
  };
};
const mapStateToProps = state => {
  return {
    heartRateSamples: state.heartRate.hrSamples,
    stepSamples: state.steps
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: "pink"
  },
  subContainer: {
    flex: 0.6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "red"
  },
  graph: {
    backgroundColor: "green"
  },
  xAxis: {
    backgroundColor: "blue"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Graphmaker);
