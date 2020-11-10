import React, { useState, useEffect, Component } from "react";
import { Dimensions, SafeAreaView, StyleSheet,View } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { clamp, onGestureEvent, timing, withSpring } from "react-native-redash";
import { getBottomSpace } from "react-native-iphone-x-helper";
import { Audio } from 'expo-av';
import AnimatedHideView from 'react-native-animated-hide-view';



// import TabIcon from "./TabIcon";
import Player from "./Player";
import MiniPlayer from "./MiniPlayer";
import TabMusic from "./TabMusic"


const { height } = Dimensions.get("window");
const TABBAR_HEIGHT = getBottomSpace() + 50;
const MINIMIZED_PLAYER_HEIGHT = 42;
const SNAP_TOP = 0;
const SNAP_BOTTOM = height - TABBAR_HEIGHT - MINIMIZED_PLAYER_HEIGHT;
const config = {
  damping: 15,
  mass: 1,
  stiffness: 150,
  overshootClamping: false,
  restSpeedThreshold: 0.1,
  restDisplacementThreshold: 0.1
};
const {
  Clock,
  Value,
  cond,
  useCode,
  set,
  block,
  not,
  clockRunning,
  interpolate,
  diffClamp,
  Extrapolate
} = Animated;

const styles = StyleSheet.create({
  playerSheet: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "cyan"
  },
  container: {
    backgroundColor: "#272829",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TABBAR_HEIGHT,
    flexDirection: "row",
    borderTopColor: "black",
    borderWidth: 1
  }
});

export default class MusicComponent extends Component  {

 constructor(props){
   super(props);
   this.state={
     isShow:false,
     code:"",
     parent:'loi'
   }
 }
 playMusic(code,parent){
   parent.setState({code:code,isShow:true});
 }
 changeModeMusic(parent){
  this.setState({parent:parent});
 }
 componentDidUpdate(){
   console.log("didUpdate");
 }
render(){
  const {isShow,code,parent}=this.state;
  return (
    <View style={{flex:1}}>
      <TabMusic 
      fetchMusic={this.playMusic}
      parent={this}
      />

        <AnimatedHideView
         visible={isShow}
          style={styles.playerSheet}
        >
          <Player 

          code={code}
          onPress={(parent) => {
            this.setState({isShow:false})
            this.changeModeMusic(parent);
          }}
          />
        </AnimatedHideView>  
          {/* <Animated.View
            pointerEvents="none"
            style={{
              opacity: opacity2,
              backgroundColor: "#272829",
              ...StyleSheet.absoluteFillObject
            }}
          /> */}
          <AnimatedHideView
          visible={!isShow}
            style={{
              
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: MINIMIZED_PLAYER_HEIGHT
            }}
          >
            <MiniPlayer onPress={() => {
            
            this.setState({isShow:true})
            }}
            
            parent={parent}
            />
          </AnimatedHideView>
  
      {/* <Animated.View
        style={{ transform: [{ translateY: translateBottomTab }] }}
      >
        <SafeAreaView style={styles.container}>
          <TabIcon name="home" label="Home" />
          <TabIcon name="search" label="Search" />
          <TabIcon
            name="chevron-up"
            label="Player"
            onPress={() => goUp.setValue(1)}
          />
        </SafeAreaView>
      </Animated.View> */}
      </View>
  );
};
}
 