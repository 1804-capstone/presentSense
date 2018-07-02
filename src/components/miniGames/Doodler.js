import React, { Component } from "react";
import Sketch from "react-native-sketch";
import {
  Image,
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { Button } from "react-native-elements";

export default class Doodler extends Component {
  state = {
    color: "#FFFFFF",
    path: null
  };

  onColorChange = color => {
    this.setState({ color });
  };

  onChange = () => {
    console.log("onChange event"); // eslint-disable-line no-console
  };

  clear = () => {
    this.sketch.clear();
  };

  save = () => {
    this.sketch.save().then(({ path }) => {
      this.setState({ path });
    });
  };

  renderColorButton = color => {
    const active = color === this.state.color;

    return (
      <TouchableOpacity
        onPress={() => this.onColorChange(color)}
        style={[
          styles.colorButton,
          {
            backgroundColor: active ? "#000" : color,
            borderColor: color
          }
        ]}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={this.state.path ? "default" : "light-content"} />
        <View style={styles.colorsBar}>
          {this.renderColorButton("#ec46fc")}
          {this.renderColorButton("#aa46fc")}
          {this.renderColorButton("#7c46fc")}
          {this.renderColorButton("#4655fc")}
          {this.renderColorButton("#46a4fc")}
          {this.renderColorButton("#46effc")}
          {this.renderColorButton("#46fcc5")}
          {this.renderColorButton("#46fc6d")}
          {this.renderColorButton("#bafc79")}
          {this.renderColorButton("#FFFFFF")}
        </View>
        <Sketch
          fillColor="#000"
          imageType="png"
          onChange={this.onChange}
          ref={sketch => {
            this.sketch = sketch;
          }}
          strokeColor={this.state.color}
          strokeThickness={3}
          style={styles.sketch}
        />
        <View style={styles.actionsBar}>
          <Button
            backgroundColor="#E0F2F1"
            onPress={this.clear}
            title="Clear"
            raised
            borderRadius={10}
            fontSize={20}
            style={styles.btn}
            color="black"
          />
          <Button
            backgroundColor="#E0F2F1"
            onPress={this.save}
            title="Save"
            raised
            borderRadius={10}
            fontSize={20}
            style={styles.btn}
            color="black"
          />
        </View>
        <Modal animationType="slide" visible={!!this.state.path}>
          <View style={styles.modal}>
            <Text style={styles.title}>Here is the image you created.</Text>
            <Image
              resizeMode="contain"
              source={{ uri: `file://${this.state.path}` }}
              style={styles.image}
            />
            <View style={styles.btnContainer}>
              <Button
                title="Back"
                raised
                borderRadius={10}
                fontSize={18}
                style={styles.smallbtn}
                backgroundColor="#00796B"
                onPress={() => this.props.navigation.navigate("StressRelief")}
              />
              <Button
                title="Home"
                raised
                borderRadius={10}
                fontSize={18}
                style={styles.smallbtn}
                backgroundColor="#00796B"
                onPress={() => this.props.navigation.navigate("HomeScreen")}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1d423d",
    flex: 1,
    paddingTop: 20
  },
  colorsBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10
  },
  colorButton: {
    borderRadius: 50,
    borderWidth: 8,
    width: 25,
    height: 25
  },
  sketch: {
    borderRadius: 20,
    margin: 20
  },
  actionsBar: {
    alignItems: "stretch",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  modal: {
    height: "100%",
    width: "100%",
    backgroundColor: "#E0F2F1",
    paddingTop: 20,
    flex: 3
  },
  title: {
    color: "black",
    fontSize: 20,
    marginTop: 20,
    textAlign: "center"
  },
  image: {
    flex: 3,
    margin: 20
  },
  btnContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  btn: {
    width: 100,
    margin: 5,
    marginTop: 5
  },
  smallbtn: {
    width: 80,
    margin: 5
  }
});
