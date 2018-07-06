import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import Carousel from "react-native-snap-carousel";
import { connect } from "react-redux";
import { WebGLView } from "react-native-webgl";
import THREE from "./meshUtilities/three.js";
import CameraHelper, { screenToWorld } from "./meshUtilities/screenToWorld";
import moment from "moment";
//mesh utilities
import {
  GeometrySetup,
  MeshAnimator,
  HeartMeshAnimator,
  MoodMeshAnimator
} from "./meshUtilities/ringMesh";
//these actions should let us talk to healthkit
// import {
//   fetchLatestHeartRate,
//   fetchHeartRateOverTime
// } from "../store/heartrate";
// import { fetchLatestSteps } from "../store/steps";
//starting options for heart rate gatherer
const { width, height } = Dimensions.get("window");
// let heartOptions = {
//   unit: "bpm", // optional; default 'bpm'
//   startDate: new Date(2017, 4, 20).toISOString(), // required
//   endDate: new Date().toISOString(), // optional; default now
//   ascending: false, // optional; default false
//   limit: 10 // optional; default no limit
// };
// let stepOptions = {
//   startDate: new Date(2018, 5, 20).toISOString(), // required
//   endDate: new Date().toISOString()
// };

class Heartrate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      touchPos: { x: 0, y: 0 },
      prevTouch: { x: 0, y: 0 },
      camera: {},
      hrSamples: [],
      stepSamples: [],
      sleepSamples: [],
      key: 0
    };
    // this.getHR = this.getHR.bind(this);
    // this.getSteps = this.getSteps.bind(this);
    this.onContextCreate = this.onContextCreate.bind(this);
    this.interpolateArray = this.interpolateArray.bind(this);
    this.handleTouch = this.handleTouch.bind(this);
  }

  componentDidMount() {}
  static getDerivedStateFromProps(props, state) {
    if (
      props.hrSamples !== state.hrSamples ||
      props.sleepSamples.length !== state.sleepSamples.length
    ) {
      console.log("COMPONENT SHOULD UPDATE");
      const convertSleep = data => {
        data = data.map(datum => {
          const start = moment(new Date(datum.startDate.slice(0, -5)));
          const end = moment(new Date(datum.endDate.slice(0, -5)));
          let diff = end.diff(start, "hours", true);
          console.log("whats the difference", diff, start, end);
          const newDatum = {
            value: diff,
            startDate: datum.startDate,
            endDate: datum.endDate
          };
          return newDatum;
        });
        //this.setState({ sleepSamples: data });
        return data;
      };

      let convertedSleep = convertSleep(props.sleepSamples);
      return {
        hrSamples: props.hrSamples,
        sleepSamples: convertedSleep
      };
    }
    console.log("null????????");
    return null;
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

    let moodGeometry;
    let moodMesh;
    let moodMaterial;

    let sleepGeometry;
    let sleepMesh;
    let sleepMaterial;

    let cubeGeometry;
    let cubeMesh;
    let cubeMaterial;
    let heartSampleLength = this.props.hrSamples.length;
    let stepSampleLength = this.props.stepSamples.length;
    let sleepSamples = this.props.sleepSamples;
    let sleepSampleLength = this.props.sleepSamples.length;
    let moodSamples = this.props.moodSamples;
    let moodSampleLength = this.props.moodSamples.length;

    // let raycaster;
    // let direction;
    let originalColors = {};
    let lastSelected;

    function init() {
      camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
      camera.position.y = 0;
      camera.position.z = 500;
      scene = new THREE.Scene();
      // let raycaster = new THREE.Raycaster();

      let light = new THREE.AmbientLight(0x404040, 3.7); // soft white light
      scene.add(light);

      heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
      });
      //re set up heart options:
      heartGeometry = GeometrySetup({ limit: heartSampleLength }, 1, 0.5);
      heartMaterial.vertexColors = THREE.VertexColors;

      heartMesh = new THREE.Mesh(heartGeometry, heartMaterial);

      scene.add(heartMesh);
      ///-----------------------------------------------------

      sleepMaterial = new THREE.MeshPhongMaterial({
        color: 0x0043af,
        side: THREE.DoubleSide,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
      });
      sleepGeometry = GeometrySetup(
        { limit: Math.max(3, sleepSampleLength) },
        11,
        1
      );
      sleepMaterial.vertexColors = THREE.VertexColors;
      sleepMesh = new THREE.Mesh(sleepGeometry, sleepMaterial);
      scene.add(sleepMesh);

      //--------------------------------------------------------
      stepMaterial = new THREE.MeshPhongMaterial({
        color: 0x28b7ae,
        side: THREE.DoubleSide,
        flatShading: true,
        vertexColors: THREE.VertexColors,
        shininess: 0
      });
      stepGeometry = GeometrySetup({ limit: stepSampleLength }, 1, 2);
      stepMaterial.vertexColors = THREE.VertexColors;

      stepMesh = new THREE.Mesh(stepGeometry, stepMaterial);

      scene.add(stepMesh);
      //--------------------------------------------------
      if (moodSamples && moodSampleLength > 3) {
        moodMaterial = new THREE.MeshPhongMaterial({
          color: 0x82f2ad,
          side: THREE.DoubleSide,
          flatShading: true,
          vertexColors: THREE.VertexColors,
          shininess: 0
        });
        moodGeometry = GeometrySetup({ limit: moodSampleLength }, 3, 3);
        moodMaterial.vertexColors = THREE.VertexColors;
        moodMesh = new THREE.Mesh(moodGeometry, moodMaterial);
        scene.add(moodMesh);
      }

      //-------------------------------------------------------
      //debug cube
      cubeGeometry = new THREE.BoxGeometry(20, 20, 20);
      cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x0f0ff0 });
      cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
      scene.add(cubeMesh);

      for (let i = 0; i < scene.children.length; i++) {
        if (scene.children[i].type === "Mesh") {
          //console.log("material???", scene.children[i].material);
          originalColors[scene.children[i].id] = {
            r: scene.children[i].material.color.r,
            g: scene.children[i].material.color.g,
            b: scene.children[i].material.color.b
          };
        }
      }
      console.log("ORIGINAL COLORS!", originalColors);
    }

    const animate = () => {
      this.requestId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      heartGeometry.colorsNeedUpdate = true;
      stepGeometry.colorsNeedUpdate = true;
      moodGeometry.colorsNeedUpdate = true;
      sleepGeometry.colorsNeedUpdate = true;
      //console.log("KEEPCOLORS", originalColors);
      cubeMesh.position.set(this.state.touchPos.x, this.state.touchPos.y, 0);
      let raycaster = new THREE.Raycaster();
      raycaster.set(
        new THREE.Vector3(
          this.state.touchPos.x,
          this.state.touchPos.y,
          cubeMesh.position.z + 10
        ),
        new THREE.Vector3(0, 0, -1)
      );
      //filter scene children?
      let myMeshes = scene.children.filter(child => {
        if (originalColors.hasOwnProperty(child.id)) {
          return child;
        }
      });
      let gotSelected;
      if (lastSelected && lastSelected.id) {
        gotSelected = lastSelected;
      }
      for (let i = 0; i < myMeshes.length; i++) {
        if (
          gotSelected &&
          gotSelected.id &&
          gotSelected.id !== myMeshes[i].id
        ) {
          myMeshes[i].material.color.setRGB(
            originalColors[myMeshes[i].id].r,
            originalColors[myMeshes[i].id].g,
            originalColors[myMeshes[i].id].b
          );
        } else if (!gotSelected || !gotSelected.id) {
          myMeshes[i].material.color.setRGB(
            originalColors[myMeshes[i].id].r,
            originalColors[myMeshes[i].id].g,
            originalColors[myMeshes[i].id].b
          );
        }
      }

      //set the last intersected object to our "selected color"
      // let intersects = raycaster.intersectObjects(myMeshes);
      // if (
      //   intersects[intersects.length - 1] &&
      //   this.state.touchPos !== this.state.prevTouch
      // ) {
      //   intersects[intersects.length - 1].object.material.color.setRGB(
      //     0.952,
      //     0.627,
      //     0.776
      //   );
      // }
      let intersects = raycaster.intersectObjects(myMeshes);
      if (intersects[intersects.length - 1]) {
        lastSelected = intersects[intersects.length - 1];
        lastSelected.object.material.color.setRGB(0.952, 0.627, 0.776);
      }

      //------------------------------------------------------
      if (this.props.hrSamples && this.props.hrSamples.length) {
        heartGeometry.verticesNeedUpdate = true;
        heartGeometry.colorsNeedUpdate = true;
        HeartMeshAnimator(
          heartGeometry,
          { limit: heartSampleLength },
          this.props.hrSamples,
          clock,
          1, //scale
          1 //z index
        );
      }
      //----------------------------------------------
      if (this.props.stepSamples && this.props.stepSamples.length) {
        stepGeometry.verticesNeedUpdate = true;
        stepGeometry.colorsNeedUpdate = true;
        MeshAnimator(
          stepGeometry,
          { limit: stepSampleLength },
          this.props.stepSamples,
          clock,
          0.01, //scale
          0 //z index
        );
        stepGeometry.verticesNeedUpdate = true;
      }
      //--------------------------------------------
      // if (sleepSamples && sleepSampleLength > 0) {
      //   //console.log("Sleeps!", this.state.sleepSamples);
      sleepGeometry.verticesNeedUpdate = true;
      sleepGeometry.colorsNeedUpdate = true;
      MoodMeshAnimator(
        sleepGeometry,
        { limit: sleepSampleLength },
        this.state.sleepSamples,
        clock,
        10, //scale
        3 //z index
      );
      sleepGeometry.verticesNeedUpdate = true;
      // }
      // //--------------------------------------------------
      if (moodSamples && moodSampleLength > 3) {
        moodGeometry.verticesNeedUpdate = true;
        moodGeometry.colorsNeedUpdate = true;
        MoodMeshAnimator(
          moodGeometry,
          { limit: moodSampleLength },
          this.props.moodSamples,
          clock,
          40, //scale
          -2 //z index
        );
        moodGeometry.verticesNeedUpdate = true;
      }
      //----------------------------------------------
      //move cube to touch position

      // for (let i = 0; i < intersects.length; i++) {
      //   intersects[i].object.material.color.set(0xfff200);
      // }
      // for (let i = 0; i < scene.children.length; i++) {
      //   if (scene.children[i].type === "Mesh") {
      //     console.log("material???", scene.children[i].material);
      //   }
      // }
      // if (intersects[intersects.length - 1]) {
      //   intersects[intersects.length - 1].object.material.color.set(0xfff200);
      // }
      // for (let i = 0; i < intersects.length - 1; i++) {
      //   intersects[i].object.material.color.setRGB(
      //     originalColors[i].r,
      //     originalColors[i].g,
      //     originalColors[i].b
      //   );
      // }

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

  handleTouch(event) {
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

    this.setState({
      touchPos: { x: vProjectedMousePos.x, y: vProjectedMousePos.y }
    });
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={event => this.handleTouch(event)}>
          <View key={this.props.stepSamples.length}>
            <WebGLView
              style={styles.webglView}
              onContextCreate={this.onContextCreate}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    backgroundColor: "#fff",
    alignItems: "center"
  },
  webglView: {
    width: width,
    height: height
  }
});

//getting our actions on props
// const mapDispatchToProps = dispatch => {
//   return {
//     fetchLatestHeartRate: heartOptions =>
//       dispatch(fetchLatestHeartRate(heartOptions)),
//     fetchHeartRateOverTime: heartOptions =>
//       dispatch(fetchHeartRateOverTime(heartOptions)),
//     fetchLatestSteps: stepOptions => dispatch(fetchLatestSteps(stepOptions))
//   };
// };

const mapStateToProps = state => {
  return {
    hrSamples: state.heartRate.hrSamples,
    stepSamples: state.steps,
    sleepSamples: state.sleep,
    moodSamples: state.mood
  };
};

export default connect(
  mapStateToProps,
  null
)(Heartrate);
