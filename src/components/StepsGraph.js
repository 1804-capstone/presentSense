import React from "react";
import { View, Text, ART, StyleSheet, Dimensions } from "react-native";
const { Surface, Group, Shape } = ART;
import { scaleLinear, scaleTime } from "d3-scale";
import { connect } from "react-redux";
import { line } from "d3-shape";
import * as d3Array from "d3-array";
import * as d3 from "d3";
import { fetchLatestSteps } from "../store/steps";
import AppleHealthKit from "rn-apple-healthkit";

// const d3 = {
//   scale,
//   shape
// };

let stepOptions = {
  startDate: new Date(2018, 5, 1).toISOString(), // required
  endDate: new Date().toISOString() // optional; default now
};

const data = [
  {
    value: 8844,
    date: new Date(2018, 6, 11)
  },
  {
    value: 31334.089178032547,
    date: new Date(2018, 6, 10)
  },
  {
    value: 7200.910821967459,
    date: new Date(2018, 6, 9)
  },
  {
    value: 8306.47278558407,
    date: new Date(2018, 6, 8)
  },
  {
    value: 13022.527214415924,
    date: new Date(2018, 6, 7)
  },
  {
    value: 7505,
    date: new Date(2018, 6, 6)
  },
  {
    value: 7959,
    date: new Date(2018, 6, 5)
  },
  {
    value: 6808.313621096995,
    date: new Date(2018, 6, 4)
  }
];

export default class HealthGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      heartLineShape: "",
      stepLineShape: ""
    };
    // this.getSteps = this.getSteps.bind(this);
    // this.makeGraph = this.makeGraph.bind(this);
    // this.newStepOptions = this.newStepOptions.bind(this);
  }
  //options to help us set up the d3/ART surface

  componentDidMount() {
    // if (!this.props.steps.length) {
    //   this.newStepOptions();
    //   this.props.fetchLatestSteps(stepOptions);
    // }
    //this.getSteps();
    this.makeGraph();
  }

  // async getSteps() {
  //   try {
  //     this.newStepOptions();
  //     await this.props.fetchLatestSteps(stepOptions);
  //     this.setState({ steps: this.props.steps });
  //   } catch (err) {
  //     console.log("error gettting steps", err);
  //   }
  // }
  // newStepOptions() {
  //   stepOptions = { ...stepOptions, endDate: new Date().toISOString() };
  // }
  async makeGraph() {
    try {
      //set up our graph scales
      console.log("What is my data", this.props.data);
      let minDate = new Date(this.props.startDate);
      let maxDate = new Date(this.props.endDate);
      const { height, width } = Dimensions.get("window");
      const y = scaleLinear()
        .domain([0, 10000])
        .range([0, height * 0.5]);
      const x = scaleTime()
        .domain([minDate, maxDate])
        .range([0, width]);
      const lineGraph = line()
        .x(function(d) {
          return x(d.endDate);
        })
        .y(function(d) {
          return y(d.value);
        });

      let stepValues;
      if (this.props.data.steps && this.props.data.steps.length) {
        for (let i = 0; i < this.props.data.steps.length; i++) {
          console.log(
            "**",
            this.props.startDate,
            this.props.data.steps[i].startDate
          );
        }
        stepValues = this.props.data.steps.map(step => ({
          value: step.value,
          startDate: new Date(step.startDate.slice(0, -5)),
          endDate: new Date(step.endDate.slice(0, -5))
        }));
        stepValues.reverse();
      }
      const stepLineShape = lineGraph(stepValues);
      if (stepValues && stepValues.length) {
        this.setState({ stepLineShape: stepLineShape });
      }
    } catch (err) {
      console.log("error with steps making graph", err);
    }
  }

  render() {
    this.props.data.steps &&
    this.props.data.steps.length &&
    !this.state.stepLineShape.length
      ? this.makeGraph()
      : null;
    const noData = (
      <Text>There does not seem to be data for your step count.</Text>
    );
    const stepData = (
      <Surface
        width={Dimensions.get("window").width}
        height={Dimensions.get("window").height * 0.5}
      >
        <Group x={0} y={0}>
          <Shape d={this.state.stepLineShape} stroke="#000" strokeWidth={3} />
        </Group>
      </Surface>
    );

    return this.props.data.steps && this.props.data.steps.length
      ? stepData
      : noData;
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
  heading: {
    flex: 1,
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 30,
    alignItems: "center"
  }
});
