import React from "react";
import { Button } from "react-native-elements";
import Drawer from 'react-native-drawer'
// import iconClaw from '../images/icon_claw.png'
import { DrawerView } from './Drawer'
import GraphMaker from '../Graph/GraphMaker'
import { connect } from 'react-redux'
import moment from 'moment'
import { fetchMoodsOverTime } from '../../store/mood'
import { fetchLatestSteps } from "../../store/steps";
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
    console.log('HI?')
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
    console.log("S", this.state.startDate)
    console.log("E", this.state.endDate)
    this.toggleMetric = this.toggleMetric.bind(this)
    this.updateOptions = this.updateOptions.bind(this)
  }

  componentDidMount() {
    let startDate = this.state.startDate
    let endDate = this.state.endDate
    this.props.fetchStepsOverTime({startDate, endDate})
  }

  toggleMetric(name, value) {
    this.setState({[name]: value})
  }

  //function to invoke in onCloseStart prop that dispatches the thunks for data
  updateOptions() {
    let startDate = this.state.startDate
    let endDate = this.state.endDate
    this.props.getMoodsOverTime(startDate, endDate)
    this.props.fetchStepsOverTime({startDate, endDate})
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
          <GraphMaker />
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
    fetchStepsOverTime: queryOptions => dispatch(fetchLatestSteps(queryOptions))
  }
}

export default connect(null, mapDispatch)(MyData)
