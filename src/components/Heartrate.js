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
  startDate: new Date(2017, 4, 20).toISOString(), // required
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
    renderer.setClearColor(0xffffff, 1);
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

      let light = new THREE.AmbientLight(0x404040, 3.7); // soft white light
      scene.add(light);

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
        let v2 = new THREE.Vector3(
          0.2 * startingData * Math.sin(angle2 * i + angle2 / 2),
          150 + 0.2 * startingData * Math.cos(angle2 * i + angle2 / 2),
          0
        );
        heartGeometry.vertices.push(v);
        heartGeometry.vertices.push(v2);
        //heartGeometry.vertices.push(new THREE.Vector3(0, 150, 0));
        if (i === num - 1) {
          heartGeometry.vertices.push(
            new THREE.Vector3(
              startingData * Math.sin(angle2 * 0),
              150 + startingData * Math.cos(angle2 * 0),
              0
            )
          );
          heartGeometry.vertices.push(
            new THREE.Vector3(
              0.2 * startingData * Math.sin(angle2 * 0 + angle2 / 2),
              150 + 0.2 * startingData * Math.cos(angle2 * 0 + angle2 / 2),
              0
            )
          );
        }
      }
      let color;
      for (let i = 0; i < heartGeometry.vertices.length - 1; i += 2) {
        if (i < heartGeometry.vertices.length - 2) {
          let face = new THREE.Face3(i, i + 1, i + 2);
          // if()
          for (let j = 0; j < 3; j++) {
            color = new THREE.Color(0xffffff);
            color.setHSL(255, 255, 255);
            face.vertexColors[j] = color;
          }
          heartGeometry.faces.push(face);
        }
        if (i < heartGeometry.vertices.length - 3) {
          let innerFace = new THREE.Face3(i + 2, i + 1, i + 3);
          for (let j = 0; j < 3; j++) {
            color = new THREE.Color(0x000000);
            color.setHSL(0, 0, 0);
            innerFace.vertexColors[j] = color;
          }
          heartGeometry.faces.push(innerFace);
          //console.log("inner?", innerFace);
        }
      }
      let innerFace = new THREE.Face3(1, 2, 3);
      for (let j = 0; j < 3; j++) {
        color = new THREE.Color(0xffffff);
        color.setHSL(255, 255, 255);
        innerFace.vertexColors[j] = color;
      }
      heartGeometry.faces.push(innerFace);
      // console.log(
      //   "faces",
      //   heartGeometry.faces.length,
      //   heartGeometry.vertices.length
      // );
      heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
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
      //heartgeometry stuff
      let num = heartOptions.limit;
      let angle2 = (2 * Math.PI) / num;
      let data;
      //handle animation of the outer vertices
      for (let i = 0; i < num; i++) {
        if (this.props.hrSamples && this.props.hrSamples.length) {
          data =
            this.props.hrSamples[i].value +
            80 +
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
      //handle animation of the inner vertices
      for (let i = 0; i < num; i++) {
        if (this.props.hrSamples && this.props.hrSamples.length) {
          data =
            this.props.hrSamples[i].value +
            50 +
            150 *
              Math.cos(
                2 * clock.getElapsedTime() + this.props.hrSamples[i].value * 20
              );
        } else {
          data = 100 + 40 * Math.sin(clock.getElapsedTime());
        }
        heartGeometry.vertices[i * 2 + 1].set(
          data * Math.sin(angle2 * i),
          150 + data * Math.cos(angle2 * i),
          0
        );
      }
      //set last vert (both inner and outer) to same position as first one to maintain continuous shape
      heartGeometry.vertices[20].set(
        heartGeometry.vertices[0].x,
        heartGeometry.vertices[0].y,
        heartGeometry.vertices[0].z
      );
      heartGeometry.vertices[21].set(
        heartGeometry.vertices[1].x,
        heartGeometry.vertices[1].y,
        heartGeometry.vertices[1].z
      );

      heartGeometry.verticesNeedUpdate = true;
      heartGeometry.colorsNeedUpdate = true;
      //updating colors
      let faceIndices = ["a", "b", "c"];
      let vertexIdx;
      let color;
      let p;
      for (let i = 0; i < heartGeometry.faces.length; i++) {
        if (this.props.hrSamples && this.props.hrSamples.length) {
          let constrainedIndex = i % this.props.hrSamples.length;
          // console.log(
          //   "my length",
          //   heartGeometry.faces.length,
          //   heartGeometry.vertices.length
          // );
          data =
            this.props.hrSamples[constrainedIndex].value +
            50 +
            50 *
              Math.sin(
                2 * clock.getElapsedTime() -
                  this.props.hrSamples[constrainedIndex].value * 20
              );
        } else {
          data = 100 + 40 * Math.sin(clock.getElapsedTime() - 10 * i);
        }
        let face = heartGeometry.faces[i];

        for (let j = 0; j < 3; j++) {
          if (j === 1) {
            face.vertexColors[j].r = 1;
            face.vertexColors[j].g = 1;
            face.vertexColors[j].b = 1;
          } else {
            face.vertexColors[j].r =
              0.5 + 0.1 * Math.sin(clock.getElapsedTime() + 0.02 * data);
            face.vertexColors[j].g =
              0.6 + 0.1 * Math.sin(clock.getElapsedTime() - 0.02 * data);
            face.vertexColors[j].b =
              0.8 + 0.3 * Math.sin(clock.getElapsedTime() + 0.01 * data);
          }
        }
      }
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
    console.log("**? ", this.props.hrSamples.length);
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
