import {StatusBar, View} from 'react-native';
import {Header, Icon} from 'react-native-elements';
import {Actions} from 'react-native-router-flux';
import LoaderModal from '../../components/LoaderModal';
import React, {Component} from 'react';
import ValidationComponent from 'react-native-form-validator';
import Ripple from 'react-native-material-ripple';

export default class CekStatusIGD extends Component {

    render() {
        return (
            <View style={{flex:1}}>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.4)"/>
                <Header
                    leftComponent={
                        <Ripple onPress={() => Actions.pop()}>
                            <Icon type='ionicon' name='arrow-back-outline' color='#fff'
                            /></Ripple>}
                    statusBarProps={{barStyle: 'light-content'}}
                    containerStyle={{
                        backgroundColor: '#1da30b',
                        justifyContent: 'space-around',
                    }}
                    barStyle="light-content"
                    placement="center"
                    centerComponent={{text: 'Cek Status IGD', style: {color: '#fff'}}}
                />

            </View>
        );
    }
}
