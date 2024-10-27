$(document).ready(() => {
  $.get(`/api/posts/${postId}`, (result) => {
    outputPost(result, $(".postContainer"));
  });
});
