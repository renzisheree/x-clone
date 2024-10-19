$(document).ready(() => {
  $.get("/api/posts", (result) => {
    outputPost(result, $(".postContainer"));
  });
});

function outputPost(result, container) {
  container.html("");
  result.forEach((element) => {
    var html = createPostHTML(element);
    container.append(html);
  });
  if (result.length == 0) {
    container.append("<span class='noResults'> Nothing to show </span>");
  }
}
