import AnimatedMultistep from "react-native-animated-multistep";
import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
/* Define the steps  */

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";


const allSteps = [
    { name: "step 1", component: Step1 },
    { name: "step 2", component: Step2 },
    { name: "step 3", component: Step3 },
];

/* Define your class */
export default class LengkapiPendaftaran extends Component {
    /* define the method to be called when you go on next step */
    onNext = () => {
        console.log("Next");
    };

    /* define the method to be called when you go on back step */

    onBack = () => {
        console.log("Back");
    };

    /* define the method to be called when the wizard is finished */

    finish = finalState => {
        console.log(finalState);
    };



    /* render MultiStep */
    render() {
        return (
            <View style={{ flex: 1 }}>
                <AnimatedMultistep
                    steps={allSteps}
                    onFinish={this.finish}
                    onBack={this.onBack}
                    onNext={this.onNext}
                    comeInOnNext="fadeIn"
                    OutOnNext="fadeOut"
                    comeInOnBack="fadeIn"
                    OutOnBack="fadeOut"
                />
            </View>
        );
    }
}
