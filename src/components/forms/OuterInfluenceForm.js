import React from "react";
import {
  View,
  Image,
  Text,
  Button,
  TouchableHighlight,
  TextInput,
  ScrollView
} from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";

export default class OuterInfluenceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outerInfluences: [
        { label: "interpersonal relationships", value: 0 },
        { label: "family conflicts/resolutions", value: 1 },
        { label: "work struggles and opportunities", value: 2 },
        { label: "healthy living", value: 3 },
        { label: "personal goals", value: 4 },
        { label: "romantic partners", value: 5 }
      ],
      value: 0,
      valueIndex: 0
    };
  }
  render() {
    return (
      <View>
        <ScrollView>
          <Text style={styles.welcome}>
            Which of these affected your mood, good or bad, the most today?
          </Text>
          <View style={styles.component}>
            <RadioForm formHorizontal={true} animation={true}>
              {this.state.data.map((obj, i) => {
                let onPress = (value, index) => {
                  this.setState({
                    value: value,
                    valueIndex: index
                  });
                };
                return (
                  <RadioButton labelHorizontal={true} key={i}>
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={this.state.valueIndex === i}
                      onPress={onPress}
                      buttonInnerColor={"#f39c12"}
                      buttonOuterColor={
                        this.state.valueIndex === i ? "#2196f3" : "#000"
                      }
                      buttonSize={30}
                      buttonStyle={{}}
                      buttonWrapStyle={{ marginLeft: 10 }}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      onPress={onPress}
                      labelStyle={{ fontWeight: "bold", color: "#2ecc71" }}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                );
              })}
            </RadioForm>
            <Text>
              selected: {this.state.data[this.state.valueIndex].label}
            </Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  component: {
    alignItems: "center",
    marginBottom: 50
  },
  radioStyle: {
    borderRightWidth: 1,
    borderColor: "#2196f3",
    paddingRight: 10
  },
  radioButtonWrap: {
    marginRight: 5
  }
});
