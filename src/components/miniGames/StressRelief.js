import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Button } from "react-native-elements";

export default class StressRelief extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Image
          style={{ width: 200, height: 200 }}
          source={require("../../images/glow.jpg")}
        />
        <Button
          title="Glow Worms"
          raised
          borderRadius={10}
          fontSize={24}
          style={styles.btn}
          backgroundColor="#00796B"
          onPress={() => this.props.navigation.navigate("StressGame")}
        />
        <Image
          style={{ width: 200, height: 200 }}
          source={require("../../images/heart.jpg")}
        />
        <Button
          title="Doodler"
          raised
          borderRadius={10}
          fontSize={24}
          style={styles.btn}
          backgroundColor="#00796B"
          onPress={() => this.props.navigation.navigate("Doodler")}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  txt: {
    padding: 10,
    margin: 10,
    fontSize: 30,
    borderBottomWidth: 1
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row"
  },
  btn: {
    width: 250,
    margin: 5,
    marginTop: 5
  },
  container: {
    flex: 1,
    backgroundColor: "#E0F2F1",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: "5%",
    paddingBottom: "5%"
  }
});
