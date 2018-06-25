import React from "react";
import { StyleSheet, Text, View, Image, Animated } from "react-native";
import pic from '../images/presentSenseBlue.svg'
import pic2 from '../images/presentSenseBlue.png'


class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(.2),
    scaleAnim: new Animated.Value(1)
  }

  componentDidMount() {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(this.state.scaleAnim, {
            toValue: 1.3,
            duration: 9000
          }),
          Animated.timing(this.state.scaleAnim, {
            toValue: 1,
            duration: 9000
          })
        ]),
      Animated.sequence([
        Animated.timing(this.state.fadeAnim, {
          toValue: .9,
          duration: 5000,
        }
      ), Animated.timing(this.state.fadeAnim, {
          toValue: .2,
          duration: 5000
    })])
      ])).start()
  }

  render() {
    let { fadeAnim, scaleAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
          transform: [{scale: scaleAnim}]
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

export default class Test extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.full}>
      <View style={styles.imgTitleCont}>
      <FadeInView style={{width: '90%', height: 400}}>
          {/* <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text> */}
        {/* </FadeInView> */}
      {/* <FadeInView style={styles.img}> */}
        <Image source={pic2} style={styles.img}/>
      </FadeInView>
        <Text style={styles.title}>PresentSense</Text>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  full: {
    backgroundColor: "#E0F2F1",
    width: '100%',
    height: '100%'
  },
  imgTitleCont: {
    width: '100%',
    height: 205,
    display: 'flex',
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center'
  },
  img: {
    width: '100%',
    height: 400,
    // opacity: 0.7,
    // borderWidth: 2,
    alignItems: 'center'
  },
  title: {
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: -4, height: 4},
    textShadowRadius: 7,
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    width: '90%',
    height: 150,
    paddingTop: 90,
    // borderWidth: 2,
    position: 'absolute',
    textAlign: 'center'
  }
})
