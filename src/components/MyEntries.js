import React from "react";
import { StyleSheet, Text, View, Dimensions } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}

export default class MyEntries extends React.Component {
  constructor() {
    super()

  }

  componentDidMount() {
    //fetch user's moodlog data
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="New Entry"
          buttonStyle={styles.btn}
          raised
          borderRadius={10}
          fontSize={30}
          backgroundColor="#4DB6AC"
          onPress={() => navigate("Heartrate")}
          />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2F1',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  btn: {
    margin: 20
  }
})
