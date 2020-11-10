import React, {Component} from 'react'
import { View,StyleSheet,Text,Dimensions } from 'react-native';
import io from 'socket.io-client';
import Peer from 'react-native-peerjs';
import {host} from './../linkHost'
const socket = io(host);


export default class Splash extends Component{
    constructor(props){
      super(props);
      this.state={}
    }

    componentDidMount(){
      const { params } = this.props.route;
      let dataToEmit={
        listenerId:params.id,
        callerName:"Doan Loi"
      }
      socket.emit("caller-check-listener-online-or-not", dataToEmit);
    
    let iceServerList=[];
    
      let getPeerId = "";
      const localPeer = new Peer();
      localPeer.on('error', console.log);
      
      localPeer.on('open', localPeerId => {
        console.log('Local peer open with ID', localPeerId);
      })
    
      // peer.on("open", function (peerId) {
    
      //   getPeerId = peerId;
       
       
      
      // })

    
      //B3 cua listener
      socket.on("server-request-peer-id-of-listener", function (response) {
        console.log(response);
       
        let listenerName = "Linh"
    
        let dataToEmit = {
          callerId: response.callerId,
          listenerId: response.listenerId,
          callerName: response.callerName,
          listenerName: listenerName,
          listenerPeerId: getPeerId
        };
      
    
        //B4 cua listener
        socket.emit("listener-emit-peer-id-to-server", dataToEmit)
      })
    
      let timerInterval;
      //B5 cua caller
      socket.on("server-send-peer-id-of-listener-to-caller", function (response) {
        //nhan peerId cua thang listener
        let dataToEmit = {
          callerId: response.callerId,
          listenerId: response.listenerId,
          callerName: response.callerName,
          listenerName: response.listenerName,
          listenerPeerId: response.listenerPeerId
        };
    
        //B6 cua caller: gui yeu cau goi
    
    
        socket.emit("caller-request-call-to-server", dataToEmit);
      //   Swal.fire({
      //     title: `Đang gọi cho &nbsp <span style="color:#2ECC71">${response.listenerName}</span> &nbsp &nbsp <i class="fa fa-volume-control-phone"></i>`,
      //     html: `Thời gian: <strong></strong> s.<br/><br/>
      //   <button id="btn-cancel-call" class="btn btn-danger">
      //   Hủy cuộc gói
      //   </button>`,
      //     backdrop: "rgba(85,85,85,0,4)",
      //     witdh: "52rem",
      //     allowOutsideClick: false,
      //     timer: 30000,
      //     onBeforeOpen: () => {
      //       $("#btn-cancel-call").unbind("click").on("click", function () {
      //         Swal.close();
      //         clearInterval(timerInterval);
    
    
      //         //B7 cua thang caller Huy request call
      //         socket.emit("caller-cancel-request-call-to-server", dataToEmit);
      //       })
      //       Swal.showLoading();
      //       timerInterval = setInterval(() => {
      //         Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
      //       }, 1000);
      //     },
    
      //     onOpen: () => {
      //       //B12 cua caller lang nghe sukien listener tu choi
      //       socket.on("server-send-reject-call-to-listener", function () {
      //         Swal.close();
      //         clearInterval(timerInterval);
      //         Swal.fire({
      //           type: "infor",
      //           title: `<span style="color:#2ECC71">${response.listenerName}</span> &nbsp từ chối cuộc gọi`,
      //           backdrop: "rgba(85,85,85,0,4)",
      //           width: "52rem",
      //           allowOutsideClick: false,
      //           confirmButtonColor: "#2ecc71",
      //           confirmButtonText: "Confirm"
      //         })
      //       })
    
    
      //     },
      //     onClose: () => {
      //       clearInterval(timerInterval);
      //     }
      //   }).then((result) => {
    
      //     return false;
      //   })
       })
    
      //B8 cua listener su kien co cuoc goi
    
      socket.on("server-send-request-call-to-listener", function (response) {
        let dataToEmit = {
          callerId: response.callerId,
          listenerId: response.listenerId,
          callerName: response.callerName,
          listenerName: response.listenerName,
          listenerPeerId: response.listenerPeerId
        };
    
     
    
        // Swal.fire({
        //   title: `<span style="color:#2ECC71">${response.callerName}</span> &nbsp &nbsp đang gọi cho bạn <i class="fa fa-volume-control-phone"></i>`,
        //   html: `Thời gian: <strong></strong> s.<br/><br/>
        // <button id="btn-reject-call" class="btn btn-danger">
        // Từ chối cuộc gói
        // </button>
        // <button id="btn-accept-call" class="btn btn-success">
        //   Đồng ý
        // </button>`,
        //   backdrop: "rgba(85,85,85,0,4)",
        //   witdh: "52rem",
        //   allowOutsideClick: false,
        //   timer: 30000,
        //   onBeforeOpen: () => {
        //     $("#btn-reject-call").unbind("click").on("click", function () {
        //       Swal.close();
        //       clearInterval(timerInterval);
        //       //B10 cua listener: tu choi nghe cuoc goi
        //       socket.emit("listener-reject-request-call-to-server", dataToEmit);
    
    
    
        //     })
    
        //     //Accept call
        //     $("#btn-accept-call").unbind("click").on("click", function () {
        //       Swal.close();
        //       clearInterval(timerInterval);
        //       //B10 cua listener: tu choi nghe cuoc goi
        //       socket.emit("listener-accept-request-call-to-server", dataToEmit);
    
    
    
        //     })
    
        //     Swal.showLoading();
        //     timerInterval = setInterval(() => {
        //       Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        //     }, 1000);
        //   },
        //   //modal cua thang nghe dang mo
        //   onOpen: () => {
        //     //B9 cua listener :khi thang goi huy thi tat modal
        //     socket.on("server-send-cancel-request-call-to-listener", function (response) {
        //       Swal.close();
        //       clearInterval(timerInterval);
        //     });
    
    
    
        //   },
        //   onClose: () => {
        //     clearInterval(timerInterval);
        //   }
        // }).then((result) => {
    
        //   return false;
        // })
      })
    
    
      //B13 cua caller: listener accept
    
      socket.on("server-send-accept-call-to-listener", function (response) {
        Swal.close();
        clearInterval(timerInterval);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
    
        getUserMedia({ video: true, audio: true }, function (stream) {
          //mo streammodal
          $("#streamModal").modal("show");
          //chay video my stream tren local
          playVideoStream("local-stream", stream);
           console.log(response);
          //ket noi voi th listener qua peerID
          let call = peer.call(response.listenerPeerId, stream);
    
          //lang nghe , neu thang nghe dong y thi chay stream cua th nghe
          call.on("stream", function (remoteStream) {
            //bat call cau listener
            playVideoStream("remote-stream", remoteStream);
          });
    
          //khi dong modal thi xoa stream
          $("#streamModal").on("hidden.bs.modal", function () {
            closeVideoStream(stream);
            Swal.fire({
              type: "infor",
              title: ` Đã kết thúc cuộc gọi &nbsp; <span style="color:#2ECC71">${response.listenerName}</span>`,
              backdrop: "rgba(85,85,85,0,4)",
              width: "52rem",
              allowOutsideClick: false,
              confirmButtonColor: "#2ecc71",
              confirmButtonText: "Confirm"
            })
          })
        }, function (err) {
          console.log('Failed to get local stream', err);
          if(err.toString()==="NotAllowedError: Permission denied"){
            alertify.notify("Xin lỗi, thiết bị nghe gọi không có sẵn");
          }
        });
      })
    
    
    
      //B14 cua listener: listener accept
    
      socket.on("server-send-accept-call-to-listener", function (response) {
        Swal.close();
        clearInterval(timerInterval);
        let getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia).bind(navigator);
        peer.on('call', function (call) {
          getUserMedia({ video: true, audio: true }, function (stream) {
            //mo streammodal
            $("#streamModal").modal("show");
            //chay video my stream tren local
            playVideoStream("local-stream", stream);
    
            call.answer(stream); // Answer the call with an A/V stream.
    
            //lang nghe stream tu caller gui sang
            call.on("stream", function (remoteStream) {
              //bat stream cua caller
              playVideoStream("remote-stream", remoteStream);
            });
            //khi dong modal thi xoa stream
            $("#streamModal").on("hidden.bs.modal", function () {
              closeVideoStream(stream);
              Swal.fire({
                type: "infor",
                title: ` Đã kết thúc cuộc gọi &nbsp; <span style="color:#2ECC71">${response.callerName}</span>`,
                backdrop: "rgba(85,85,85,0,4)",
                width: "52rem",
                allowOutsideClick: false,
                confirmButtonColor: "#2ecc71",
                confirmButtonText: "Confirm"
              })
    
            })
          }, function (err) {
            console.log('Failed to get local stream', err);
    
            if(err.toString()==="NotAllowedError: Permission denied"){
              alertify.notify("Xin lỗi, thiết bị nghe gọi không có sẵn");
            }
          });
        });
      })
    }
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