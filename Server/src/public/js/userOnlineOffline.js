//B1: lang nghe su kien tra ve list userid nguoi dung online s
socket.on("server-send-list-users-online", function (listUsersIds) {
  listUsersIds.forEach(userId => {
    //Tim trong leftside nhung useris co roi bat online
    $(`.person[data-chat=${userId}]`).find(`div.dot`).addClass("online");
    $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");


  });

})

socket.on("server-send-when-new-user-online", function (userId) {
  $(`.person[data-chat=${userId}]`).find(`div.dot`).addClass("online");
  $(`.person[data-chat=${userId}]`).find("img").addClass("avatar-online");
})
socket.on("server-send-when-new-user-offline", function (userId) {
  $(`.person[data-chat=${userId}]`).find(`div.dot`).removeClass("online");
  $(`.person[data-chat=${userId}]`).find("img").removeClass("avatar-online");
})
