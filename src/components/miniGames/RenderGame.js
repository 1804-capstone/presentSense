import React, { PureComponent } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { StaggeredMotion, spring } from "react-motion";
import * as Animatable from "react-native-animatable";

const { width: WIDTH, height: HEIGHT } = Dimensions.get("window");

const bodyDiameter = Math.trunc(Math.max(WIDTH, HEIGHT) * 0.085);
const borderWdth = Math.trunc(bodyDiameter * 0.1);
const colors = ["#5546fc", "#466afc", "#46bcfc", "#2dffed"];
const edgeColors = ["#466afc", "#46bcfc", "#46e3fc", "#2dffce"];

class Stream extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ready: false
    };
    this.onReady = this.onReady.bind(this);
  }
  onReady = () => {
    this.setState({
      ready: true
    });
  };

  render() {
    const x = this.props.position[0] - bodyDiameter / 2;
    const y = this.props.position[1] - bodyDiameter / 2;
    return (
      <View>
        <StaggeredMotion
          defaultStyles={[
            { left: x, top: y },
            { left: x, top: y },
            { left: x, top: y },
            { left: x, top: y }
          ]}
          styles={prevStyles =>
            prevStyles.map((_, i) => {
              return i === 0
                ? {
                    left: spring(x),
                    top: spring(y)
                  }
                : {
                    left: spring(prevStyles[i - 1].left),
                    top: spring(prevStyles[i - 1].top)
                  };
            })
          }
        >
          {currStyles => (
            <View style={styles.anchor}>
              {currStyles.map((style, i) => (
                <View
                  key={i}
                  style={[
                    styles.body,
                    {
                      left: style.left,
                      top: style.top,
                      backgroundColor: colors[i],
                      borderColor: edgeColors[i],
                      width: bodyDiameter - i * 5,
                      height: bodyDiameter - i * 5,
                      zIndex: 0 - i

                      //opacity: this.state.ready ? 1 : 0
                    }
                  ]}
                />
              ))}
            </View>
          )}
        </StaggeredMotion>

        <Animatable.View
          animation="bounceIn"
          easing={"ease-in-out-cubic"}
          useNativeDriver={true}
          style={[styles.head, { left: x, top: y }]}
          onAnimationEnd={this.onReady}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    borderColor: "#1d423d",
    borderWidth: borderWdth,
    width: bodyDiameter,
    height: bodyDiameter,
    backgroundColor: "#1d423d",
    position: "absolute",
    borderRadius: bodyDiameter * 2
  },
  anchor: {
    position: "absolute"
  },
  head: {
    backgroundColor: "#8411ff",
    borderColor: "#5546fc",
    borderWidth: borderWdth,
    width: bodyDiameter,
    height: bodyDiameter,
    position: "absolute",
    borderRadius: bodyDiameter * 2
  }
});

export { Stream };
