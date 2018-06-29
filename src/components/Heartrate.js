import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { WebGLView } from "react-native-webgl";
import THREE from "./three";
//mesh utilities
import { GeometrySetup, MeshAnimator } from "./meshUtilities/ringMesh";
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
const { width, height } = Dimensions.get("window");

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

    let heartGeometry;
    let heartMesh;
    let heartMaterial;

    function init() {
      camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
      camera.position.y = 0;
      camera.position.z = 500;
      scene = new THREE.Scene();

      let light = new THREE.AmbientLight(0x404040, 3.7); // soft white light
      scene.add(light);

      heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
      });
      heartGeometry = GeometrySetup(heartOptions);
      heartMaterial.vertexColors = THREE.VertexColors;

      heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);

      scene.add(heartMesh);
    }

    const animate = () => {
      this.requestId = requestAnimationFrame(animate);
      renderer.render(scene, camera);

      heartGeometry.verticesNeedUpdate = true;
      heartGeometry.colorsNeedUpdate = true;

      MeshAnimator(heartGeometry, heartOptions, this.props.hrSamples, clock, 2);

      heartGeometry.verticesNeedUpdate = true;
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
    width: width,
    height: width
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
