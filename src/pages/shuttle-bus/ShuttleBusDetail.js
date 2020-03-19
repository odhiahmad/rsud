import React, {Component} from 'react';
import {
    Container,
    Header,
    Content,
    Card,
    CardItem,
    Text,
    Body,
    Icon,
    Right,
    Root,
    ListItem,
    Left,
    Button,
} from 'native-base';
import StepIndicator from 'react-native-step-indicator';
import {ActivityIndicator, ScrollView, StyleSheet, View} from 'react-native';
import {baseApi} from '../../service/api';


const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: '#fe7013',
    stepStrokeWidth: 3,
    stepStrokeFinishedColor: '#fe7013',
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: '#fe7013',
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: '#fe7013',
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 13,
    currentStepIndicatorLabelFontSize: 13,
    stepIndicatorLabelCurrentColor: '#fe7013',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 13,
    currentStepLabelColor: '#fe7013',
};


export default class ShuttleBusDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPosition: 0,
            namaKelas: null,
            isLoading: true,
            dataSource: null,
            inClick: false,
            idShuttle: this.props.id,
            idTrip:this.props.idTrip,
        };
    }

    componentDidMount() {


        return fetch(baseApi + '/user/shuttleDetail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.idShuttle,
                idTrip:this.state.idTrip

            }),
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                isLoading: false,
                dataSource: responseJson.data,
            });

        })
            .catch((error) => {
                console.log(error);
            });
    }

    componentWillUnmount() {

    }


    onPageChange(position) {
        this.setState({currentPosition: position});
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                </View>
            );
        } else {

            var labels = [];

            for (let i = 0; i < this.state.dataSource.length; i++) {
                labels.push(this.state.dataSource[i].rute);
            }
            var today = new Date();
            var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

            console.log(time);

            var posisiSekarang = 0;
            for (let i = 0; i < labels.length; i++) {
                if (i === 0) {
                    posisiSekarang = 0;

                } else {
                    if ((time >= this.state.dataSource[i - 1].jam) && (time <= this.state.dataSource[i].jam)) {
                        posisiSekarang += i;
                    }
                }

            }
            console.log(posisiSekarang);

            return (
                <Root>
                    <View style={styles.container}>
                        <StepIndicator
                            direction="vertical"
                            stepCount={labels.length}
                            customStyles={customStyles}
                            currentPosition={posisiSekarang}
                            labels={labels}
                        />
                    </View>
                </Root>

            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 10,
    },
});
