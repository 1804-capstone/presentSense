import React from "react";
import { StyleSheet, Text, View, Dimensions, Animated } from "react-native";
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
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <Button
          title="New Entry"
          buttonStyle={styles.btn}
          raised
          borderRadius={10}
          fontSize={30}
          backgroundColor="#4DB6AC"
          onPress={() => navigate("NewEntry")}
          />
          <View>
            <Text>Past Entries</Text>
            <Animated.View>
              <Text style={styles.txt}
                // onPress={Animated.timing(styles.txt.height, {
                //   toValue: 100}).start()}
                >One</Text>
              <Text style={{backgroundColor: 'powderblue'}}>One</Text>
              <Text style={{backgroundColor: 'green'}}>One</Text>
            </Animated.View>
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
  txt: {
    height: 20,
    backgroundColor: 'steelblue'
  }
})
