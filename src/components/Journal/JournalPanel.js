import React from "react";
import { StyleSheet, Text, View, Dimensions, Animated, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";


export default class JournalPanel extends React.Component {
  constructor() {
    super()
    this.state = {
      expanded: false,
      animHeight: new Animated.Value(55)
    }
    this.toggleHeight = this.toggleHeight.bind(this)
  }

  toggleHeight() {
    let initialValue = this.state.expanded ? 150 : 55
    let finalValue = this.state.expanded ? 55 : 150
    this.setState({expanded: !this.state.expanded})
    this.state.animHeight.setValue(initialValue)
    Animated.spring(this.state.animHeight, {
        toValue: finalValue
      }).start()
  }

  render() {
    const { navigate, date, log } = this.props
    return (
      <Animated.View
        style={{height: this.state.animHeight, overflow: 'hidden'}}>
        <View style={styles.dateRow}>
          <View style={styles.sideL}>
          <TouchableOpacity
            onPress={this.toggleHeight}>
            <Icon
              name={this.state.expanded ? 'chevron-up' : 'chevron-down'}
              type='font-awesome'
              iconStyle={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.txt}>{date}</Text>
          </View>
          <View>
          <TouchableOpacity
            onPress={() => navigate("SingleJournal", { date, log })}>
            <Icon
              name='chevron-right'
              type='font-awesome'
              iconStyle={styles.icon2} />
          </TouchableOpacity>
          </View>
        </View>
        <View>
          {this.props.children}
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  dateRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 7,
    padding: 5,
    paddingBottom: 7,
    backgroundColor: '#B2DFDB'
  },
  sideL: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontSize: 30
  },
  icon: {
    paddingRight: 10,
    paddingLeft: 10
  },
  icon2: {
    alignSelf: 'flex-start'
  }
})
