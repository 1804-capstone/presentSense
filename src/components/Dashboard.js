import React from "react";
import { Button } from "react-native-elements";
import Drawer from 'react-native-draggable-view'
import iconClaw from '../images/icon_claw.png'
import { DrawerHeader, DrawerView } from './Drawer'
import { StyleSheet,
        Text,
        View,
        StatusBar,
        Image,
        Dimensions } from "react-native";


export default class Test extends React.Component {
  render() {
      return (
        <View>
          <View style={styles.compContainer}>
            {/* THIS IS WHERE TO PLUG IN THE GRAPH COMPONENT */}
            <View style={styles.square} />
          </View>
          {/* the following View limits how high the Drawer comes up the screen */}
          <View style={{height: 500, backgroundColor:"#4DB6AC", zIndex: 0}}>
          </View>
          <Drawer
              initialDrawerSize={.8}
              renderContainerView={() => <View style={{height:147, backgroundColor:"#4DB6AC", zIndex: 0}}><Text>this is the div border</Text></View>}
              renderDrawerView={() => <DrawerView />}
              renderInitDrawerView={() => (<View style={{
                  backgroundColor: 'black',
                  opacity: 0.6,
                  height: 30,
              }}>
                  <DrawerHeader />
              </View>)}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  compContainer: {
    position: 'relative',
    top: 250,
    zIndex: 1,
    height: 400,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  square: {
    backgroundColor: 'steelblue',
    width: 400,
    height: 450,
}
})
