import React from "react";
import { Button } from "react-native-elements";
// import Drawer from 'react-native-draggable-view'
import iconClaw from '../../images/icon_claw.png'
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


export const DrawerView = props => {
    const { heartrate, stepCount, sleep, mood, startDate, endDate } = props.values
    const { toggleMetric } = props
  return (
    <View>
      <View style={styles.iconHolder}>
        <Image style={styles.icon_claw} source={iconClaw} />
      </View>
    <View style={styles.container}>
      <View style={styles.txtCont}>
        <View style={styles.textCell}>
          <Text style={styles.text}>Heartrate</Text>
          <Switch style={styles.toggle}
            value={heartrate}
            onValueChange={(value) => toggleMetric('heartrate', value)}
          />
        </View>
        <View style={styles.textCell}>
          <Text style={styles.text}>Step Count</Text>
          <Switch style={styles.toggle}
          value={stepCount}
          onValueChange={(value) => toggleMetric('stepCount', value)}
          />
        </View>
        <View style={styles.textCell}>
          <Text style={styles.text}>Sleep Cycles</Text>
          <Switch style={styles.toggle}
          value={sleep}
          onValueChange={(value) => toggleMetric('sleep', value)}
          />
        </View>
        <View style={styles.textCell}>
          <Text style={styles.text}>Mood</Text>
          <Switch style={styles.toggle}
          value={mood}
          onValueChange={(value) => toggleMetric('mood', value)}
          />
        </View>
      </View>
      <View style={styles.dateCont}>
        <Text style={styles.text}>Start Date: </Text>
          <DatePickerIOS
            style={styles.date}
            date={startDate}
            onDateChange={(value) => toggleMetric('startDate', value)}
            maximumDate={new Date()}
            minuteInterval={10}
          />
      </View>
      <View style={styles.dateCont}>
        <Text style={styles.text}>End Date: </Text>
          <DatePickerIOS
            style={styles.date}
            date={endDate}
            onDateChange={(value) => toggleMetric('endDate', value)}
            maximumDate={new Date()}
            minuteInterval={10}
          />
      </View>
    </View>
    </View>
  )
}


const styles = StyleSheet.create({
  icon_claw: {
    position: 'absolute',
    top: 20,
    bottom: 0,
    // left: (Screen.width / 2) - 16,
    // right: (Screen.width / 2) - 16,
    width: 50,
    // height: 10,
  },
  iconHolder: {
    backgroundColor: '#00695C',
    height: 85,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    padding: 5,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(178, 223, 219, 1)',
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
    padding: 5
  },
  toggle: {
    justifyContent: 'flex-end',
    marginRight: 15
  },
  dateCont: {
    padding: 10,
    height: 200,
  },
  text: {
    fontSize: 18,
    justifyContent: 'flex-start'
  },
  date: {
    width: '90%',
    height: 50,
    alignSelf: 'center'
  }
})
