import React, {Component} from 'react';
import {Root} from 'native-base';
import {
    ToastAndroid,
    BackHandler,
    StyleSheet,
    Text,
    View,
    StatusBar,
    TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {connect} from 'react-redux';
import NetInfo from "@react-native-community/netinfo";
import Routes from './components/Routes';
import FlashMessage from 'react-native-flash-message';
import SplashScreen from 'react-native-splash-screen';
import OfflineNotice from './components/OfflineNotice'

var backButtonPressedOnceToExit = false;
const unsubscribe = NetInfo.addEventListener(state => {
    console.log("Connection type", state.type);
    console.log("Is connected?", state.isConnected);
});

// Unsubscribe
unsubscribe();
class Main extends Component<{}> {
    componentDidMount() {
        // do stuff while splash screen is shown
        // After having done stuff (such as async tasks) hide the splash screen
        SplashScreen.hide();
        NetInfo.fetch().then(state => {
            console.log("Connection type", state.type);
            console.log("Is connected?", state.isConnected);
        });
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress.bind(this));
    }

    componentWillUnmount() {
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
                ToastAndroid.show('Press Back Button again to exit', ToastAndroid.SHORT);
                //setting timeout is optional
                setTimeout(() => {
                    backButtonPressedOnceToExit = false;
                }, 2000);
                return true;
            }
        }
    }


    render() {

        const isHermes = () => global.HermesInternal !== null;
        console.log(isHermes());
        const {authData: {isLoggedIn}} = this.props;
        return (
            <Root>
                <View style={styles.container}>
                    <OfflineNotice />
                    {/*<StatusBar*/}
                    {/*    backgroundColor="#1c313a"*/}
                    {/*    barStyle="light-content"*/}
                    {/*/>*/}
                    <Routes isLoggedIn={isLoggedIn}/>

                </View>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

mapStateToProps = state => ({
    authData: state.authReducer.authData,
});

export default connect(mapStateToProps, null)(Main);
