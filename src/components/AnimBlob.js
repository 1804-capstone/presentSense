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
          toValue: .8,
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

export default class AnimBlob extends React.Component {
  constructor() {
    super()
    this.state = {
    }
  }

  render() {
    return (
      <View>
      <View style={styles.imgTitleCont}>
      <FadeInView style={{width: '90%', height: 400}}>
        <Image source={pic2} style={styles.img}/>
      </FadeInView>
        <Text style={styles.title}>PresentSense</Text>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
  imgTitleCont: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    flex: 0,
    justifyContent: 'center'
  },
  img: {
    width: '100%',
    height: '100%',
    marginTop: '10%',
    alignItems: 'center'
  },
  title: {
    textShadowColor: 'rgba(0, 0, 0, .8)',
    textShadowOffset: {width: -4, height: 6},
    textShadowRadius: 14,
    fontSize: 50,
    color: 'white',
    fontWeight: 'bold',
    width: '90%',
    height: '95%',
    position: 'absolute',
    textAlign: 'center'
  }
})
