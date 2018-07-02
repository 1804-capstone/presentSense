import React from "react";
import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity, ScrollView } from "react-native";
import { Button, Icon } from "react-native-elements";
import { connect } from "react-redux";
import { fetchMoodlogs } from '../../store/firebase'
import moment from 'moment'
import JournalPanel from './JournalPanel'

const Screen = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height
}


class MyJournals extends React.Component {
  constructor() {
    super()

  }

  componentDidMount() {
    this.props.fetchMoodlogs()
  }

  render() {
    const makeNiceDate = (timestamp) => moment(timestamp).format("MMMM Do, YYYY")
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <Button
          title="New Journal"
          buttonStyle={styles.btn}
          raised
          borderRadius={10}
          fontSize={30}
          backgroundColor="#4DB6AC"
          onPress={() => navigate("NewJournal")}
          />
          <View>
            <Text style={styles.pastTxt}>Past Journals:</Text>
            {this.props.moodLogs.length < 1
            ? <Text style={styles.none}>
                You do not have any journal entries yet. Add one now!</Text>
            : (
            <ScrollView>
              {this.props.moodLogs.map( (log, ind) => {
                return (
                  <JournalPanel key={ind} style={{backgroundColor: 'powderblue'}} date={makeNiceDate(log.date)} navigate={navigate} log={log}>
                    <View style={styles.txtContainer}>
                      <View style={styles.line} />
                      <Text style={styles.innerTxt}>Overall Mood: {log.moodText}</Text>
                      <Text style={styles.innerTxt}>Biggest Influence: {log.outerInfluencesText}</Text>
                    </View>
                  </JournalPanel>
                )
              })}
            </ScrollView>
            )}
          </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E0F2F1',
    width: '100%',
    height: '100%',
  },
  btn: {
    margin: 20,
    alignSelf: 'center',
    width: 200
  },
  pastTxt: {
    fontSize: 25,
    fontWeight: 'bold',
    paddingLeft: 15,
    marginTop: 5,
    marginBottom: 10,
    borderTopWidth: 1,
    borderTopColor: 'black'
  },
  none: {
    margin: 15,
    fontSize: 21
  },
  txtContainer: {
    marginLeft: 15,
    marginRight: 15,
    padding: 10,
    backgroundColor: '#B2DFDB'
  },
  line: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 7
  },
  innerTxt: {
    fontSize: 18
  }
})

mapState = state => {
  return {
    moodLogs: state.firestoreStore.moodLogs || []
  }
}

mapDispatch = dispatch => {
  return {
    fetchMoodlogs: () => dispatch(fetchMoodlogs())
  }
}

export default connect(mapState, mapDispatch)(MyJournals)
