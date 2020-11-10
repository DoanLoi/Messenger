

function videoChat(divId) {

  $(`#video-chat-${divId}`).unbind("click").on("click", function () {
    let targetId = $(this).data("chat");
    let callerName = $("#navbar-username").text();
    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    };
    //B1:kiem tra xem th kia co online k
    socket.emit("caller-check-listener-online-or-not", dataToEmit);

  })


}



function playVideoStream(videoTagId, stream) {
  let video = document.getElementById(videoTagId);
  console.log(video);
  video.srcObject = stream;
  //khi da load dc stream vao video
  video.onloadeddata = function () {
    video.play();
  }

}

//dong luong stream
function closeVideoStream(stream){
  return stream.getTracks().forEach(track=> track.stop());
}




$(document).ready(function () {
  //B2 cua caller
  socket.on("server-send-listener-is-offline", function () {
    alertify.notify("User is offline", "error", 7);
  })


let iceServerList=$("#ice-server-list").val();


  let getPeerId = "";
  const peer = new Peer({
    key:"peerjs",
    host:"peerjs-server-trungquandev.herokuapp.com",
    secure:true,
    port:443,
    debug:3,
    config:{"iceServers":JSON.parse(iceServerList)}

  });

  peer.on("open", function (peerId) {

    getPeerId = peerId;
  
  })

  //B3 cua listener
  socket.on("server-request-peer-id-of-listener", function (response) {
    let listenerName = $("#navbar-username").text();

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
    Swal.fire({
      title: `Đang gọi cho &nbsp <span style="color:#2ECC71">${response.listenerName}</span> &nbsp &nbsp <i class="fa fa-volume-control-phone"></i>`,
      html: `Thời gian: <strong></strong> s.<br/><br/>
    <button id="btn-cancel-call" class="btn btn-danger">
    Hủy cuộc gói
    </button>`,
      backdrop: "rgba(85,85,85,0,4)",
      witdh: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $("#btn-cancel-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);


          //B7 cua thang caller Huy request call
          socket.emit("caller-cancel-request-call-to-server", dataToEmit);
        })
        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },

      onOpen: () => {
        //B12 cua caller lang nghe sukien listener tu choi
        socket.on("server-send-reject-call-to-listener", function () {
          Swal.close();
          clearInterval(timerInterval);
          Swal.fire({
            type: "infor",
            title: `<span style="color:#2ECC71">${response.listenerName}</span> &nbsp từ chối cuộc gọi`,
            backdrop: "rgba(85,85,85,0,4)",
            width: "52rem",
            allowOutsideClick: false,
            confirmButtonColor: "#2ecc71",
            confirmButtonText: "Confirm"
          })
        })


      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {

      return false;
    })
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

 

    Swal.fire({
      title: `<span style="color:#2ECC71">${response.callerName}</span> &nbsp &nbsp đang gọi cho bạn <i class="fa fa-volume-control-phone"></i>`,
      html: `Thời gian: <strong></strong> s.<br/><br/>
    <button id="btn-reject-call" class="btn btn-danger">
    Từ chối cuộc gói
    </button>
    <button id="btn-accept-call" class="btn btn-success">
      Đồng ý
    </button>`,
      backdrop: "rgba(85,85,85,0,4)",
      witdh: "52rem",
      allowOutsideClick: false,
      timer: 30000,
      onBeforeOpen: () => {
        $("#btn-reject-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);
          //B10 cua listener: tu choi nghe cuoc goi
          socket.emit("listener-reject-request-call-to-server", dataToEmit);



        })

        //Accept call
        $("#btn-accept-call").unbind("click").on("click", function () {
          Swal.close();
          clearInterval(timerInterval);
          //B10 cua listener: tu choi nghe cuoc goi
          socket.emit("listener-accept-request-call-to-server", dataToEmit);



        })

        Swal.showLoading();
        timerInterval = setInterval(() => {
          Swal.getContent().querySelector("strong").textContent = Math.ceil(Swal.getTimerLeft() / 1000);
        }, 1000);
      },
      //modal cua thang nghe dang mo
      onOpen: () => {
        //B9 cua listener :khi thang goi huy thi tat modal
        socket.on("server-send-cancel-request-call-to-listener", function (response) {
          Swal.close();
          clearInterval(timerInterval);
        });



      },
      onClose: () => {
        clearInterval(timerInterval);
      }
    }).then((result) => {

      return false;
    })
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

})