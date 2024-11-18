$(document).ready(() => {
  if (selectedTab === "replies") {
    loadReplies();
  } else {
    loadPosts();
  }
});

function loadPosts() {
  $.get("/api/posts", { postedBy: profileUserId, isReply: false }, (result) => {
    outputPost(result, $(".postContainer"));
  });
  $.get("/api/posts", { postedBy: profileUserId, pin: true }, (result) => {
    outputPinPost(result, $(".pinPostContainer"));
  });
}

function loadReplies() {
  $.get("/api/posts", { postedBy: profileUserId, isReply: true }, (result) => {
    outputPost(result, $(".postContainer"));
  });
}

function outputPinPost(result, container) {
  if (result.length == 0) {
    container.hide();
    return;
  }
  container.html("");

  result.forEach((element) => {
    var html = createPostHTML(element);
    container.append(html);
  });
}
