import React from "react";
import { View, Text, ART, StyleSheet, Dimensions } from "react-native";
const { Surface, Group, Shape } = ART;
import { scaleLinear, scaleTime } from "d3-scale";
import { connect } from "react-redux";
import { line } from "d3-shape";
import * as d3Array from "d3-array";
import * as d3 from "d3";
import AppleHealthKit from "rn-apple-healthkit";
import { timeDay } from "d3-time";

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
    value: 6000,
    endDate: new Date(2018, 6, 11)
  },
  {
    value: 6000,
    endDate: new Date(2018, 6, 10)
  },
  {
    value: 7000,
    endDate: new Date(2018, 6, 9)
  },
  {
    value: 10000,
    endDate: new Date(2018, 6, 8)
  },
  {
    value: 11000,
    endDate: new Date(2018, 6, 7)
  },
  {
    value: 9000,
    endDate: new Date(2018, 6, 6)
  },
  {
    value: 3000,
    endDate: new Date(2018, 6, 5)
  },
  {
    value: 8000,
    endDate: new Date(2018, 6, 4)
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
      const yStep = scaleLinear()
        .domain([0, 10000])
        .range([0, height * 0.5]);
      const x = scaleTime()
        .domain([minDate, maxDate])
        .range([0, width * 0.8]);
      const stepLineGraph = line()
        .x(function(d) {
          return x(d.endDate);
        })
        .y(function(d) {
          return yStep(d.value);
        });

      const yHeart = scaleLinear()
        .domain([0, 300])
        .range([0, height * 0.5]);
      const heartLineGraph = line()
        .defined(function(d) {
          return d.value;
        })
        .x(function(d) {
          return x(d.endDate);
        })
        .y(function(d) {
          return yHeart(d.value);
        });

      // const heartLineShape = lineGraph(data);
      // this.setState({ heartLineShape: heartLineShape });

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
      const stepLineShape = stepLineGraph(stepValues);
      if (stepValues && stepValues.length) {
        this.setState({ stepLineShape: stepLineShape });
      }
      let heartValues;
      if (this.props.data.heartRate && this.props.data.heartRate.length) {
        heartValues = this.props.data.heartRate.map(rate => ({
          value: rate.value,
          startDate: new Date(rate.startDate.slice(0, -5)),
          endDate: new Date(rate.endDate.slice(0, -5))
        }));
        heartValues.reverse();
      }
      const heartLineShape = heartLineGraph(heartValues);
      if (heartValues && heartValues.length) {
        this.setState({ heartLineShape: heartLineShape });
      }
    } catch (err) {
      console.log("error making graph", err);
    }
  }

  render() {
    console.log("HERE IS MY STATE", this.state);
    let minDate = new Date(this.props.startDate);
    let maxDate = new Date(this.props.endDate);
    const { height, width } = Dimensions.get("window");
    const x = scaleTime()
      .domain([minDate, maxDate])
      .range([0, width * 0.55]);
    const ticks = x.ticks(timeDay.every(1));

    this.props.data.steps &&
    this.props.data.steps.length &&
    !this.state.stepLineShape.length &&
    this.props.data.heartRate &&
    this.props.data.heartRate.length &&
    !this.state.heartLineShape.length
      ? this.makeGraph()
      : null;
    const noData = (
      <Text>There does not seem to be data for your step count.</Text>
    );
    const stepData = (
      <View styles={{ flex: 1, flexDirection: "column" }}>
        <Surface
          width={Dimensions.get("window").width * 0.8}
          height={Dimensions.get("window").height * 0.5}
        >
          <Group x={0} y={0}>
            <Shape d={this.state.stepLineShape} stroke="blue" strokeWidth={3} />
            <Shape d={this.state.heartLineShape} stroke="red" strokeWidth={1} />
          </Group>
        </Surface>
        <View style={styles.ticksYContainer}>
          <View style={[styles.tickLabelX, { flex: 1, flexDirection: "row" }]}>
            {ticks.map(tick => {
              return (
                <Text key={tick} style={{ left: x(tick) }}>
                  '
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    );

    return this.props.data.steps &&
      this.props.data.steps.length &&
      this.state.heartLineShape.length
      ? stepData
      : noData;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2F1",
    // alignItems: 'center',
    // justifyContent: "space-between",
    paddingTop: "10%",
    paddingBottom: "10%"
  },
  heading: {
    flex: 1,
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 30,
    alignItems: "center"
  },
  tickLabelX: {
    position: "absolute",
    bottom: 0,
    fontSize: 12,
    textAlign: "center"
  },
  ticksYContainer: {
    position: "absolute",
    top: 0,
    left: 0
  }
});
