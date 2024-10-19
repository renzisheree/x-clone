//test if document is ready
$(document).ready(() => {
  alert("John Doe");
});
$("#postTextarea").keyup((event) => {
  var textbox = $(event.target);
  var value = textbox.val().trim();
  var submitButton = $("#submitPostButton");
  if (submitButton.length == 0) return alert("No submit button sign");
  if (value == "") {
    submitButton.prop("disabled", true);
    return;
  }
  submitButton.prop("disabled", false);
});

$("#submitPostButton").click((event) => {
  var button = $(event.target);
  var textbox = $("#postTextarea");

  var data = {
    content: textbox.val(),
  };
  $.post("/api/posts", data, (postData) => {
    var html = createPostHTML(postData);
    $(".postContainer").prepend(html);
    textbox.val("");
    button.prop("disable", true);
  });
});

function createPostHTML(postData) {
  var postedBy = postData.postedBy;
  var displayName = postedBy.firstName + " " + postedBy.lastName;
  var timeStamp = "will do later";
  return `
  <div class="post">
        <div class="mainContentContainer">
            <div class="userImageContainer">
              <img src='${postedBy.profilePic}'/>
            </div>
            <div class="postContentContainer">
               <div class="postHeader">
                    <a href="/profile/${postedBy.username}" class="displayName">${displayName}<a/>
                    <span class="username"> @${postedBy.username}
                    </span>
                      <span class="date"> ${timeStamp}
                    </span>
               </div>
               <div class="postBody">
                  <span>${postData.content}<span>
               </div>
               <div class="postFooter">
                    <div class="postButtonContainer">
                        <button>
                            <i class="fa-regular fa-comment"></i>
                        </button>
                    </div>
                      <div class="postButtonContainer">
                        <button>
                            <i class="fa-solid fa-retweet"></i>
                        </button>
                    </div>
                      <div class="postButtonContainer">
                        <button>
                            <i class="fa-regular fa-heart"></i>
                        </button>
                    </div>
               </div>
            </div>
        </div>
  </div>`;
}
