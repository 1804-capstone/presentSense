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

export default class AccomplishForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ""
    };
  }

  render() {
    const { handleEntry } = this.props
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcome}>
          What's one thing you accomplished today?{" "}
        </Text>
        <TextInput
          placeholder="Today I accomplished..."
          style={styles.input}
          multiline
          numberOfLines={10}
          value={this.state.content}
          onChangeText={content => {
            this.setState({ content })
            handleEntry('accomplishment', content)
          }} />
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
    padding: 15
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10
  },
  input: {
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    width: '90%',
    fontSize: 18,
    padding: 5
  }
});
