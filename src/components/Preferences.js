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
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.txt}>Name: </Text>
        <TextInput
          style={styles.txtInput}
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
        />
        {/* <Text>Tracked Metrics</Text>
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
        /> */}
        <Text style={styles.txt2}>
          The following options improve user experience with the Mood Map.
          This information will be tabulated and shared anonymously.
        </Text>
        <View style={styles.toggle}>
          <Text style={styles.txt3}>
            Share Your Metrics:{'\n'}
            (your mood average will {'\n'}
            appear on map)</Text>
          <Switch
            value={this.state.share}
            onValueChange={value => this.setState({ share: value })}
          />
        </View>
        <View style={styles.toggle}>
          <Text style={styles.txt3}>
            Share Your Location: {'\n'}
            (map will centralize on {'\n'}
            your location)</Text>
          <Switch
            value={this.state.location}
            onValueChange={value => this.setState({ location: value })}
          />
        </View>
        <Button title="Save Changes"
          buttonStyle={styles.btn}
          raised
          borderRadius={10}
          fontSize={30}
          backgroundColor="#4DB6AC"
          onPress={this.handleSave} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F2F1",
    justifyContent: "space-between",
    padding: '10%'
  },
  txt: {
    fontSize: 30
  },
  txtInput: {
    height: 40,
    fontSize: 20,
    borderColor: "gray",
    borderBottomWidth: 1
  },
  txt2: {
    fontSize: 15
  },
  txt3: {
    fontSize: 20,

  },
  toggle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btn: {
    margin: 20,
    alignSelf: 'center',
    width: 250
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
