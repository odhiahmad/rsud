import React, { Component } from 'react';
import {
    ToastAndroid,
    BackHandler,
    StyleSheet,
    Text,
    View,
    StatusBar ,
    TouchableOpacity
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from "react-redux";

import Routes from './components/Routes';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen'
import PushNotificationIOS from "@react-native-community/push-notification-ios";
var PushNotification = require("react-native-push-notification");

var backButtonPressedOnceToExit = false;
class Main extends Component<{}> {
    componentDidMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
    }
    componentWillMount(){
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    onBackPress() {
        if (backButtonPressedOnceToExit) {
            BackAndroid.exitApp();
        } else {
            if (Actions.currentScene !== 'Home') {
                Actions.pop();
                return true;
            } else {
                backButtonPressedOnceToExit = true;
                ToastAndroid.show("Press Back Button again to exit",ToastAndroid.SHORT);
                //setting timeout is optional
                setTimeout( () => { backButtonPressedOnceToExit = false }, 2000);
                return true;
            }
        }
    }

    render() {
        PushNotification.localNotificationSchedule({
            //... You can use all the options from localNotifications
            message: "My Notification Message", // (required)
            date: new Date(Date.now() + 60 * 1000), // in 60 secs
        });

        const isHermes = () => global.HermesInternal !== null;
        console.log(isHermes())
        const {authData:{isLoggedIn}} = this.props;
        return(
            <View style={styles.container}>
                <StatusBar
                    backgroundColor="#1c313a"
                    barStyle="light-content"
                />
                <Routes isLoggedIn={isLoggedIn} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container : {
        flex: 1
    }
});

mapStateToProps = state => ({
    authData: state.authReducer.authData
})

export default connect(mapStateToProps, null)(Main)
