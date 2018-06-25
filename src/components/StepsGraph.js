import React from "react";
import { View, Text, ART, StyleSheet } from "react-native";
const { Surface, Group, Shape } = ART;
import { scaleLinear, scaleTime } from "d3-scale";
import { line } from "d3-shape";
import * as d3Array from "d3-array";
import * as d3 from "d3";

// const d3 = {
//   scale,
//   shape
// };

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

export default class LineGraph extends React.Component {
  render() {
    console.log("HERE IS THE DATA LINE!!!!!!!!", dataLine);
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Your weekly step count</Text>
        <Surface width={400} height={500}>
          <Group x={0} y={0}>
            <Shape d={dataShape} stroke="#000" strokeWidth={1} />
          </Group>
        </Surface>
      </View>
    );
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
