import {Image, Text, View} from 'react-native';
import React from 'react';

<View style={{height: 54, backgroundColor: 'white', flexDirection: 'row'}}>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image style={{width: 20, height: 20}} source={require('../../images/profile.png')}/>
        <Text style={{fontSize: 10, marginTop: 4, color: '#43AB4A'}}>Home</Text>
    </View>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image style={{width: 20, height: 20}} source={require('../../images/profile.png')}/>
        <Text style={{fontSize: 10, color: '#545454', marginTop: 4}}>Notifikasi</Text>
    </View>
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image style={{width: 20, height: 20}} source={require('../../images/profile.png')}/>
        <Text style={{fontSize: 10, color: '#545454', marginTop: 4}}>Profil</Text>
    </View>
</View>
