import React from "react";
import { View, Text, ART, StyleSheet } from "react-native";
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
  endDate: new Date(2018, 5, 8).toISOString() // optional; default now
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

const y = scaleLinear()
  .domain([0, 40000])
  .range([0, 400]);
const x = scaleTime()
  .domain([new Date(2018, 6, 4), new Date(2018, 6, 12)])
  .range([0, 400]);

const dataLine = line()
  .x(function(d) {
    return x(d.date);
  })
  .y(function(d) {
    return y(d.value);
  });

const dataShape = dataLine(data);

class StepsGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: []
    };
    this.getSteps = this.getSteps.bind(this);
  }
  componentDidMount() {
    if (!this.props.steps.length) {
      this.props.fetchLatestSteps(stepOptions);
    }
    this.getSteps();
  }

  getSteps() {
    stepOptions = { ...stepOptions };
    this.props.fetchLatestSteps(stepOptions);
    this.setState({ steps: this.props.steps });
  }

  render() {
    const noData = (
      <Text>There does not seem to be data for your step count.</Text>
    );

    const stepData = (
      <View style={styles.container}>
        <Text style={styles.heading}>Your weekly step count</Text>
        <Surface width={400} height={500}>
          <Group x={0} y={0}>
            <Shape d={dataShape} stroke="#000" strokeWidth={1} />
          </Group>
        </Surface>
      </View>
    );

    return this.state.steps.length ? stepData : noData;
  }
}

const mapStateToProps = state => {
  return {
    steps: state.steps
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchLatestSteps: options => dispatch(fetchLatestSteps(options))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StepsGraph);

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
