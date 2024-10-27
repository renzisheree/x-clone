//test if document is ready
$(document).ready(() => {});

//disable key when not use
$(document).on("keyup", "#postTextarea, #replyTextarea", function () {
  const textbox = $(this);
  const isModal = textbox.closest(".modal").length === 1;
  const value = textbox.val().trim();
  const submitButton = isModal
    ? $("#submitReplyButton")
    : $("#submitPostButton");

  if (submitButton.length === 0) {
    console.error("No submit button found");
    return;
  }

  submitButton.prop("disabled", value === "");
});

$("#replyModal").on("shown.bs.modal", function () {
  const textbox = $("#replyTextarea");
  const value = textbox.val().trim();
  $("#submitReplyButton").prop("disabled", value === "");
});

$("#replyModal").on("show.bs.modal", (event) => {
  var button = $(event.relatedTarget);
  var postId = getPostIdFromEl(button);

  $("#submitReplyButton").data("id", postId);
  $.get(`/api/posts/${postId}`, (result) => {
    outputPost(result, $("#originalPostContainer"));
  });
});
$("#replyModal").on("hidden.bs.modal", () => {
  $("#originalPostContainer").html("");
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

$(document).on("click", ".post", (event) => {
  var element = $(event.target);
  const postId = getPostIdFromEl(element);
  if (postId !== undefined && !element.is("button")) {
    window.location.href = "/posts/" + postId;
  }
});

$("#submitPostButton, #submitReplyButton").click((event) => {
  var button = $(event.target);
  var isModal = button.parents(".modal").length == 1;

  var textbox = isModal ? $("#replyTextarea") : $("#postTextarea");
  var data = {
    content: textbox.val(),
  };
  if (isModal) {
    const id = button.data().id;
    if (id == null) return alert("id is null");
    data.replyTo = id;
  }
  $.post("/api/posts", data, (postData) => {
    if (postData.replyTo) {
      location.reload();
    } else {
      var html = createPostHTML(postData);
      $(".postContainer").prepend(html);
      textbox.val("");
      button.prop("disabled", true);
    }
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
  const isRetweet = postData.retweetData !== undefined;
  const retweetedBy = isRetweet ? postData.postedBy.username : null;

  postData = isRetweet ? postData.retweetData : postData;
  const postedBy = postData.postedBy;

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
  retweetText = "";
  if (isRetweet) {
    retweetText = `<span>
    <i class="fa-solid fa-retweet"></i>
    Retweet by <a href="/profile/${retweetedBy}">@${retweetedBy}</a>
    
    </span>`;
  }
  var replyFlag = "";
  if (postData.replyTo) {
    if (!postData.replyTo._id) return alert("replyTo not populated");
    else if (!postData.replyTo.postedBy._id)
      return alert("postedBy not populated");
    var replyToUsername = postData.replyTo.postedBy.username;
    replyFlag = `<div class="replyFlag">
    Replying to <a href="/profile/${replyToUsername}">${replyToUsername}</a></div>`;
  }
  return `
  <div class="post" data-id='${postData._id}'>
  <div class='postActionContainer'>${retweetText}</div>
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
               ${replyFlag}
               <div class="postBody">
                  <span>${postData.content}<span>
               </div>
               <div class="postFooter">
                    <div class="postButtonContainer">
                        <button   data-bs-toggle='modal' data-bs-target='#replyModal'>
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
function outputPost(result, container) {
  container.html("");
  if (!Array.isArray(result)) {
    result = [result];
  }
  result.forEach((element) => {
    var html = createPostHTML(element);
    container.append(html);
  });
  if (result.length == 0) {
    container.append("<span class='noResults'> Nothing to show </span>");
  }
}
