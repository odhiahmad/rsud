import React, { Component } from "react"
import { View, Text, StyleSheet } from "react-native"
import Select2 from "react-native-select-two"

const mockData = [
    { id: 1, name: "React Native Developer", checked: true }, // set default checked for render option item
    { id: 2, name: "Android Developer" },
    { id: 3, name: "iOS Developer" }
]

// create a component
class Pengaduan extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Select2
                    isSelectSingle
                    style={{ borderRadius: 5 }}
                    colorTheme="blue"
                    popupTitle="Select item"
                    title="Select item"
                    data={mockData}
                    onSelect={data => {
                        this.setState({ data })
                    }}
                    onRemoveItem={data => {
                        this.setState({ data })
                    }}
                />
            </View>
        )
    }
}
