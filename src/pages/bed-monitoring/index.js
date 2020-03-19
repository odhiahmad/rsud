import React, {Component, useEffect} from 'react';
import {baseApi} from '../../service/api';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    TouchableHighlight,
    TouchableOpacity,
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

        return fetch(baseApi + '/user/ruangan').then((response) => response.json()).then((responseJson) => {
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
        fetch(baseApi + '/user/detailRuangan', {
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
                var tersedia = (this.state.dataDetail[i].map_kapasitas) - this.state.dataDetail[i].map_isipr + this.state.dataDetail[i].map_isilk;
                var terisi = this.state.dataDetail[i].map_isipr + this.state.dataDetail[i].map_isilk;
                var perempuan = this.state.dataDetail[i].map_isipr;
                var laki = this.state.dataDetail[i].map_isilk;
                listView.push(<View>
                    {

                        <Card>
                            <CardItem>
                                <Body>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        textAlign: 'center',
                                    }}> {this.state.dataDetail[i].get_kelas_ketersedian[0].kelas_nama}</Text>
                                    <Grid>
                                        <Col style={{height: 150}}>
                                            <Item><Icon type="FontAwesome" name="medkit"></Icon><Text
                                                style={{marginRight: 10}}>Tersedia</Text>{tersedia > 9 ?
                                                <Button success style={{
                                                    width: 35, height: 40, marginRight: 10, borderRadius: 5,
                                                    marginVertical: 10,
                                                    paddingVertical: 13,
                                                }}><Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 5,
                                                    textAlign: 'center',
                                                }}> {tersedia}</Text></Button> : <Button success style={{
                                                    width: 35, height: 40, marginRight: 10, borderRadius: 5,
                                                    marginVertical: 10,
                                                    paddingVertical: 13,
                                                }}><Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 10,
                                                    textAlign: 'center',
                                                }}> {tersedia}</Text></Button>}</Item>
                                            <Item><Icon type="FontAwesome"
                                                        name="medkit"></Icon><Text
                                                style={{marginRight: 30}}>Terisi</Text>{terisi > 9 ?
                                                <Button danger style={{
                                                    width: 35, height: 40, borderRadius: 5,
                                                    marginVertical: 10,
                                                    paddingVertical: 13,
                                                }}><Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 5,
                                                    textAlign: 'center',
                                                }}> {terisi}</Text></Button> : <Button danger style={{
                                                    width: 35, height: 40, borderRadius: 5,
                                                    marginVertical: 10,
                                                    paddingVertical: 13,
                                                }}><Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 10,
                                                    textAlign: 'center',
                                                }}> {terisi}</Text></Button>}</Item>
                                        </Col>
                                        <Col style={{height: 150}}>
                                            <Item><Icon type="FontAwesome" name="user"></Icon><Text
                                                style={{marginRight: 10}}>Perempuan</Text>{perempuan > 9 ?
                                                <Button primary style={{
                                                    width: 35, height: 40, marginRight: 10, borderRadius: 5,
                                                    marginVertical: 10,
                                                    paddingVertical: 13,
                                                }}><Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 5,
                                                    textAlign: 'center',
                                                }}> {perempuan}</Text></Button> : <Button primary style={{
                                                    width: 35, height: 40, marginRight: 10, borderRadius: 5,
                                                    marginVertical: 10,
                                                    paddingVertical: 13,
                                                }}><Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 10,
                                                    textAlign: 'center',
                                                }}> {perempuan}</Text></Button>}</Item>
                                            <Item><Icon type="FontAwesome"
                                                        name="user"></Icon><Text
                                                style={{marginRight: 57}}>Pria</Text>{laki > 9 ?
                                                <Button primary style={{
                                                    width: 35, height: 40, borderRadius: 5,
                                                    marginVertical: 10,
                                                    paddingVertical: 13,
                                                }}><Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 5,
                                                    textAlign: 'center',
                                                }}> {laki}</Text></Button> : <Button primary style={{
                                                    width: 35, height: 40, borderRadius: 5,
                                                    marginVertical: 10,
                                                    paddingVertical: 13,
                                                }}><Text style={{
                                                    color: '#ffffff',
                                                    fontWeight: 'bold',
                                                    paddingLeft: 10,
                                                    textAlign: 'center',
                                                }}> {laki}</Text></Button>}</Item>
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
            let data = this.state.dataSource.map(({total, get_ruangan_ketersedian, map_kamarid, perempuan, pria}, key) => {
                let namaKelasData = get_ruangan_ketersedian.map((grNama, j) => <Text key={j}>{grNama.grNama}</Text>);
                let icon = get_ruangan_ketersedian.map((grNama, j) => <Icon type="FontAwesome" name={grNama.icon}
                                                                            key={j}/>);
                if (total != 0) {
                    return <TouchableOpacity key={key} style={styles.item}>
                        <ListItem
                            onPress={() => {
                                this.setModalVisible(true, map_kamarid, namaKelasData);
                            }}
                            icon>
                            <Left>
                                <Button style={{backgroundColor: '#FF9501'}}>
                                    {icon}
                                </Button>
                            </Left>
                            <Body>
                                <Text>{namaKelasData}</Text>
                            </Body>
                            <Right>
                                <Text>{total}</Text>
                            </Right>
                        </ListItem>
                    </TouchableOpacity>;
                }

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
                >
                    <View style={{flex: 1}}>
                        <Text style={{
                            marginBottom: 10,
                            fontSize: 16,
                            fontWeight: '500',
                            textAlign: 'center',
                        }}>Kelas Layanan {this.state.namaKelas}</Text>
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
});
