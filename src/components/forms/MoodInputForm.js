import React from "react";
import {
  View,
  Image,
  Text,
  Button,
  TouchableHighlight,
  TextInput,
  ScrollView,
  StyleSheet
} from "react-native";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";

export default class MoodInputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    value: 0,
    valueIndex: 0
    };
    }
  render() {
    const { handleEntry } = this.props
    const  moodInput = [
      { label: "Fantastic", value: 0 },
      { label: "Good", value: 1 },
      { label: "Ok", value: 2 },
      { label: "Not great", value: 3 },
      { label: "Awful", value: 4 }
      ]
    return (
      <View>
        <ScrollView>
          <Text style={styles.welcome}>How are you feeling today?</Text>
          <View style={styles.component}>
            <RadioForm formHorizontal={false} animation={true}>
              {moodInput.map((obj, i) => {
                let onPress = (value, index) => {
                  this.setState({
                    value: value,
                    valueIndex: index
                  });
                  handleEntry('mood', value)
                  handleEntry('moodText', obj.label)
                };
                return (
                  <RadioButton labelHorizontal={false} key={i}>
                    {/*  You can set RadioButtonLabel before RadioButtonInput */}
                    <RadioButtonInput
                      obj={obj}
                      index={i}
                      isSelected={this.state.valueIndex === i}
                      onPress={onPress}
                      buttonInnerColor={"#4DB6AC"}
                      buttonOuterColor={
                        this.state.valueIndex === i ? "#00796B" : "#000"
                      }
                      buttonSize={30}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      onPress={onPress}
                      labelStyle={{ fontWeight: "bold", color: "#00796B", marginBottom: 15}}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                );
              })}
            </RadioForm>
            <Text>
              Selected: {moodInput[this.state.valueIndex].label}
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
    backgroundColor: "#E0F2F1",
    justifyContent: "space-between",
    paddingTop: "10%",
    paddingBottom: "10%"
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
    paddingRight: 0
  },
  radioButtonWrap: {
    marginRight: 0
  }
});
