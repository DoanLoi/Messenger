import React, { Component } from 'react'
import { View, StyleSheet, Image, Text, SafeAreaView, StatusBar, TextInput, KeyboardAvoidingView, TouchableOpacity,Dimensions } from 'react-native';
import {host} from "../linkHost"
export default class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:''
        }
    }
   
    render() {
        const {parent}=this.props;
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='light-content'></StatusBar>
                <KeyboardAvoidingView  style={styles.container}>
                    <View style={styles.container}>
                        <View style={styles.logoCotainer}>
                            <Image style={styles.logo}
                                source={require("../images/TuyLinh.png")}
                            >

                            </Image>
                            <Text style={styles.title}>Account Information</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <TextInput style={styles.input}
                                placeholder="Enter your's email?"
                                onChangeText={(text)=>{
                                    this.setState({username:text})
                                }}
                            >

                            </TextInput>
                            <TextInput style={styles.input}
                                placeholder="Enter your's password?"
                                onChangeText={(text)=>{
                                    this.setState({password:text})
                                }}
                            >

                            </TextInput>
                            <TouchableOpacity style={{
                                backgroundColor:'yellow',
                                height:40,
                                justifyContent:'center'
                            }}
                            onPress={()=>{
                                const data={
                                    email:this.state.username,
                                    password:this.state.password
                                }
                                parent._onSubmit(data);
                            }}
                            >
                                <Text style={{textAlign:"center"}}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>

            </SafeAreaView>

        );
    }
}
var width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#5b5a5a',
        flex: 1,
        flexDirection: 'column',
        width:width
    },
    logoCotainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    logo: {
        width: 150,
        height: 60,
        // tintColor:''
    },
    title: {
        color: '#f7c744',
        textAlign: 'center',
        fontSize: 20

    },
    infoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 200,
        padding: 20,
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        marginBottom:10
    }

})