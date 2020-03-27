import AnimatedMultistep from "react-native-animated-multistep";


/* Define the steps  */

import Step1 from "./steps/step1";
import Step2 from "./steps/step2";
import Step3 from "./steps/step3";
import Step4 from "./steps/step4";

const allSteps = [
    { name: "step 1", component: Step1 },
    { name: "step 2", component: Step2 },
    { name: "step 3", component: Step3 },
    { name: "step 4", component: Step4 }
];

/* Define your class */
export default class App extends Component {
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
                    comeInOnNext="bounceInUp"
                    OutOnNext="bounceOutDown"
                    comeInOnBack="bounceInDown"
                    OutOnBack="bounceOutUp"
                />
            </View>
        );
    }
}
