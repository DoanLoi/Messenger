function increaseNumberMessageGroup(divId){
  let currentValue=$(`.right[data-chat=${divId}]`).find(".show-number-message").text();
  currentValue=+currentValue;
  currentValue+=1;
  $(`.right[data-chat=${divId}]`).find(".show-number-message").text(currentValue);

}
