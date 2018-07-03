import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";

const SingleJournal = props => {
  const { date, log } = props.navigation.state.params
  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.date}>{date}</Text>
        <View style={styles.line} />
        <Text style={styles.label}>Overall Mood: </Text>
        <Text style={styles.txt}>{log.moodText}</Text>
        <View style={styles.line} />
        <Text style={styles.label}>Biggest Influence: </Text>
        <Text style={styles.txt}>{log.outerInfluencesText}</Text>
        <View style={styles.line} />
        <Text style={styles.label}>Accomplishment: </Text>
        {log.accomplishment.length > 0
          ? <Text style={styles.txt}>{log.accomplishment}</Text>
          : <Text style={styles.noEntry}>You did not enter any accomplishments   in this journal.</Text>}
        <View style={styles.line} />
        <Text style={styles.label}>Struggle: </Text>
        {log.struggle.length > 0
          ? <Text style={styles.txt}>{log.struggle}</Text>
          : <Text style={styles.noEntry}>You did not enter any struggles in      this journal.</Text>}
        <View style={styles.line} />
        <Text style={styles.label}>Advice: </Text>
        {log.advice.length > 0
          ? <Text style={styles.txt}>{log.advice}</Text>
          : <Text style={styles.noEntry}>You did not enter any advice in this     journal.</Text>}
        <View style={styles.line} />
        <Text style={styles.label}>Other Thoughts: </Text>
        {log.journalEntry.length > 0
          ? <Text style={styles.txt}>{log.journalEntry}</Text>
          : <Text style={styles.noEntry}>You did not enter any other thoughts in this journal.</Text>}
      </View>
    </ScrollView>
  )
}

export default SingleJournal

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2F1',
    height: '100%',
    width: '100%',
    padding: '7%'
  },
  innerContainer: {
    backgroundColor: '#B2DFDB',
    padding: '5%',
    borderRadius: 10
  },
  date: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10
  },
  label: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 15
  },
  txt: {
    fontWeight: 'normal',
    fontSize: 20,
    padding: 10
  },
  noEntry: {
    fontWeight: 'normal',
    fontSize: 20,
    padding: 10,
    color: 'grey'
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey'
  }
})
