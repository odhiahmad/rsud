import React, {Component} from 'react';
import {Header, Icon, Tile} from 'react-native-elements';
import {
    Text,
    StyleSheet,
    Animated,
    View,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    BackHandler,
    Dimensions, StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import TabBar from "@mindinventory/react-native-tab-bar-interaction";
import Home from './Home';
import Profile from './Profile';
import Riwayat from './Riwayat';

class Profile extends Component {

    render() {
        const handlePress = (index) => {
            console.log(index);
        };
        return (
            <View style={{flex:1}}>
            <TabBar bgNavBar="white" bgNavBarSelector="white" stroke="skyblue">
                <TabBar.Item
                    // icon={require('./tab1.png')}
                    // selectedIcon={require('./tab1.png')}
                    title="Tab1"
                    screenBackgroundColor={{backgroundColor: '#008080'}}
                >
                    <View>
                        {Home}
                    </View>
                </TabBar.Item>
                <TabBar.Item
                    // icon={require('./tab2.png')}
                    // selectedIcon={require('./tab1.png')}
                    title="Tab2"
                    screenBackgroundColor={{backgroundColor: '#F08080'}}
                >
                    <View>
                        {Riwayat}
                    </View>
                </TabBar.Item>
                <TabBar.Item
                    // icon={require('./tab3.png')}
                    // selectedIcon={require('./tab1.png')}
                    title="Tab3"
                    screenBackgroundColor={{backgroundColor: '#485d72'}}
                >
                    <View>
                        {Profile}
                    </View>
                </TabBar.Item>
            </TabBar>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ecf0f1',
    },
    view1: {},
    view2: {},
});
mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
