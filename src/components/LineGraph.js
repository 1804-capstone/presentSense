import { scaleLinear, scaleTime } from "d3-scale";
import { line } from "d3-shape";
import { Dimensions, View, Text, ART, StyleSheet } from "react-native";
import React from "react";
import dummyData from "./DummyData";
import moment from "moment";
import d3 from "d3";
import { timeDay } from "d3-time";
const { Surface, Group, Shape } = ART;

export const yScale = data => {
  const values = data.map(datum => datum.value);
  const maxVal = values.sort((a, b) => a - b)[values.length - 1];
  const height = Dimensions.get("window").height;
  return scaleLinear()
    .domain([0, maxVal])
    .range([0, height * 0.5]);
};

export const xScale = timeOptions => {
  const min = timeOptions.startDate;
  const max = timeOptions.endDate;
  const width = Dimensions.get("window").width;
  return scaleTime()
    .domain([min, max])
    .range([0, width * 0.8]);
};

const makeLineGraph = (data, timeOptions) => {
  const { width, height } = Dimensions.get("window");
  const y = yScale(data);
  const x = xScale(timeOptions);
  const path = line()
    .x(d => d.endDate)
    .y(d => y(d.value));
  const values = data.map(datum => ({
    value: datum.value * -1 + height * 0.5,
    startDate: new Date(datum.startDate.slice(0, -5)),
    endDate: new Date(datum.endDate.slice(0, -5))
  }));
  values.reverse();
  const shape = path(values);
  const ticks = values.map(value => {
    return {
      xVal: xScale(value.endDate),
      yVal: yScale(value.data),
      datum: value
    };
  });
  return {
    yAxis: y,
    shape,
    ticks
  };
};

const myTimes = {
  startDate: new Date(2018, 5, 1), // required
  endDate: new Date()
};

const miniData = [
  {
    value: 11000,
    startDate: "2018-06-28T00:00:00.000-0400",
    endDate: "2018-06-29T00:00:00.000-0400"
  },
  {
    value: 9000,
    startDate: "2018-06-27T00:00:00.000-0400",
    endDate: "2018-06-28T00:00:00.000-0400"
  }
];

export default class Graph extends React.Component {
  render() {
    const { width, height } = Dimensions.get("window");
    // console.log("HERE IS MY START DATE", myTimes.startDate);
    // const myDate = new Date(miniData[0].endDate.slice(0, -5));
    // const x = xScale(myTimes);
    // const stuff = makeLineGraph(miniData, myTimes, width, height);
    // console.log("DOES THIS WORK", stuff);
    // const y = yScale(miniData);
    // console.log("is this working", y(8000));
    const y = yScale(miniData);
    const x = xScale(myTimes);
    const values = miniData.map(datum => ({
      value: datum.value * -1 + height * 0.5,
      startDate: new Date(datum.startDate.slice(0, -5)),
      endDate: new Date(datum.endDate.slice(0, -5))
    }));
    values.reverse();
    // console.log("here is my y", x(values[0].endDate));
    // console.log("here are my values", values);
    // const xVals = values.map(elem => x(elem.endDate));
    // console.log("here are the x axis coords", xVals);
    // const path = line()
    //   .x(d => x(d.endDate))
    //   .y(d => y(d.value));
    // const xAxis = line()
    //   .x(d => x(d.endDate))
    //   .y(() => 0);
    // console.log("here is my path", path(miniData));
    const thingy = x.ticks(timeDay.every(1));
    console.log("HERE IS MY THING", thingy);
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        {thingy.map(elem => {
          return (
            <Text key={elem} style={{ left: x(elem) * 2 }}>
              Hey
            </Text>
          );
        })}
      </View>
    );
  }
}
