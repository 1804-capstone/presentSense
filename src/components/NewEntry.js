import React from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import {
  MoodInputForm,
  OuterInfluenceForm,
  AccomplishForm,
  StruggleForm,
  JournalForm
  } from './forms'

export default class NewEntry extends React.Component {
  constructor() {
    super()
    this.state = {

    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEntry = this.handleEntry.bind(this)
  }

  handleEntry(category, input) {
    //set the state with {category: input}
  }

  handleSubmit() {
    const { navigate } = this.props.navigation
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <MoodInputForm />
        <OuterInfluenceForm />
        <AccomplishForm />
        <StruggleForm />
        <JournalForm />
        <Button
          title="Submit Entry"
          buttonStyle={styles.btn}
          raised
          borderRadius={10}
          fontSize={30}
          backgroundColor="#4DB6AC"
          onPress={this.handleSubmit} />
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2F1',
    width: '100%',
    height: '100%'
  },
  btn: {
    margin: 20,
    alignSelf: 'center',
    width: 200
  }
})
