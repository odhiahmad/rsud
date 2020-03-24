import React, {Component} from 'react';
import {View,StyleSheet} from 'react-native'
import {Container, Header, Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button} from 'native-base';
import HTMLView from 'react-native-htmlview';

const styles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
});

const CustomRow = ({title, description, image_url,jam}) => (
    <List>
        <ListItem thumbnail>
            <Left>
                <Thumbnail square source={require('../images/banner/banner1.jpg')}/>
            </Left>
            <Body>
                <Text>{title}</Text>

                <HTMLView
                    value={description}
                    stylesheet={styles}
                />
                <View style={{flex:1,flexDirection:'row',marginTop:10}}>
                    <Text note>{jam}</Text>
                </View>
            </Body>
            <Right>
                <Button transparent>
                    <Text>View</Text>
                </Button>
            </Right>
        </ListItem>
    </List>);
// class CustomRow extends Component{
//     constructor(props){
//         super(props);
//         this.data = props.data;
//     }
//
//     handlePress = () => {
//         const {} = this.data;
//         this.props.onPress({});
//     }
//
//
//     render(){
//         return(
//
//         )
//     }
//
// }


export default CustomRow;
