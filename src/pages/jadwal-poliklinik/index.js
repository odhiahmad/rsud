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
            dataDetail: null,
            isLoadingDataModal: true,
            isModalVisible: false,
            modalVisible: false,
        };
    }

    componentDidMount() {

        return fetch(baseApi + '/user/poly').then((response) => response.json()).then((responseJson) => {
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

    setModalUnvisible(visible) {
        this.setState({modalVisible: visible, dataDetail: null});
    }

    setModalVisible(visible, id, namaKelas) {
        this.setState({
            namaKelas: namaKelas,
            modalVisible: visible,
        });
        fetch(baseApi + '/user/polyDetail', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
            }),

        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                isLoadingDataModal: false,
                dataDetail: responseJson.data,

            });

        })
            .catch((error) => {
                console.log(error);
            });

    }


    render() {

        var listView = [];
        if (this.state.dataDetail != null) {
            for (let i = 0; i < this.state.dataDetail.length; i++) {
                var hari = this.state.dataDetail[i].jadwal_hari;
                var jamMulai = this.state.dataDetail[i].jadwal_jam_mulai;
                var jamSelesai = this.state.dataDetail[i].jadwal_jam_selesai;
                var jamCheckin = this.state.dataDetail[i].jadwal_checkin;

                listView.push(<View>
                    {
                        <Card>
                            <CardItem>
                                <Body>
                                    <Text style={{
                                        marginBottom:5,
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}> {this.state.dataDetail[i].get_dokter_jadwal[0].dokter_nama}</Text>
                                    <Grid>
                                        <Col style={{width:'25%',height: 60}}>
                                            <Image style={styles.avatar} source={require('../../images/profile.png')}/>
                                        </Col>
                                        <Col style={{height: 200}}>
                                            <ListItem icon>
                                                <Left>
                                                    <Button primary>
                                                        <Icon active name="calendar" />
                                                    </Button>
                                                </Left>
                                                <Body>
                                                    <Text style={{marginRight: 10}}>Hari</Text>
                                                </Body>
                                                <Right><Text style={{
                                                    fontWeight: 'bold',
                                                    paddingLeft: 10,
                                                    textAlign: 'center',
                                                }}>{hari}</Text></Right>
                                            </ListItem>
                                            <ListItem icon>
                                                <Left>
                                                    <Button warning>
                                                        <Icon active name="clock" />
                                                    </Button>
                                                </Left>
                                                <Body>
                                                    <Text style={{marginRight: 10}}>Jam Mulai</Text>
                                                </Body>
                                                <Right><Text style={{
                                                    fontWeight: 'bold',
                                                    paddingLeft: 10,
                                                    textAlign: 'center',
                                                }}>{jamMulai}</Text></Right>
                                            </ListItem>
                                            <ListItem icon>
                                                <Left>
                                                    <Button style={{ backgroundColor: "#7d1010" }}>
                                                        <Icon active name="clock" />
                                                    </Button>
                                                </Left>
                                                <Body>
                                                    <Text style={{marginRight: 10}}>Jam Selesai</Text>
                                                </Body>
                                                <Right><Text style={{
                                                    fontWeight: 'bold',
                                                    paddingLeft: 10,
                                                    textAlign: 'center',
                                                }}>{jamSelesai}</Text></Right>
                                            </ListItem>
                                            <ListItem icon>
                                                <Left>
                                                    <Button style={{ backgroundColor: "#FF9501" }}>
                                                        <Icon active name="clock" />
                                                    </Button>
                                                </Left>
                                                <Body>
                                                    <Text style={{marginRight: 10}}>Jam Checkin</Text>
                                                </Body>
                                                <Right><Text style={{
                                                    fontWeight: 'bold',
                                                    paddingLeft: 10,
                                                    textAlign: 'center',
                                                }}>{jamCheckin}</Text></Right>
                                            </ListItem>
                                        </Col>
                                    </Grid>
                                </Body>
                            </CardItem>
                        </Card>
                    }
                </View>);

            }
        } else {
            listView.push(<View style={styles.container}>
                {
                    <Spinner color='green'/>
                }</View>);
        }


        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator/>
                </View>
            );
        } else {
            let data = this.state.dataSource.map((val, key) => {
                return <View key={key} style={styles.item}>
                    <ListItem
                        onPress={() => {
                            this.setModalVisible(true, val.poly_id, val.poly_nama);
                        }}
                        icon>
                        <Left>
                            <Button style={{backgroundColor: '#FF9501'}}>
                                <Icon type="FontAwesome" active
                                      name={val.poly_icon}></Icon>
                            </Button>
                        </Left>
                        <Body>
                            <Text>{val.poly_nama}</Text>
                        </Body>
                    </ListItem>
                </View>;


            });

            const modalDetail =
                <Modal
                    onHardwareBackPress={() => this.setModalUnvisible(!this.state.modalVisible)}
                    propagateSwipe={true}
                    modalTitle="Tes"
                    animationInTiming="300"
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                    }}>
                    <View style={{flex: 1}}>
                        <Text style={{
                            marginBottom: 10,
                            fontSize: 16,
                            fontWeight: '500',
                            textAlign: 'center',
                        }}>Jadwal {this.state.namaKelas}</Text>
                        <ScrollView>


                            {listView}

                            {/*<View style={{width:40,justifyContent: 'center'}}></View>*/}


                        </ScrollView>

                        <TouchableOpacity>
                            <Button onPress={() => {
                                this.setModalUnvisible(!this.state.modalVisible);
                            }} full success>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#ffffff',
                                    textAlign: 'center',
                                }}>Keluar</Text>
                            </Button>
                        </TouchableOpacity>

                    </View>


                </Modal>;

            return (
                <Root>
                    <Container>
                        <Content>
                            <View>
                                {data}
                                {modalDetail}
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
