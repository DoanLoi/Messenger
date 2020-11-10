import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, Text, View,AsyncStorage } from 'react-native';


import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import MessageComponent from "./components/MessageComponent"
import LoginComponent from "./components/Login"
import FriendComponent from "./components/FriendComponent"
import Icon from "react-native-vector-icons/Ionicons"
import UserChat from './components/UserChat'
import ListFriend from "./components/ListFriend"
import HelloApp from "./components/HelloApp"
import TabNewPaper from "./components/TabNewPaper"
import PaperComponent from "./components/PaperCompnent"
import DetailPaper from "./components/DetailPaper"
import MusicComponent from "./components/MusicComponent"
import TabMusic from "./components/TabMusic"
import PlayMusic from "./components/PlayMusic"
import {host} from "./linkHost"
import RoomChatVideo from "./components/RoomChatVideo"
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const tabUserChat = () => (
  <Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarIcon: ({ tintColor, focused }) => {
      var iconName;

      if (route.name == 'Chat') iconName = 'md-chatbubbles'
      else if (route.name == 'Friend')iconName = 'md-people';
      else if (route.name == 'NewPaper') iconName = 'md-paper';
      else if (route.name == 'Music') iconName = 'md-musical-note';
      return <Icon name={iconName} size={25} style={{ color: tintColor }}></Icon>
    }
  })}
  tabBarOptions={{
    activeTintColor: 'black',
    inactiveTintColor: '#c4c2c2',
    showLabel: false
  }}
>
  <Tab.Screen name="Chat" component={MessageComponent}></Tab.Screen>
  <Tab.Screen name="Friend" component={FriendComponent} ></Tab.Screen>
  <Tab.Screen name="NewPaper" component={TabNewPaper} ></Tab.Screen>
  <Tab.Screen name="Music" component={MusicComponent} ></Tab.Screen>
</Tab.Navigator>

)



export default class App extends Component {
  constructor(props){
    super(props);
    this.state={
      isLogin:false,
      isLoading:true
    }
    this._checkLogin=this._checkLogin.bind(this);
  }
  _onSubmit=(data)=>{
  
    const self=this;
    fetch(host+'/login', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    .then((res) => res.json())
    .then(async (resJson)=>{
       
        if(resJson){
          self.setState({isLogin:true});
          await AsyncStorage.setItem("email",data.email)
          await AsyncStorage.setItem("password",data.password)

        }
        
    })
    }
    _login=async ()=>{
      const email = await AsyncStorage.getItem("email")
      const password = await AsyncStorage.getItem("password")
      if(email && password){
          this.setState({email,password})
          const data={
            email:email,
            password:password
          }
          this._onSubmit(data);
  
      }
      else{
        this.setState({isLogin:false})
      }
  }
  _checkLogin(){
    const self=this;
    fetch(`${host}/checkLogin`,{
      method:"GET",
      headers:{
          'Content-Type':'application/json'
      }})
    .then(function(response) {
    
    // Read the response as json.
    return response.json();
  })
  .then(function(responseAsJson) {
    console.log(self.state.isLoading);
    self.setState({isLoading:false});
    console.log(self.state.isLoading);
    if(responseAsJson){
      self.setState({isLogin:true})
    }
    else{
      this._login();
    }
  })
  .catch(function(error) {
    console.log(error);
  });
  }
 
  componentDidMount(){

   
   
   this._checkLogin();
  }
  render(){
    const {isLogin,isLoading}=this.state;
  
    return isLoading? <HelloApp /> : (isLogin?<NavigationContainer>
      <Stack.Navigator headerMode={false}>
     
        <Stack.Screen
          name={'homeChat'}
          component={tabUserChat}

        >

        </Stack.Screen>
        <Stack.Screen
          name={'userChat'}
          component={UserChat}
          options={UserChat.navigationOptions}
        >
         


        </Stack.Screen>
        <Stack.Screen
          name={'roomChat'}
          component={RoomChatVideo}
          options={UserChat.navigationOptions}
        >
         


        </Stack.Screen>
        <Stack.Screen
          name={'listArticle'}
          component={PaperComponent}
          options={UserChat.navigationOptions}
        >
         


        </Stack.Screen>
        <Stack.Screen
          name={'detailPaper'}
          component={DetailPaper}
          options={UserChat.navigationOptions}
        >
         


        </Stack.Screen>
        <Stack.Screen
          name={'playMusic'}
          component={PlayMusic}
          options={UserChat.navigationOptions}
        >
         


        </Stack.Screen>
 
      
      

      </Stack.Navigator>
      
    </NavigationContainer>:<LoginComponent  parent={this}/>) 
      
  
    
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
