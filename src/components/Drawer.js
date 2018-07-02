import React from "react";
import { Button } from "react-native-elements";
// import Drawer from 'react-native-draggable-view'
import iconClaw from '../images/icon_claw.png'
import { StyleSheet,
        Text,
        View,
        Switch,
        Image,
        Dimensions,
        DatePickerIOS } from "react-native";

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export const DrawerHeader = props => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center',
      }}>
        <Image style={styles.icon_claw} source={iconClaw} />
      </View>
      )
}

export const DrawerView = props => {
  return (
    <View style={styles.container}>
      <View style={styles.txtCont}>
        <View style={styles.textCell}>
          <Text style={styles.text}>Heartrate</Text>
          <Switch style={styles.toggle}
            // value={this.state.heartRate}
            // onValueChange={value => this.setState({ heartRate: value })}
          />
        </View>
        <View style={styles.textCell}>
          <Text style={styles.text}>Step Count</Text>
          <Switch style={styles.toggle}
          // value={this.state.heartRate}
          // onValueChange={value => this.setState({ heartRate: value })}
          />
        </View>
        <View style={styles.textCell}>
          <Text style={styles.text}>Sleep Cycles</Text>
          <Switch style={styles.toggle}
          // value={this.state.heartRate}
          // onValueChange={value => this.setState({ heartRate: value })}
          />
        </View>
        <View style={styles.textCell}>
          <Text style={styles.text}>Mood</Text>
          <Switch style={styles.toggle}
          // value={this.state.heartRate}
          // onValueChange={value => this.setState({ heartRate: value })}
          />
        </View>
      </View>
      <View style={styles.dateCont}>
        <Text style={styles.text}>Start Date: </Text>
          <DatePickerIOS
            style={styles.date}
            // date={this.state.chosenDate}
            date={new Date()}
            // onDateChange={this.setDate}
            maximumDate={new Date()}
            minuteInterval={10}
          />
      </View>
      <View style={styles.dateCont}>
        <Text style={styles.text}>End Date: </Text>
          <DatePickerIOS
            style={styles.date}
            // date={this.state.chosenDate}
            date={new Date()}
            // onDateChange={this.setDate}
            maximumDate={new Date()}
            minuteInterval={10}
          />
      </View>
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
  container: {
    display: 'flex',
    padding: 5,
    height: Screen.height,
    width: '100%',
    backgroundColor: 'rgba(178, 223, 219, 0.8)',
  },
  txtCont: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    justifyContent: 'space-between'
  },
  textCell: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    width: '50%',
    alignItems: 'center',
    padding: 10
  },
  toggle: {
    justifyContent: 'flex-end',
    marginRight: 15
  },
  dateCont: {
    padding: 10,
    height: 250,
  },
  text: {
    fontSize: 20,
    justifyContent: 'flex-start'
  },
  date: {
    width: '90%',
    height: 50,
    alignSelf: 'center'
  }
})
