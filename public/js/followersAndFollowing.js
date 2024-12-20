$(document).ready(() => {
  if (selectedTab == "followers") {
    loadFollowers();
  } else {
    loadFollowing();
  }
});

function loadFollowing() {
  $.get(`/api/users/${profileUserId}/following`, (results) => {
    outputUsers(results.following, $(".resultsContainer"));
  });
}

function loadFollowers() {
  $.get(`/api/users/${profileUserId}/followers`, (results) => {
    outputUsers(results.followers, $(".resultsContainer"));
  });
}

function outputUsers(results, container) {
  container.html("");
  results.forEach((result) => {
    var html = createUserHTML(result, true);
    container.append(html);
  });
  if (results.length == 0) {
    container.append("<span class='noResults'>No results found</span>");
  }
}

function createUserHTML(userData, showFollowButton) {
  var name = userData.firstName + " " + userData.lastName;
  var isFollowing =
    userLoggedIn.following &&
    Array.isArray(userLoggedIn.following) &&
    userLoggedIn.following.includes(userData._id);

  var text = !isFollowing ? "Follow" : "Following";
  var buttonClass = isFollowing ? "followButton following" : "followButton";
  var followButton = "";
  if (showFollowButton && userLoggedIn._id != userData._id) {
    followButton = `<div class='followButtonContainer'>
        <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
    </div>`;
  }

  return `<div class="user">
        <div class='userImageContainer'>
            <img src='${userData.profilePic}' alt="profilePic" />
        </div>
        <div class='userDetailContainer'>
            <div className="header">
                <a href="/profile/${userData.username}">${name}</a>
                <span class='username'>@${userData.username}</span>
            </div>
            </div>
            ${followButton}
    </div>`;
}
