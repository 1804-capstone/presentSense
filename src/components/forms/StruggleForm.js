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

export default class StruggleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ""
    };
  }

  render() {
    return (
      <ScrollView>
        <Text style={styles.welcome}>
          What's something you're currently struggling with?{" "}
        </Text>
        <TextInput
          style={{ height: 60, borderColor: "gray", borderWidth: 1 }}
          multiline
          numberOfLines={10}
          value={this.state.content}
          onChangeText={content => this.setState({ content })}
        />
        <Text style={styles.welcome}>
          If your best friend was struggling with the same issue, what advice
          would you give?{" "}
        </Text>
        <TextInput
          placeholder="I would tell my friend that..."
          style={{ height: 60, borderColor: "gray", borderWidth: 1 }}
          multiline
          numberOfLines={10}
          value={this.state.content}
          onChangeText={content => this.setState({ content })}
        />
        {/* <TouchableHighlight
          underlayColor="green"
          onPress={() => {
            this.props.addNote(this.state.content, +this.state.pageNumber);
            this.props.navigation.navigate("TOC");
          }}
        > */}
        {/* <Text>Add Entry</Text>
        <View>
          <Button
            title="Next"
            onPress={() => this.props.navigation.navigate("JournalForm")}
          />
        </View> */}
        {/* </TouchableHighlight> */}
      </ScrollView>
    );
  }
}

// const mapStateToProps = state => {
//   return {
//     pages: state.pages
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     addNote: (content, pageNumber) => dispatch(postNote(content, pageNumber))
//   };
// };

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(AnnotationEdit);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    justifyContent: "space-between",
    paddingTop: "10%",
    paddingBottom: "10%"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    marginTop: 20,
    marginBottom: 20
  }
});
