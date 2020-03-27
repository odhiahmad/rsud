import React, { Component } from "react";
import { Image, View, TouchableOpacity, TextInput, Text } from "react-native";

import styles from "./styles";

export class step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalSteps: "",
      currentStep: ""
    };
  }

  static getDerivedStateFromProps = props => {
    const { getTotalSteps, getCurrentStep } = props;
    return {
      totalSteps: getTotalSteps(),
      currentStep: getCurrentStep()
    };
  };

  nextStep = () => {
    const { next, saveState } = this.props;
    saveState({ email: "sam@test.com" });
    next();
  };

  render() {
    const { currentStep, totalSteps } = this.state;
    return (
      <View style={[styles.container, styles.step1]}>
        <View>
          <Text
            style={styles.currentStepText}
          >{`Step ${currentStep} of ${totalSteps}`}</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          placeholder={"Email"}
          placeholderTextColor="#fff"
        />
        <TextInput
          style={styles.input}
          onChangeText={text => this.setState({ text })}
          value={this.state.text}
          placeholder={"Phone Number"}
          placeholderTextColor="#fff"
        />
        <View style={[styles.btnContainer, styles.marginAround]}>
          <TouchableOpacity onPress={this.props.back} style={styles.btnStyle}>
            <Image
                source={require("../../../images/icons/arrow.png")}
              style={[styles.btnImage, styles.backBtn]}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={this.nextStep} style={styles.btnStyle}>
            <Image
                source={require("../../../images/icons/arrow.png")}
              style={styles.btnImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default step2;
