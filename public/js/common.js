//test if document is ready
$(document).ready(() => {});
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

$(document).on("click", ".likeButton", (event) => {
  var button = $(event.target);
  var postId = getPostIdFromEl(button);
  if (postId === undefined) return;

  $.ajax({
    url: `/api/posts/${postId}/like`,
    type: "PUT",
    success: (postData) => {
      button.find("span").text(postData.likes.length || "");
      if (postData.likes.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
    error: (error) => {
      console.error("Error liking post:", error);
    },
  });
});

$(document).on("click", ".retweetButton", (event) => {
  var button = $(event.target);
  var postId = getPostIdFromEl(button);
  if (postId === undefined) return;

  $.ajax({
    url: `/api/posts/${postId}/retweet`,
    type: "POST",
    success: (postData) => {
      button.find("span").text(postData.retweetUsers.length || "");
      if (postData.retweetUsers.includes(userLoggedIn._id)) {
        button.addClass("active");
      } else {
        button.removeClass("active");
      }
    },
    error: (error) => {
      console.error("Error retweet:", error);
    },
  });
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
    button.prop("disabled", true);
  });
});

function timeDifference(current, previous) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) return "Just now";
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return Math.round(elapsed / msPerYear) + " years ago";
  }
}

function getPostIdFromEl(el) {
  var isRoot = el.hasClass("post");
  var rootEl = isRoot ? el : el.closest(".post");
  var postId = rootEl.data("id");
  if (postId === undefined) return alert("post id undefined");
  return postId;
}

function createPostHTML(postData) {
  var postedBy = postData.postedBy;
  if (postedBy._id === undefined) {
    return console.log("User object not populated");
  }
  var displayName = postedBy.firstName + " " + postedBy.lastName;
  var timeStamp = timeDifference(new Date(), new Date(postData.createdAt));
  const likeButtonActiveClass = postData.likes.includes(userLoggedIn._id)
    ? "active"
    : "";
  const retweetButtonActiveClass = postData.retweetUsers.includes(
    userLoggedIn._id
  )
    ? "active"
    : "";
  return `
  <div class="post" data-id='${postData._id}'>
        <div class="mainContentContainer">
            <div class="userImageContainer">
              <img src='${postedBy.profilePic}'/>
            </div>
            <div class="postContentContainer">
               <div class="postHeader">
                    <a href="/profile/${
                      postedBy.username
                    }" class="displayName">${displayName}<a/>
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
                      <div class="postButtonContainer green">
                        <button class="retweetButton ${retweetButtonActiveClass}">
                            <i class="fa-solid fa-retweet"></i>
                             <span>${postData.retweetUsers.length || ""} </span>
                        </button>
                    </div>
                      <div class="postButtonContainer red">
                        <button class='likeButton ${likeButtonActiveClass}'>
                            <i class="fa-regular fa-heart"></i>
                            <span>${postData.likes.length || ""} </span>
                        </button>
                    </div>
               </div>
            </div>
        </div>
  </div>`;
}
