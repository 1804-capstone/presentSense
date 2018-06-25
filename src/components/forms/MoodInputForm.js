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
      moodInput: [
        { label: "fantastic", value: 0 },
        { label: "good", value: 1 },
        { label: "ok", value: 2 },
        { label: "not great", value: 3 },
        { label: "awful", value: 4 }
      ],
      value: 0,
      valueIndex: 0
    };
  }
  render() {
    return (
      <View>
        <ScrollView>
          <Text style={styles.welcome}>How are you feeling today?</Text>
          <View style={styles.component}>
            <RadioForm formHorizontal={false} animation={true}>
              {this.state.moodInput.map((obj, i) => {
                let onPress = (value, index) => {
                  this.setState({
                    value: value,
                    valueIndex: index
                  });
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
                      buttonStyle={{}}
                      buttonWrapStyle={{ marginLeft: 10 }}
                    />
                    <RadioButtonLabel
                      obj={obj}
                      index={i}
                      onPress={onPress}
                      labelStyle={{ fontWeight: "bold", color: "#00796B" }}
                      labelWrapStyle={{}}
                    />
                  </RadioButton>
                );
              })}
            </RadioForm>
            <Text>
              selected: {this.state.moodInput[this.state.valueIndex].label}
            </Text>
          </View>
          <View>
            <Button
              title="Next"
              onPress={() =>
                this.props.navigation.navigate("OuterInfluenceForm")
              }
            />
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
    paddingRight: 10
  },
  radioButtonWrap: {
    marginRight: 5
  }
});
