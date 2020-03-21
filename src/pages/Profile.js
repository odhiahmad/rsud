import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, Image} from 'react-native';
import {connect} from 'react-redux';
import {Icon} from 'native-base';
import {logoutUser} from '../actions/auth.actions';
import {baseApi, fetchApi} from '../service/api';
import Loader from "../components/Loader";
type Props = {}


class Profile extends Component <{}> {
    constructor(){
        super();
        this.state = {
            data:null,
            loaded:false,
            error:null,
            isLoading: true,
            dataProfil: null,
        }
    }

    componentDidMount() {

        return fetch(baseApi + '/user/user', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization':'Bearer '+this.props.getUser.userDetails.token
            }
        }).then((response) => response.json()).then((responseJson) => {
            this.setState({
                isLoading: false,
                dataProfil: responseJson.user,
            });

            console.log(responseJson.user)
        })
            .catch((error) => {
                console.log(error);
            });
    }

    logoutUser = () => {
        this.props.dispatch(logoutUser());
    }



    render() {
        const userDetails = this.state.dataProfil
        console.log(this.props.getUser.userDetails.token)

            return (

                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.header}></View>
                        <Image style={styles.avatar} source={require('../images/profile.png')}/>
                        <View style={styles.body}>
                            <View style={styles.bodyContent}>
                                <Text style={styles.info}>{userDetails ? userDetails.name : ""}</Text>
                                <Text style={styles.info}>UX Designer / Mobile developer</Text>
                                <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>

                                <TouchableOpacity style={styles.buttonContainer} onPress={this.logoutUser}>
                                    <Text style={{color:'#ffffff'}}>Keluar </Text><Icon type="FontAwesome" name="sign-out"/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            );


    }
}

const styles = StyleSheet.create({
    header:{
        backgroundColor: "#1da30b",
        height:120,
    },
    avatar: {
        width: 130,
        height: 130,
        borderRadius: 63,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:50
    },
    name1:{
        fontSize:22,
        color:"#FFFFFF",
        fontWeight:'600',
    },
    body:{
        marginTop:40,
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center',
        padding:30,
    },
    name2:{
        fontSize:28,
        color: "#696969",
        fontWeight: "600"
    },
    info:{
        fontSize:16,
        color: "#00BFFF",
        marginTop:10
    },
    description:{
        fontSize:16,
        color: "#696969",
        marginTop:10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop:10,
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:250,
        borderRadius:30,
        backgroundColor: "#1da30b",
    },
});
mapStateToProps = (state) => ({
    getUser: state.userReducer.getUser,
});

mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
