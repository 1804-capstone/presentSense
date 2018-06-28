import React from "react";
import { StyleSheet, Text, View, TextInput, Switch } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { updateUserPrefs } from "../store/firebase";

class Preferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.preferences.name,
      heartRate: this.props.preferences.heartRate,
      steps: this.props.preferences.steps,
      sleep: this.props.preferences.sleep,
      mood: this.props.preferences.mood,
      share: this.props.preferences.share,
      location: this.props.preferences.location
      //accessibility?
    };
    this.handleSave = this.handleSave.bind(this);
  }

  handleSave() {
    const { navigate } = this.props.navigation;
    this.props.updateUserPrefs(this.props.userDocId, this.state, navigate);
  }

  render() {
    console.log("USERDOCID???", this.props.userDocId);
    const { navigate } = this.props.navigation;
    console.log("CAN WE NAV?", navigate);
    return (
      <View style={styles.container}>
        <Text>Name: </Text>
        <TextInput
          style={{ height: 20, borderColor: "gray", borderWidth: 1 }}
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        <Text>Tracked Metrics</Text>
        <Text>Heart Rate: </Text>
        <Switch
          value={this.state.heartRate}
          onValueChange={value => this.setState({ heartRate: value })}
        />
        <Text>Steps: </Text>
        <Switch
          value={this.state.steps}
          onValueChange={value => this.setState({ steps: value })}
        />
        <Text>Sleep: </Text>
        <Switch
          value={this.state.sleep}
          onValueChange={value => this.setState({ sleep: value })}
        />
        <Text>Mood: </Text>
        <Switch
          value={this.state.mood}
          onValueChange={value => this.setState({ mood: value })}
        />
        <Text>
          This information will be tabulated and shared anonymously to provide
          better user experience.
        </Text>
        <Text>Share Your Metrics: </Text>
        <Switch
          value={this.state.share}
          onValueChange={value => this.setState({ share: value })}
        />
        <Text>Share Your Location: </Text>
        <Switch
          value={this.state.location}
          onValueChange={value => this.setState({ location: value })}
        />
        <Button title="Save Changes" onPress={this.handleSave} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2F1",
    // alignItems: 'center',
    justifyContent: "space-between",
    paddingTop: "5%",
    paddingBottom: "10%"
  },
  buttons: {
    // padding: '5%',
    // height: 200,
    // flex: 1
  }
});

const mapDispatch = dispatch => {
  return {
    updateUserPrefs: (docId, preferences, navigate) =>
      dispatch(updateUserPrefs(docId, preferences, navigate))
  };
};

const mapState = state => {
  return {
    userDocId: state.firestoreStore.userDocId,
    preferences: state.firestoreStore.preferences
  };
};

export default connect(
  mapState,
  mapDispatch
)(Preferences);
