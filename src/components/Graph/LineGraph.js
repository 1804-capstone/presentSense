import { scaleLinear, scaleTime } from "d3-scale";
import { line } from "d3-shape";
import {
  Dimensions,
  View,
  Text,
  ART,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import React from "react";
// import dummyData from "./DummyData";
import moment from "moment";
import d3 from "d3";
import { timeDay } from "d3-time";
import { connect } from "react-redux";
const { Surface, Group, Shape } = ART;

// let timeOptions = {
//   startDate: new Date(2018, 5, 1),
//   endDate: new Date()
// };

class LineGraph extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   paths: [],
    //   steps: this.props.steps,
    //   sleep: this.props.sleep,
    //   heart: this.props.heartRate,
    //   mood: this.props.mood
    // };
    this.individualGraphMaker = this.individualGraphMaker.bind(this);
    this.xAxis = this.xAxis.bind(this);
  }

  // static getDerivedStateFromProps(props, state) {
  //   if (props.steps !== state.steps) {
  //     return {
  //       steps: props.steps
  //     };
  //   }
  //   if (props.sleep !== state.sleep) {
  //     return { sleep: props.sleep };
  //   }
  //   if (props.heartRate !== state.heartRate) {
  //     return { heartRate: props.heartRate };
  //   }
  //   if (props.mood !== state.mood) {
  //     return { mood: props.mood };
  //   }
  //   if (props.startDate !== state.startDate) {
  //     return { startDate: props.startDate };
  //   }
  //   if (props.endDate !== state.endDate) {
  //     return { endDate: props.endDate };
  //   }
  //   return null;
  // }

  componentDidMount() {
    // let linePaths = [];
    let startDate = this.props.startDate;
    let endDate = this.props.endDate;
    console.log("here are the dates", startDate, endDate);
    // for (let datum in this.props) {
    //   if (Array.isArray(this.props[datum])) {
    //     let path = this.individualGraphMaker(
    //       this.props[datum],
    //       this.props.startDate,
    //       this.props.endDate,
    //       datum
    //     );
    //     linePaths.push(path);
    //   }
    // }
    // this.setState({ paths: linePaths });
  }
  individualGraphMaker = (data, startDate, endDate, datum) => {
    console.log(`here is the data for ${datum}`, data);
    //construct x-scale
    const min = new Date(startDate);
    const max = new Date(endDate);
    // console.log("the dates", startDate);
    const { width, height } = Dimensions.get("window");
    const x = scaleTime()
      .domain([min, max])
      .range([0, width]);

    //convert sleep data
    if (datum === "sleep") {
      data = data.map(datum => {
        const start = moment(new Date(datum.startDate));
        const end = moment(new Date(datum.endDate));
        let diff = end.diff(start, "hours", true);
        const newDatum = {
          value: diff,
          startDate: datum.startDate,
          endDate: datum.endDate
        };
        return newDatum;
      });
    }

    //construct y-scale
    const values = data.map(datum => datum.value);
    const maxVal = values.sort((a, b) => a - b)[values.length - 1];
    const y = scaleLinear()
      .domain([0, maxVal])
      .range([0, height * 0.5]);
    // create svg path
    const path = line()
      .x(d => x(d.startDate))
      .y(d => y(d.value));
    const newData = data.map(datum => ({
      value: datum.value * -1 + maxVal,
      startDate: new Date(datum.startDate.slice(0, -5)),
      endDate: new Date(datum.endDate.slice(0, -5))
    }));
    newData.reverse();
    let color;
    if (datum === "steps") {
      color = "#008b8b";
    }
    if (datum === "heartRate") {
      color = "#006400";
    }
    if (datum === "sleep") {
      color = "#104e8b";
    }
    if (datum === "mood") {
      color = "#68228b";
    }
    return {
      path: path(newData),
      color
    };
  };
  xAxis(startDate, endDate) {
    const min = new Date(startDate);
    const max = new Date(endDate);
    const { width, height } = Dimensions.get("window");
    const x = scaleTime()
      .domain([min, max])
      .range([0, width]);
    const y = scaleLinear()
      .domain([0, 10000])
      .range([0, height]);
    const ticks = x.ticks(timeDay.every(1));
    const dates = ticks.map(tick => [
      {
        tick,
        y: 0
      },
      { tick, y: height * 0.2 }
    ]);
    const points = dates.filter((date, index) => index % 3 === 0);
    const path = line()
      .x(d => x(d.tick))
      .y(d => y(d.y));
    return {
      path,
      points
    };
  }

  // yAxis(maxVal) {
  //   const min = new Date(this.props.startDate);
  //   const max = new Date(this.props.endDate);
  //   const { width, height } = Dimensions.get("window");
  //   const x = scaleTime()
  //     .domain([min, max])
  //     .range([0, width]);
  //   const y = scaleLinear()
  //     .domain([0, maxVal])
  //     .range([0, height]);
  //   const ticks = y.ticks(maxVal / 10);
  //   const yTicks = ticks.map(tick => [
  //     {
  //       x: 0,
  //       tick
  //     },
  //     { x: width * 0.2, tick }
  //   ]);
  //   const yPoints = yTicks.filter((date, index) => index % 3 === 0);
  //   const yPath = line()
  //     .x(d => x(d.x))
  //     .y(d => y(d.tick));
  //   return {
  //     yPoints,
  //     yPath
  //   };
  // }

  render() {
    console.log("****here is my state****", this.state);
    const { width, height } = Dimensions.get("window");
    const { path, points } = this.xAxis(
      this.props.startDate,
      this.props.endDate
    );
    let linePaths = [];

    for (let datum in this.props) {
      if (Array.isArray(this.props[datum])) {
        console.log("Here is the metric: ", datum);
        let path = this.individualGraphMaker(
          this.props[datum],
          this.props.startDate,
          this.props.endDate,
          datum
        );
        console.log(`here is the path for ${datum}:`, path);
        linePaths.push(path);
      }
    }
    // const values = this.props.data.steps.map(step => step.value);
    // const maxVal = values.sort((a, b) => a - b)[values.length - 1];
    // const { yPoints, yPath } = this.yAxis(maxVal);
    const noData = (
      <View>
        {" "}
        <ActivityIndicator size="large" />
      </View>
    );
    const data = (
      <View style={styles.container}>
        <Surface width={width} height={height}>
          <Group x={0} y={0}>
            {linePaths.map(path => (
              <Shape
                key={path.color}
                d={path.path}
                stroke={path.color}
                strokeWidth={2}
              />
            ))}
            {points.map(point => (
              <Shape d={path(point)} stroke="#000" strokeWidth={3} />
            ))}
            {/* {yPoints.map(point => (
              <Shape d={path(yPoints)} stroke="#000" strokeWidth={3} />
            ))} */}
            {/* <Shape
              d="M89.5389594561964,185.2777777777778L279.6344454939…015286,111.16666666666666L327.0129176979117,333.5"
              stroke="#000"
              strokeWidth={6}
            /> */}
          </Group>
        </Surface>
      </View>
    );
    return data;
  }
}

const mapState = state => {
  return {
    heartRate: state.heartRate.hrSamples,
    steps: state.steps,
    sleep: state.sleep,
    mood: state.mood,
    startDate: state.visMeta.startDate,
    endDate: state.visMeta.endDate
  };
};

export default connect(mapState)(LineGraph);

// const mapDispatch = dispatch => {
//   return {
//     fetchHeartRateOverTime: queryOptions =>
//       dispatch(fetchHeartRateOverTime(queryOptions)),
//     fetchStepsOverTime: queryOptions =>
//       dispatch(fetchLatestSteps(queryOptions)),
//     fetchSleep: queryOptions => dispatch(fetchSleep(queryOptions))
//   };
// };

const styles = StyleSheet.create({
  container: {
    display: "flex",
    padding: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(178, 223, 219, 1)"
  }
});
