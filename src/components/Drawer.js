import React from "react";
import { Button } from "react-native-elements";
import Drawer from 'react-native-draggable-view'
import iconClaw from '../images/icon_claw.png'
import { StyleSheet,
        Text,
        View,
        StatusBar,
        Image,
        Dimensions } from "react-native";

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export const DrawerHeader = props => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center',
      // height: 100, zIndex: 2
      }}>
        <Image style={styles.icon_claw} source={iconClaw} />
      </View>
      )
}

export const DrawerView = props => {
  return (
    <View style={styles.viewCont}>
      <Text style={styles.text}>Today</Text>
      <Text style={styles.text}>Week</Text>
      <Text style={styles.text}>Month</Text>
      <Text style={styles.text}>Year</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  icon_claw: {
    position: 'absolute',
    top: 9,
    bottom: 0,
    left: (Screen.width / 2) - 16,
    right: (Screen.width / 2) - 16,
    width: 32,
    height: 10,
  },
  viewCont: {
    flexDirection: 'column',
    padding: 50,
    // justifyContent: 'space-between',
    alignItems: 'center',
    // height: 150,
    height: Screen.height,
    backgroundColor: 'steelblue',
    opacity: 0.7
  },
  text: {
    color: 'white',
    fontSize: 30,
    padding: 40
  }
})
