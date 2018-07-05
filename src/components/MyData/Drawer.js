import React from "react";
import { Icon } from "react-native-elements";
// import Drawer from 'react-native-draggable-view'
import iconClaw from "../../images/icon_claw.png";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  Dimensions,
  DatePickerIOS
} from "react-native";
import { connect } from "react-redux";
import {
  setStartDate,
  setEndDate,
  toggleHeartRate,
  toggleStepCount,
  toggleSleep,
  toggleMood
} from "../../store/visMeta";

const Screen = {
  width: Dimensions.get("window").width,
  height: Dimensions.get("window").height
};

const DrawerView = props => {
  console.log("DrawerView Props:", props);
  return (
    <View>
      <View style={styles.iconHolder}>
        <Icon
          name='chevron-down'
          type='font-awesome'
          iconStyle={styles.icon} />
      </View>
      <View style={styles.container}>
        <View style={styles.txtCont}>
          <View style={styles.textCell}>
            <Text style={styles.text}>Heartrate</Text>
            <Switch
              style={styles.toggle}
              value={props.heartrate}
              onValueChange={value => props.toggleHeartRate(value)}
            />
          </View>
          <View style={styles.textCell}>
            <Text style={styles.text}>Step Count</Text>
            <Switch
              style={styles.toggle}
              value={props.stepCount}
              onValueChange={value => props.toggleStepCount(value)}
            />
          </View>
          <View style={styles.textCell}>
            <Text style={styles.text}>Sleep Cycles</Text>
            <Switch
              style={styles.toggle}
              value={props.sleep}
              onValueChange={value => props.toggleSleep(value)}
            />
          </View>
          <View style={styles.textCell}>
            <Text style={styles.text}>Mood</Text>
            <Switch
              style={styles.toggle}
              value={props.mood}
              onValueChange={value => props.toggleMood(value)}
            />
          </View>
        </View>
        <View style={styles.dateCont}>
          <Text style={styles.text}>Start Date: </Text>
          <DatePickerIOS
            style={styles.date}
            date={props.startDate}
            onDateChange={value => props.setStartDate(value)}
            maximumDate={new Date()}
            minuteInterval={10}
          />
        </View>
        <View style={styles.dateCont}>
          <Text style={styles.text}>End Date: </Text>
          <DatePickerIOS
            style={styles.date}
            date={props.endDate}
            onDateChange={value => props.setEndDate(value)}
            maximumDate={new Date()}
            minuteInterval={10}
          />
        </View>
      </View>
    </View>
  );
};

const mapState = state => {
  return {
    startDate: state.visMeta.startDate,
    endDate: state.visMeta.endDate,
    heartrate: state.visMeta.heartrate,
    stepCount: state.visMeta.stepCount,
    sleep: state.visMeta.sleep,
    mood: state.visMeta.mood
  };
};

const mapDispatch = dispatch => {
  return {
    setStartDate: startDate => dispatch(setStartDate(startDate)),
    setEndDate: endDate => dispatch(setEndDate(endDate)),
    toggleHeartRate: value => dispatch(toggleHeartRate(value)),
    toggleMood: value => dispatch(toggleHeartRate(value)),
    toggleSleep: value => dispatch(toggleSleep(value)),
    toggleStepCount: value => dispatch(toggleStepCount(value))
  };
};

export default connect(
  mapState,
  mapDispatch
)(DrawerView);

const styles = StyleSheet.create({
  iconHolder: {
    backgroundColor: "#00695C",
    height: 50,
    flexDirection: "row",
    justifyContent: "center"
  },
  icon: {
    color: 'white'
  },
  container: {
    display: "flex",
    padding: 5,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(178, 223, 219, 1)"
  },
  txtCont: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    borderBottomWidth: 1,
    borderBottomColor: "grey",
    justifyContent: "space-between"
  },
  textCell: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
    width: "50%",
    alignItems: "center",
    padding: 5
  },
  toggle: {
    justifyContent: "flex-end",
    marginRight: 15
  },
  dateCont: {
    padding: 10,
    height: 230
  },
  text: {
    fontSize: 18,
    justifyContent: "flex-start"
  },
  date: {
    width: "90%",
    height: 50,
    alignSelf: "center"
  }
});
