document.addEventListener("DOMContentLoaded", function() {
    var titleLink = document.querySelectorAll("nav h2 a");
    var href = titleLink[0].href;
    href = href.substring(0, href.lastIndexOf("/"));
    href += '/../../../../index.html';

    titleLink[0].href = href;
});
