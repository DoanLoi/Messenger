


$(document).ready(function () {
  $("#link-read-more-contacts-sent").bind("click", function () {
    console.log("A");
    let skipNumber = $("#request-contact-sent").find("li").length;
    $("#link-read-more-contacts-sent").css("display", "none");
    $(".read-more-contacts-sent-loader").css("display", "inline-block");
    $.get(`/contact/read-more-contacts-sent?skipNumber=${skipNumber}`, function (newContactUsers) {

      if (!newContactUsers.length) {
        alertify.notify("Bạn không còn loi gui moi ket ban", "error", 7);
        $("#link-read-more-contacts-sent").css("display", "inline-block");
        $(".read-more-contacts-sent-loader").css("display", "none");
        return false;

      }
      newContactUsers.forEach(function (user) {

        $("#request-contact-sent").find("ul").append(` <li class="_contactList" data-uid="${user._id}">
        <div class="contactPanel">
            <div class="user-avatar">
                <img src="images/users/${user.avatar}" alt="">
            </div>
            <div class="user-name">
                <p>
                    ${user.username}
                </p>
            </div>
            <br>
            <div class="user-address">
                <span>${user.address == null ? "" : user.address}</span>
            </div>
            <div class="user-remove-request-contact-sent action-danger display-important" data-uid=${user._id}>
                Hủy yêu cầu
            </div>
        </div>
    </li>`)
        $("#link-read-more-contacts-sent").css("display", "inline-block");
        $(".read-more-contacts-sent-loader").css("display", "none");
        removeRequestContactSent();// Huy ket ban
      })
    })
  });
})