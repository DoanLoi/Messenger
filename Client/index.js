import React,{Component} from 'react';
import {AppRegistry, ScrollView} from 'react-native'
import Splash from "./components/Splash"
import Login from "./components/Login"
import MessageComponent from "./components/MessageComponent"

// const App =()=>(
//     <ScrollView horizontal={true}>
//         <Login />
//         <Splash />
//     </ScrollView>
// )

AppRegistry.registerComponent("main",()=>MessageComponent);