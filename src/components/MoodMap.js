import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { connect } from 'react-redux'
import { fetchMoodsNearby } from '../store/moodsNearby'

class MoodMap extends Component {
  constructor() {
    super()
    this.state = {
      latitude: 40.730610,
      longitude: -74.001668,
    }
  }
  componentDidMount() {
    navigator.geolocation.setRNConfiguration({setRNConfiguration: true})
    navigator.geolocation.requestAuthorization()

    //the following sets us to SF on the simulator phone, so I am
    //commenting it out and using NY coords

    // navigator.geolocation.getCurrentPosition(location => {
    //   this.setState({
    //     latitude: location.coords.latitude,
    //     longitude: location.coords.longitude
    //   })
    // })
    this.props.fetchMoods(this.state.latitude, this.state.longitude)
  }
  render() {
    console.log("MOOD IN MAP", this.props.moodsNearby)
	let points = [
		{latitude:40.710089, longitude:-74.001668, weight: 1},
		{latitude:40.716953, longitude:-74.007504, weight: 90},
		{latitude:40.720637, longitude:-74.008480, weight: 70},
		{latitude:40.720913, longitude:-74.004800, weight: 50},
		{latitude:40.725610, longitude:-74.005242, weight: 88},
		{latitude:40.630610, longitude:-69.535242, weight: 98},
		{latitude:41.730610, longitude:-63.935242, weight: 41},
		{latitude:40.730610, longitude:-73.935242, weight: 66},
		{latitude:41.730610, longitude:-73.935242, weight: 9},
		{latitude:39.730610, longitude:-73.835242, weight: 11},
		{latitude:40.730610, longitude:-73.735242, weight: 33},
		{latitude:44.730110, longitude:-73.635242, weight: 76},
		{latitude:39.732610, longitude:-73.535242, weight: 63},
		{latitude:40.710610, longitude:-71.935242, weight: 99},
		{latitude:40.732610, longitude:-72.935242, weight: 1},
		{latitude:40.733610, longitude:-73.935282, weight: 46},
		{latitude:40.730410, longitude:-73.535242, weight: 22},
		{latitude:40.730650, longitude:-74.935242, weight: 1},
		{latitude:40.730616, longitude:-70.915242, weight: 33},
		{latitude:40.730710, longitude:-73.933242, weight: 1},
		{latitude:40.830610, longitude:-73.934242, weight: 100}
	];
    return (
      <View style ={styles.container}>
        <Text style={styles.txt}>The Mood Near You</Text>
        <MapView
	        provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude: this.state.latitude,
            longitude: this.state.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}>
          <MapView.Heatmap
            points={this.props.moodsNearby}
            opacity={1}
            radius={50}
            onZoomRadiusChange={{
              zoom: [0, 3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17],
              radius: [10, 10, 15, 20, 30, 60, 80, 100, 120, 150, 180, 200, 250, 250]}}
            gradient={{
              colors: ["#79BC6A", "#BBCF4C", "#EEC20B", "#F29305", "#E50000"],
              values: [0, 0.25, 0.50, 0.75, 1]
              }}
            maxIntensity={100}
            gradientSmoothing={5}
            heatmapMode={"POINTS_WEIGHT"}/>
        </MapView>
        <View style={styles.keyContainer}>
          <View style={styles.key}>
            <View style={{
              backgroundColor: "#79BC6A",
              borderRadius: 25,
              height: 25,
              width: 25}} />
            <Text style={styles.keyTxt}>Fantastic</Text>
          </View>
          <View style={styles.key}>
            <View style={{
                backgroundColor: "#BBCF4C",
                borderRadius: 25,
                height: 25,
                width: 25}} />
            <Text style={styles.keyTxt}>Good</Text>
          </View>
          <View style={styles.key}>
            <View style={{
              backgroundColor: "#EEC20B",
              borderRadius: 25,
              height: 25,
              width: 25}} />
            <Text style={styles.keyTxt}>Okay</Text>
          </View>
          <View style={styles.key}>
            <View style={{
                backgroundColor: "#F29305",
                borderRadius: 25,
                height: 25,
                width: 25}} />
            <Text style={styles.keyTxt}>Not Great</Text>
          </View>
          <View style={styles.key}>
            <View style={{
              backgroundColor: "#E50000",
              borderRadius: 25,
              height: 25,
              width: 25}} />
            <Text style={styles.keyTxt}>Awful</Text>
          </View>
        </View>
      </View>
    );
  }
}

const mapState = state => {
  return {
    moodsNearby: state.moodsNearby
  }
}

const mapDispatch = dispatch => {
  return {
    fetchMoods: (lat, long) => dispatch(fetchMoodsNearby(lat, long))
  }
}

export default connect(mapState, mapDispatch)(MoodMap)

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    backgroundColor: "#E0F2F1"
  },
  map: {
    height: 400,
    width: '92%',
    marginTop: 20,
    borderWidth: 3,
    borderRadius: 10,
    borderColor: '#00695C'
  },
  txt: {
    fontSize: 35,
    padding: 20
  },
  keyContainer: {
    width: '92%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 15,
    justifyContent: 'space-around'
  },
  key: {
    paddingRight: 7,
    paddingLeft: 7,
    // margin: 5,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',

  },
  keyTxt: {
    fontSize: 18,
  }
});


// function MapHeatmap() {
//   var _ref;
//   var _temp, _this, _ret;

//   _classCallCheck(this, MapHeatmap);
//   for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
//     args[_key] = arguments[_key];
//   }
//   return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = MapHeatmap.__proto__ || Object.getPrototypeOf(MapHeatmap)).call.apply(_ref, [this].concat(args))), _this), _this.getSanitizedPoints = function () {                return _this.props.points.map(function (point) {
//     return _extends({
//       weight: 0
//     }, point);
//   });
// }, _temp), _possibleConstructorReturn(_this, _ret);
// }

