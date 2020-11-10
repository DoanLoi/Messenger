import React, { Component } from 'react'
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { Thumbnail,Spinner } from "native-base"

export default class Splash extends Component {
  render() {
    return (
      <View style={{flex:1}}>
        <View style={styles.container}>
          <Thumbnail large source={require('../images/cropped-TL-ICON.png')}></Thumbnail>
          <Text style={styles.title}>Welcome To TuYLynh</Text>
          <Spinner  color="#49a2d6" size={60} style={{marginTop:20}}/>
         
        </View>
       
        <View style={styles.bottom}>
          <Text style={{fontSize:30,fontWeight:'bold',marginBottom:20,color:'#cacecf'}}>TuYLynh</Text>
            <View style={{ flexDirection:'row'}}>
            <Thumbnail style={styles.icon} small source={require('../images/message.jpeg')}></Thumbnail>
           <Thumbnail   style={styles.icon} small source={require('../images/newspaper-computer-icons-symbol-png-favpng-uxcxrxULJwf1TaT4zWQDsFUcw.jpg')}></Thumbnail>
           <Thumbnail  style={styles.icon} small source={require('../images/weather.png')}></Thumbnail>
           <Thumbnail  style={styles.icon} small source={require('../images/png-transparent-apple-music-festival-itunes-computer-icons-music-icon-text-logo-music-download-thumbnail.png')}></Thumbnail>
            </View>
          
                </View>
        </View>

        );
    }
}
var width = Dimensions.get('window').width;
const styles=StyleSheet.create({
          container:{
          backgroundColor:'white',
        flex:1,
        width:width,
        alignItems:'center',
        justifyContent:'center'
    },
    title:{
          fontWeight:'bold',
        fontSize:25,
        color:'#49a2d6',
        fontStyle:'italic',
        marginTop:20

    },
    bottom:{
        bottom:0,
        left:0,
        right:0,
        alignItems:'center',
        justifyContent:'center',
        height:200,
        backgroundColor:'white'
       
      },
      icon:{
        backgroundColor:'white',
        marginLeft:10,
       

      }
})