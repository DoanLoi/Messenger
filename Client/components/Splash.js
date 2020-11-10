import React, {Component} from 'react'
import { View,StyleSheet,Text,Dimensions } from 'react-native';

export default class Splash extends Component{
    render(){
        return(
            <View   style={styles.container}>
                <Text style={styles.title}>Hello,This is Spalash</Text>
            </View>
        );
    }
}
var width = Dimensions.get('window').width;
const styles=StyleSheet.create({
    container:{
        backgroundColor:'green',
        flex:1,
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    title:{
        fontWeight:'bold',
        fontSize:18,
        color:'white'
    }
})