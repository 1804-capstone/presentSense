import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { WebGLView } from "react-native-webgl";
import THREE from "./meshUtilities/three.js";
import CameraHelper, { screenToWorld } from "./meshUtilities/screenToWorld";
import moment from "moment";
//mesh utilities
import { GeometrySetup, MeshAnimator } from "./meshUtilities/ringMesh";
//these actions should let us talk to healthkit
import {
  fetchLatestHeartRate,
  fetchHeartRateOverTime
} from "../store/heartrate";
import { fetchLatestSteps } from "../store/steps";
//starting options for heart rate gatherer
const { width, height } = Dimensions.get("window");
let heartOptions = {
  unit: "bpm", // optional; default 'bpm'
  startDate: new Date(2017, 4, 20).toISOString(), // required
  endDate: new Date().toISOString(), // optional; default now
  ascending: false, // optional; default false
  limit: 10 // optional; default no limit
};
let stepOptions = {
  startDate: new Date(2018, 5, 20).toISOString(), // required
  endDate: new Date().toISOString()
};

class Heartrate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rate: 0,
      touchPos: { x: 0, y: 0 },
      camera: {}
    };
    this.getHR = this.getHR.bind(this);
    this.getSteps = this.getSteps.bind(this);
    this.onContextCreate = this.onContextCreate.bind(this);
    this.interpolateArray = this.interpolateArray.bind(this);
    this.handleTouch = this.handleTouch.bind(this);
  }
  componentDidMount() {
    if (!this.props.lastHr) {
      this.props.fetchLatestHeartRate(heartOptions);
    }
    if (!this.props.hrSamples) {
      this.props.fetchHeartRateOverTime(heartOptions);
    }
    this.getHR();
    if (!this.props.stepSamples || !this.props.stepSamples.length) {
      let maxDate = moment(stepOptions.endDate);
      let minDate = moment(stepOptions.startDate);
      let diff = maxDate.diff(minDate, "days");
      stepOptions = { ...stepOptions, limit: diff };
      this.props.fetchLatestSteps(stepOptions);
    }
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

    let stepGeometry;
    let stepMesh;
    let stepMaterial;

    let cubeGeometry;
    let cubeMesh;
    let cubeMaterial;

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
      heartGeometry = GeometrySetup(heartOptions, 1, 1);
      heartMaterial.vertexColors = THREE.VertexColors;

      heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);

      scene.add(heartMesh);

      stepMaterial = new THREE.MeshPhongMaterial({
        color: 0x28b7ae,
        side: THREE.DoubleSide,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
      });
      stepGeometry = GeometrySetup(stepOptions, 1, 2);
      stepMaterial.vertexColors = THREE.VertexColors;

      stepMesh = new THREE.Mesh(stepGeometry, stepMaterial);

      scene.add(stepMesh);

      //debug cube
      cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
      cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0f0ff0 });
      cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
      scene.add(cubeMesh);
    }

    const animate = () => {
      this.requestId = requestAnimationFrame(animate);
      renderer.render(scene, camera);

      heartGeometry.verticesNeedUpdate = true;
      heartGeometry.colorsNeedUpdate = true;
      MeshAnimator(
        heartGeometry,
        heartOptions,
        this.props.hrSamples,
        clock,
        1, //scale
        1 //z index
      );
      if (this.props.stepSamples && this.props.stepSamples.length) {
        //console.log("trying to animate steps");
        stepGeometry.verticesNeedUpdate = true;
        stepGeometry.colorsNeedUpdate = true;
        //console.log("step samples", this.props.stepSamples);
        MeshAnimator(
          stepGeometry,
          stepOptions,
          this.props.stepSamples,
          clock,
          0.1, //scale
          0 //z index
        );
        stepGeometry.verticesNeedUpdate = true;
      }

      //move cube to touch position

      cubeMesh.position.set(this.state.touchPos.x, this.state.touchPos.y, 0);
      //console.log("cube pose", cubeMesh.position);
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
  getSteps() {
    stepOptions == { ...stepOptions, endDate: new Date().toISOString() };
    this.props.fetchLatestSteps(stepOptions);
  }
  handleTouch(event) {
    //let lastTouch = this.state.touchPos;
    //this.setState({ touchPos: { x: event.nativeEvent.locationX } });
    let camera = new THREE.PerspectiveCamera(
      75,
      Dimensions.get("window").width / Dimensions.get("window").height,
      1,
      1100
    );
    const { width, height } = Dimensions.get("screen");
    camera.position.y = 0;
    camera.position.z = 500;

    let Helper = new CameraHelper();
    let vProjectedMousePos = new THREE.Vector3();

    Helper.Compute(
      event.nativeEvent.locationX,
      event.nativeEvent.locationY,
      camera,
      vProjectedMousePos,
      width,
      height
    );
    console.log(
      "TOUCHING",
      event.nativeEvent.locationX,
      event.nativeEvent.locationY,
      vProjectedMousePos
    );
    this.setState({
      touchPos: { x: vProjectedMousePos.x, y: vProjectedMousePos.y }
    });
  }
  render() {
    // console.log("**? ", this.props.stepSamples);
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={event => this.handleTouch(event)}>
          <View>
            <WebGLView
              style={styles.webglView}
              onContextCreate={this.onContextCreate}
            />
            {}
            {/* <Button
          title={`HR: ${this.state.rate}`}
          raised
          style={styles.buttons}
          borderRadius={10}
          large={true}
          fontSize={40}
          backgroundColor="#4DB6AC"
          onPress={() => this.getHR()}
        /> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center"
    //justifyContent: "center",
    // paddingTop: "10%",
    // paddingBottom: "10%"
  },
  buttons: {
    // padding: '5%',
    // height: 200,
    // flex: 1
  },
  webglView: {
    width: width,
    height: height
  }
});

//getting our actions on props
const mapDispatchToProps = dispatch => {
  return {
    fetchLatestHeartRate: heartOptions =>
      dispatch(fetchLatestHeartRate(heartOptions)),
    fetchHeartRateOverTime: heartOptions =>
      dispatch(fetchHeartRateOverTime(heartOptions)),
    fetchLatestSteps: stepOptions => dispatch(fetchLatestSteps(stepOptions))
  };
};

const mapStateToProps = state => {
  return {
    lastHr: state.heartRate.lastHr,
    hrSamples: state.heartRate.hrSamples,
    stepSamples: state.steps
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Heartrate);
