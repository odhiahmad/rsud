import React, {Component, useEffect} from 'react';
import {baseApi} from '../../service/api';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableHighlight,
    TouchableOpacity, Image,
} from 'react-native';
import Modal from 'react-native-modal';
import {
    Col, Row, Grid,
    Item,
    H2,
    Spinner,
    Root,
    Container,
    Header,
    Content,
    Button,
    ListItem,
    Icon,
    Left,
    Body,
    Right,
    Switch,
    ActionSheet,
    Card, CardItem,
} from 'native-base';
import {Actions} from 'react-native-router-flux';


var BUTTONS = [
    'Kelas 1', 'Kelas 2', 'Kelas 3', 'Isolasi', 'Incubator', 'Covis', 'HCU',

];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

export default class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            namaKelas: null,
            isLoading: true,
            dataSource: null,
            inClick: false,
        };
    }

    onClickButton = () => {
        this.setState({inClickHome: true});
        Actions.shuttlebusdetail({id:id});
        setTimeout(function () {
            this.setState({inClickHome: false});
        }.bind(this), 2000);
    };

    componentDidMount() {

        return fetch(baseApi + '/user/shuttle').then((response) => response.json()).then((responseJson) => {
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


    render() {


        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                </View>
            );
        } else {
            let data = this.state.dataSource.map(({id_shuttle_bus,get_shuttle,trip,id}, key) => {
                let rute = get_shuttle.map((nama, j) => <Text key={j}>{nama.nama}</Text>);


                return <View key={key} style={styles.item}>
                    <ListItem
                        onPress={() =>
                            Actions.shuttlebusdetail({id:id_shuttle_bus,idTrip:id})
                        }
                        icon>
                        <Left>
                            <Button style={{backgroundColor: '#FF9501'}}>
                                <Icon type="FontAwesome" active
                                      name="bus"></Icon>
                            </Button>
                        </Left>
                        <Body>
                            <Text>{rute}</Text>
                        </Body>
                        <Right>
                            <Text>{trip}</Text>
                        </Right>
                    </ListItem>
                </View>;


            });


            return (
                <Root>
                    <Container>
                        <Content>
                            <View>
                                {data}
                            </View>
                        </Content>
                    </Container>
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
        height:40,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 10,
    },
});
