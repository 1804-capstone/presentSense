import React from "react";
import { Button } from "react-native-elements";
import Drawer from 'react-native-drawer'
import { DrawerView } from './Drawer'
import GraphMaker from '../Graph/GraphMaker'
import DataCarousel from '../DataCarousel'
import { connect } from 'react-redux'
import moment from 'moment'
import { fetchMoodsOverTime } from '../../store/mood'
import { fetchLatestSteps } from "../../store/steps";
import { fetchSleep } from "../../store/sleep";
import { fetchHeartRateOverTime } from "../../store/heartrate";
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

class MyData extends React.Component {
  constructor() {
    super()
    this.getMonth = () => {
      const date = new Date()
      const month = +date.getMonth()
      const newDate = date.setMonth(month - 1)
      return moment(newDate).toDate()
    }
    this.state = {
      heartrate: true,
      stepCount: true,
      sleep: true,
      mood: true,
      startDate: new Date(this.getMonth()),
      endDate: new Date()
    }
    this.toggleMetric = this.toggleMetric.bind(this)
    this.updateOptions = this.updateOptions.bind(this)
  }

  componentDidMount() {
    let startDate = this.state.startDate
    let endDate = this.state.endDate
    this.props.getMoodsOverTime(startDate, endDate)
    //for HK queries
    let queryOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
    this.props.fetchStepsOverTime(queryOptions)
    this.props.fetchSleep(queryOptions)
    this.props.fetchHeartRateOverTime(queryOptions)
  }

  toggleMetric(name, value) {
    this.setState({[name]: value})
  }

  //function to invoke in onCloseStart prop that dispatches the thunks for data
  updateOptions() {
    let startDate = this.state.startDate
    let endDate = this.state.endDate
    this.state.mood
      ? this.props.getMoodsOverTime(startDate, endDate)
      : this.props.getMoodsOverTime(endDate, endDate)
    //for HK queries
    let queryOptions = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
    let returnEmpty = {
      startDate: endDate.toISOString(),
      endDate: endDate.toISOString()
    }
    this.state.stepCount
      ? this.props.fetchStepsOverTime(queryOptions)
      : this.props.fetchStepsOverTime(returnEmpty)
    this.state.sleep
      ? this.props.fetchSleep(queryOptions)
      : this.props.fetchSleep(returnEmpty)
    this.state.heartrate
      ? this.props.fetchHeartRateOverTime(queryOptions)
      : this.props.fetchHeartRateOverTime(returnEmpty)
  }

  render() {
      return (
        <Drawer
        type="overlay"
        content={<DrawerView values={this.state} toggleMetric={this.toggleMetric}/>}
        captureGestures='closed'
        // tapToOpen={false}
        // openDrawerOffset={100}
        panCloseMask={0.9}
        // panOpenMask={0.2}
        closedDrawerOffset={0.14}
        styles={styles.drawer}
        // tweenHandler={(ratio) => ({
        //   main: { opacity:(2-ratio)/2 }
        // })}
        acceptPan={true}
        panThreshold={0.08}
        side='bottom'
        onCloseStart={() => this.updateOptions()}
        >
          <DataCarousel />
      </Drawer>
      )
    }
}

const styles = StyleSheet.create({
  drawer: {
    height: Dimensions.get("window").height,
    shadowColor: '#000000',
    shadowOpacity: 0.9,
    shadowRadius: 3
  }
})

const mapDispatch = dispatch => {
  return {
    getMoodsOverTime: (startDate, endDate) => dispatch(fetchMoodsOverTime(startDate, endDate)),
    fetchStepsOverTime: queryOptions => dispatch(fetchLatestSteps(queryOptions)),
    fetchSleep: queryOptions => dispatch(fetchSleep(queryOptions)),
    fetchHeartRateOverTime: queryOptions => dispatch(fetchHeartRateOverTime(queryOptions)),
  }
}

export default connect(null, mapDispatch)(MyData)
