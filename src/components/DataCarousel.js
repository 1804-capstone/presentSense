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
import GraphMaker from "./GraphMaker";
import Graph from "./LineGraph";

const abstractContent = <Heartrate />;
const graphContent = <GraphMaker />;
const contentArray = [abstractContent, graphContent];

export default class DataCarousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSlide: 0
    };
    this._renderItem = this._renderItem.bind(this);
  }
  _renderItem({ item, index }) {
    if (index % 2 === 0) {
      return <Heartrate />;
    } else {
      return <GraphMaker />;
    }
  }

  render() {
    const isEven = this.state.activeSlide % 2 === 0;
    // const abstractContent = <Heartrate />;
    // const graphContent = <GraphMaker />;
    // const contentArray = [abstractContent, graphContent];

    return (
      <View style={styles.container}>
        {/* <Text>carousel?</Text> */}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor: "red"
    alignItems: "center",
    justifyContent: "center"
    // paddingTop: "10%",
    // paddingBottom: "10%"
  }
});
