import React, {Component} from 'react';
import {View} from 'react-native';
import MultiSelect from 'react-native-multiple-select';

const items = [{
    id: '92iijs7yta',
    name: 'Ondo',
}, {
    id: 'a0s0a8ssbsd',
    name: 'Ogun',
}, {
    id: '16hbajsabsd',
    name: 'Calabar',
}, {
    id: 'nahs75a5sg',
    name: 'Lagos',
}, {
    id: '667atsas',
    name: 'Maiduguri',
}, {
    id: 'hsyasajs',
    name: 'Anambra',
}, {
    id: 'djsjudksjd',
    name: 'Benue',
}, {
    id: 'sdhyaysdj',
    name: 'Kaduna',
}, {
    id: 'suudydjsjd',
    name: 'Abuja',
}];


class MultiSelectExample extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
        };
    }

    onSelectedItemsChange = selectedItems => {
        this.setState({selectedItems});
    };
    render() {
        const {selectedItems} = this.state;
        return (
            <View style={{flex: 1}}>

            </View>
        );
    }
}
