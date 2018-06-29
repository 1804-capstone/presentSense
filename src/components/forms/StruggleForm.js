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

export default class StruggleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      struggleContent: "",
      adviceContent: ""
    };
  }

  render() {
    const { handleEntry } = this.props
    return (
      <ScrollView>
        <Text style={styles.welcome}>
          What's something you're currently struggling with?{" "}
        </Text>
        <TextInput
          placeholder="I'm struggling with..."
          style={{ height: 60, borderColor: "gray", borderWidth: 1 }}
          multiline
          numberOfLines={10}
          value={this.state.struggleContent}
          onChangeText={content => {
            this.setState({ struggleContent: content })
            handleEntry('struggle', content)
          }}
        />
        <Text style={styles.welcome}>
          If your best friend was struggling with the same issue, what advice
          would you give?{" "}
        </Text>
        <TextInput
          placeholder="I would tell my friend that..."
          style={{ height: 60, borderColor: "gray", borderWidth: 1 }}
          multiline
          numberOfLines={10}
          value={this.state.adviceContent}
          onChangeText={content => {
            this.setState({ adviceContent: content })
            handleEntry('advice', content)
          }}
        />
      </ScrollView>
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
  }
});
