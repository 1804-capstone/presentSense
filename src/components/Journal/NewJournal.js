import React from "react";
import { StyleSheet, Text, View, Dimensions, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import { connect } from "react-redux";
import { addNewEntry } from '../../store/firebase'
import {
  MoodInputForm,
  OuterInfluenceForm,
  AccomplishForm,
  StruggleForm,
  JournalForm
  } from '../forms'

class NewJournal extends React.Component {
  constructor() {
    super()
    this.state = {
      mood: 0,
      moodText: 'Fantastic',
      outerInfluences: 0,
      outerInfluencesText: 'Interpersonal relationships',
      accomplishment: '',
      struggle: '',
      advice: '',
      journalEntry: ''

    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEntry = this.handleEntry.bind(this)
  }

  handleEntry(category, input) {
    this.setState({[category]: input})
  }

  handleSubmit() {
    const { navigate } = this.props.navigation
    const newEntry = {...this.state, date: Date.now()}
    this.props.addNewEntry(newEntry, navigate)
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <MoodInputForm handleEntry={this.handleEntry}/>
        <OuterInfluenceForm handleEntry={this.handleEntry}/>
        <AccomplishForm handleEntry={this.handleEntry}/>
        <StruggleForm handleEntry={this.handleEntry}/>
        <JournalForm handleEntry={this.handleEntry}/>
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

const mapDispatch = dispatch => {
  return {
    addNewEntry: (newEntry, navigate) => dispatch(addNewEntry(newEntry, navigate))
  }
}

export default connect(null, mapDispatch)(NewJournal)
