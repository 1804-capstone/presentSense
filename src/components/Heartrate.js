import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { WebGLView } from "react-native-webgl";
import THREE from "./three";
import { MeshLine, MeshLineMaterial } from "three.meshline";
//these actions should let us talk to healthkit
import {
  fetchLatestHeartRate,
  fetchHeartRateOverTime
} from "../store/heartrate";
//starting options for heart rate gatherer
let heartOptions = {
  unit: "bpm", // optional; default 'bpm'
  startDate: new Date(2017, 6, 20).toISOString(), // required
  endDate: new Date().toISOString(), // optional; default now
  ascending: false, // optional; default false
  limit: 10 // optional; default no limit
};

class Heartrate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 0
    };
    this.getHR = this.getHR.bind(this);
    this.onContextCreate = this.onContextCreate.bind(this);
    this.interpolateArray = this.interpolateArray.bind(this);
  }
  componentDidMount() {
    if (!this.props.lastHr) {
      this.props.fetchLatestHeartRate(heartOptions);
    }
    if (!this.props.hrSamples) {
      this.props.fetchHeartRateOverTime(heartOptions);
    }
    this.getHR();
  }
  componentWillUnmount() {
    cancelAnimationFrame();
  }
  onContextCreate = (gl: WebGLRenderingContext) => {
    const rngl = gl.getExtension("RN");
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({
      canvas: {
        width,
        height,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: height
      },
      context: gl
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 1);
    let camera;
    let scene;
    let cube;
    let lineGeometry;
    let line;
    let heartGeometry;
    let heartMesh;
    let heartMaterial;

    function init() {
      camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
      camera.position.y = 150;
      camera.position.z = 500;
      scene = new THREE.Scene();

      let geometry = new THREE.BoxGeometry(200, 200, 200);
      for (let i = 0; i < geometry.faces.length; i += 2) {
        let hex = Math.random() * 0xffffff;
        geometry.faces[i].color.setHex(hex);
        geometry.faces[i + 1].color.setHex(hex);
      }

      let material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.FaceColors,
        overdraw: 0.5
      });

      cube = new THREE.Mesh(geometry, material);
      cube.position.y = 150;

      let light = new THREE.AmbientLight(0x404040); // soft white light
      scene.add(light);

      //meshyline
      // lineGeometry = new THREE.Geometry();
      // let numPoints = heartOptions.limit * 30;
      // let angle = (2 * Math.PI) / numPoints;
      // let startingData = 100;
      // for (let i = 0; i < numPoints; i++) {
      //   let v = new THREE.Vector3(
      //     startingData * Math.sin(angle * i),
      //     150 + startingData * Math.cos(angle * i),
      //     0
      //   );
      //   lineGeometry.vertices.push(v);
      // }
      // line = new MeshLine();
      // line.setGeometry(lineGeometry);
      // let lineMaterial = new MeshLineMaterial({ lineWidth: 30 });
      // let LineMesh = new THREE.Mesh(line.geometry, lineMaterial);
      // scene.add(LineMesh);
      let startingData = 100;
      heartGeometry = new THREE.Geometry();
      let num = heartOptions.limit;
      let angle2 = (2 * Math.PI) / num;
      for (let i = 0; i < num; i++) {
        let v = new THREE.Vector3(
          startingData * Math.sin(angle2 * i),
          150 + startingData * Math.cos(angle2 * i),
          0
        );
        heartGeometry.vertices.push(v);
        heartGeometry.vertices.push(new THREE.Vector3(0, 150, 0));
        if (i === num - 1) {
          heartGeometry.vertices.push(
            new THREE.Vector3(
              startingData * Math.sin(angle2 * 0),
              150 + startingData * Math.cos(angle2 * 0),
              0
            )
          );
        }
      }
      let color;
      for (let i = 0; i < heartGeometry.vertices.length - 1; i += 2) {
        let face = new THREE.Face3(i, i + 1, i + 2);
        for (let j = 0; j < 3; j++) {
          color = new THREE.Color(0xffcc00);
          color.setHSL(10 * i, 255 - 10 * i, 255 - 30 * j);
          face.vertexColors[j] = color;
        }
        heartGeometry.faces.push(face);
      }

      heartMaterial = new THREE.MeshPhongMaterial({
        color: 0x00ffcc,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
      });
      heartMaterial.vertexColors = THREE.VertexColors;
      heartGeometry.computeFaceNormals();
      heartGeometry.computeVertexNormals();
      heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);
      scene.add(heartMesh);
    }

    const animate = () => {
      this.requestId = requestAnimationFrame(animate);
      renderer.render(scene, camera);

      // lineGeometry.verticesNeedUpdate = true;

      // let numPoints = heartOptions.limit * 30;
      // let angle = (2 * Math.PI) / numPoints;
      // let startingData;
      // let smoothedData;
      // let targetLength = numPoints;
      // if (this.props.hrSamples && this.props.hrSamples.length) {
      //   //set last data to same as first so we have a smooth circle
      //   this.props.hrSamples[
      //     this.props.hrSamples.length - 1
      //   ] = this.props.hrSamples[0];
      //   let data = this.props.hrSamples.map(sample => sample.value);
      //   smoothedData = this.interpolateArray(data, targetLength);
      //   // console.log(smoothedData);
      // } else {
      //   smoothedData = new Array(targetLength).fill(100);
      // }
      // for (let i = 0; i < numPoints; i++) {
      //   if (this.props.hrSamples && this.props.hrSamples.length) {
      //     startingData =
      //       smoothedData[i] +
      //       50 +
      //       50 * Math.sin(2 * clock.getElapsedTime() - smoothedData[i] * 0.1);
      //   } else {
      //     startingData = 100 + 40 * Math.sin(clock.getElapsedTime());
      //   }
      //   let v = new THREE.Vector3(
      //     startingData * Math.sin(angle * i),
      //     150 + startingData * Math.cos(angle * i),
      //     0
      //   );
      //   lineGeometry.vertices[i] = v;
      // }
      // line.setGeometry(lineGeometry);
      // lineGeometry.verticesNeedUpdate = true;

      //heartgeometry stuff
      let num = heartOptions.limit;
      let angle2 = (2 * Math.PI) / num;
      let data;
      for (let i = 0; i < num; i++) {
        if (this.props.hrSamples && this.props.hrSamples.length) {
          data =
            this.props.hrSamples[i].value +
            50 +
            50 *
              Math.sin(
                2 * clock.getElapsedTime() - this.props.hrSamples[i].value * 20
              );
        } else {
          data = 100 + 40 * Math.sin(clock.getElapsedTime());
        }
        heartGeometry.vertices[i * 2].set(
          data * Math.sin(angle2 * i),
          150 + data * Math.cos(angle2 * i),
          0
        );
      }
      //set last vert to same position as first one to maintain continuous shape
      heartGeometry.vertices[20].set(
        heartGeometry.vertices[0].x,
        heartGeometry.vertices[0].y,
        heartGeometry.vertices[0].z
      );
      heartGeometry.verticesNeedUpdate = true;
      //updating colors
      let faceIndices = ["a", "b", "c"];
      let vertexIdx;
      let color;
      let p;
      for (let i = 0; i < heartGeometry.faces.length; i++) {
        if (this.props.hrSamples && this.props.hrSamples.length) {
          data =
            this.props.hrSamples[i].value +
            50 +
            50 *
              Math.sin(
                2 * clock.getElapsedTime() - this.props.hrSamples[i].value * 20
              );
        } else {
          data = 100 + 40 * Math.sin(clock.getElapsedTime() - 10 * i);
        }
        let face = heartGeometry.faces[i];
        console.log("data values", data);
        for (let j = 0; j < 3; j++) {
          vertexIdx = face[faceIndices[j]];
          p = heartGeometry.vertices[vertexIdx];
          color = new THREE.Color(0xffffff);
          color.setHSL(p.y, p.x, data);
          //heartGeometry.faces[i].vertexColors[j].set(color);
          face.vertexColors[j].r = 1 / (i + 1);
          face.vertexColors[j].g = 1 / (j + 1);
          face.vertexColors[j].b = 1 / (2 * j + 1);
        }
      }
      console.log(heartGeometry.faces[0].vertexColors);
      heartGeometry.colorsNeedUpdate = true;
      gl.flush();
      rngl.endFrame();
    };

    init();
    animate();
  };
  interpolateArray(data, fitCount) {
    let linearInterpolate = function(before, after, atPoint) {
      return before + (after - before) * atPoint;
    };

    let newData = new Array();
    let springFactor = new Number((data.length - 1) / (fitCount - 1));
    newData[0] = data[0]; // for new allocation
    for (let i = 1; i < fitCount - 1; i++) {
      let tmp = i * springFactor;
      let before = new Number(Math.floor(tmp)).toFixed();
      let after = new Number(Math.ceil(tmp)).toFixed();
      let atPoint = tmp - before;
      newData[i] = linearInterpolate(data[before], data[after], atPoint);
    }
    newData[fitCount - 1] = data[data.length - 1]; // for new allocation
    return newData;
  }
  getHR() {
    //destructure our options so we can set new options with new NOW date
    heartOptions = { ...heartOptions, endDate: new Date().toISOString() };
    this.props.fetchLatestHeartRate(heartOptions);
    this.setState({ rate: this.props.lastHr.value || 0 });
    this.props.fetchHeartRateOverTime(heartOptions);
  }
  render() {
    return (
      <View style={styles.container}>
        <WebGLView
          style={styles.webglView}
          onContextCreate={this.onContextCreate}
        />
        {}
        <Button
          title={`HR: ${this.state.rate}`}
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#4DB6AC"
          onPress={() => this.getHR()}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    //justifyContent: "center",
    paddingTop: "10%",
    paddingBottom: "10%"
  },
  buttons: {
    // padding: '5%',
    // height: 200,
    // flex: 1
  },
  webglView: {
    width: 350,
    height: 350
  }
});

//getting our actions on props
const mapDispatchToProps = dispatch => {
  return {
    fetchLatestHeartRate: heartOptions =>
      dispatch(fetchLatestHeartRate(heartOptions)),
    fetchHeartRateOverTime: heartOptions =>
      dispatch(fetchHeartRateOverTime(heartOptions))
  };
};

const mapStateToProps = state => {
  return {
    lastHr: state.heartRate.lastHr,
    hrSamples: state.heartRate.hrSamples
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Heartrate);
