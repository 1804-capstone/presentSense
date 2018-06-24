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
      // scene.add(cube);
      //meshyline
      lineGeometry = new THREE.Geometry();
      // for (let j = 0; j < Math.PI; j += (2 * Math.PI) / 100) {
      //   let v = new THREE.Vector3(
      //     Math.cos(j) * 100,
      //     150 + Math.sin(j) * 100,
      //     0
      //   );
      //   lineGeometry.vertices.push(v);
      // }
      let numPoints = heartOptions.limit;
      let angle = (2 * Math.PI) / numPoints;
      let startingData = 100;
      for (let i = 0; i < numPoints; i++) {
        let v = new THREE.Vector3(
          startingData * Math.sin(angle * i),
          150 + startingData * Math.cos(angle * i),
          0
        );
        lineGeometry.vertices.push(v);
      }
      line = new MeshLine();
      //tapered line
      line.setGeometry(lineGeometry, function(p) {
        return 1 - p;
      });
      // line.geometry.attributes.position.needsUpdate = true;
      let lineMaterial = new MeshLineMaterial({ lineWidth: 30 });
      let LineMesh = new THREE.Mesh(line.geometry, lineMaterial);
      scene.add(LineMesh);
    }
    const animate = () => {
      this.requestId = requestAnimationFrame(animate);
      renderer.render(scene, camera);

      // cube.rotation.y += 0.05;
      // cube.rotation.x -= clock.getDelta();
      // // if (this.props.lastHr && this.props.lastHR.value > 0) {
      // //   cube.scale.x = this.props.lastHr.value;
      // // }
      // console.log("DO I HAVE PROPS", this.props);
      // this.props.lastHr && this.props.lastHr.value > 0
      //   ? (cube.scale.x = 1 + 1 * Math.sin(clock.getElapsedTime()))
      //   : (cube.scale.x = 1);
      lineGeometry.verticesNeedUpdate = true;

      let numPoints = heartOptions.limit;
      let angle = (2 * Math.PI) / numPoints;
      let startingData;
      for (let i = 0; i < numPoints; i++) {
        if (this.props.hrSamples && this.props.hrSamples.length) {
          startingData =
            this.props.hrSamples[i].value +
            50 *
              Math.sin(
                (clock.getElapsedTime() * this.props.hrSamples[i].value) / 50 -
                  this.props.hrSamples[i].value
              );
          console.log("SUCCESS");
        } else {
          startingData = 100 + 40 * Math.sin(clock.getElapsedTime());
        }
        let v = new THREE.Vector3(
          startingData * Math.sin(angle * i),
          150 + startingData * Math.cos(angle * i),
          0
        );
        lineGeometry.vertices[i] = v;
      }
      // console.log(lineGeometry.vertices);
      line.setGeometry(lineGeometry, function(p) {
        return 1 - p;
      });
      lineGeometry.verticesNeedUpdate = true;
      gl.flush();
      rngl.endFrame();
    };

    init();
    animate();
  };
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
