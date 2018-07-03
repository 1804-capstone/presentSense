import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Carousel from "react-native-snap-carousel";
import Heartrate from "./Heartrate";
import GraphMaker from "./Graph/GraphMaker";

import { connect } from "react-redux";
import {
  fetchLatestHeartRate,
  fetchHeartRateOverTime
} from "../store/heartrate";
import { fetchSleep } from "../store/sleep";
import { fetchLatestSteps } from "../store/steps";
//query options from a store for the draggable drawer?

const abstractContent = <Heartrate />;
const graphContent = <GraphMaker />;
const contentArray = [graphContent, abstractContent];

class DataCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0
    };
    this._renderItem = this._renderItem.bind(this);
    this.waitForData = this.waitForData.bind(this);
  }

  waitForData() {
    const { heartRateSamples, stepSamples, sleepSamples } = this.props;
    if (heartRateSamples.length && stepSamples.length) {
      return true;
    } else {
      return false;
    }
  }

  _renderItem({ item, index }) {
    if (index % 2 === 1) {
      return <Heartrate />;
    } else {
      return <GraphMaker />;
    }
  }

  render() {
    const gotData = this.waitForData();
    return (
      <View style={styles.container}>
        {/* <Text>carousel?</Text> */}
        {gotData ? (
          <Carousel
            data={contentArray}
            renderItem={this._renderItem}
            itemWidth={Dimensions.get("window").width * 1}
            sliderWidth={Dimensions.get("window").width * 1}
            itemHeight={Dimensions.get("window").height * 1}
            sliderHeight={Dimensions.get("window").height * 1}
            useScrollView={false}
            inactiveSlideOpacity={0}
            inactiveSlideScale={1}
            layout={"default"}
            swipeThreshold={40}
          />
        ) : (
          this.waitForData()
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

const mapStateToProps = state => {
  return {
    heartRateSamples: state.heartRate.hrSamples,
    stepSamples: state.steps,
    sleepSamples: state.sleep
  };
};

export default connect(
  mapStateToProps,
  null
)(DataCarousel);
