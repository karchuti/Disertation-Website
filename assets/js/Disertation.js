window.onscroll = function () { scrollFunction() };
function scrollFunction() {
  var elementScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrollPos = (elementScroll / windowHeight) * 100;
  document.getElementById("progBar").style.width = scrollPos + "%";
}
window.onscroll = function() {
  scrollFunction();
};

var searchInput = document.getElementById("searchInput");
var searchButton = document.getElementById("searchButton");
var matches = [];
var currentIndex = -1;

searchButton.addEventListener("click", search);
searchInput.addEventListener("input", resetSearch);

function search() {
  var searchTerm = searchInput.value.toLowerCase();
  matches = [];
  currentIndex = -1;

  var textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6");

  for (var i = 0; i < textElements.length; i++) {
    var element = textElements[i];
    var text = element.textContent.toLowerCase();

    if (text.includes(searchTerm)) {
      var match = {
        element: element,
        text: text,
        index: text.indexOf(searchTerm)
      };
      matches.push(match);
    }
  }

  var matchCount = matches.length;
  console.log("Matches found: " + matchCount);

  if (matchCount > 0) {
    currentIndex = 0;
    scrollToMatch();
  }
}

function scrollToMatch() {
  if (currentIndex >= 0 && currentIndex < matches.length) {
    var match = matches[currentIndex];
    var element = match.element;
    var matchIndex = match.index;

    element.scrollIntoView();

    var highlightedText =
      '<span class="highlight">' + searchInput.value + "</span>";
    var updatedText = element.innerHTML.replace(
      new RegExp(searchInput.value, "gi"),
      highlightedText
    );
    element.innerHTML = updatedText;

    var matchNumber = currentIndex + 1;
    var matchCount = matches.length;
    console.log("Match " + matchNumber + " of " + matchCount);
    document.getElementById("matchCount").textContent =
      "Match " + matchNumber + " of " + matchCount;
  }
}

function removeHighlighting() {
  var elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6");
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    element.innerHTML = element.textContent;
  }
}

function resetSearch() {
  removeHighlighting();
  matches = [];
  currentIndex = -1;
  document.getElementById("matchCount").textContent = "";
}

function scrollToPreviousMatch() {
  if (currentIndex > 0) {
    currentIndex--;
    removeHighlighting();
    scrollToMatch();
    updateCurrentMatch();
  }
}

function scrollToNextMatch() {
  if (currentIndex < matches.length - 1) {
    currentIndex++;
    removeHighlighting();
    scrollToMatch();
    updateCurrentMatch();
  }
}

document.getElementById("previousButton").addEventListener("click", scrollToPreviousMatch);

document.getElementById("nextButton").addEventListener("click", scrollToNextMatch);


function updateCurrentMatch() {
  var matchNumber = currentIndex + 1;
  var matchCount = matches.length;
  document.getElementById("currentMatch").textContent =
    "Match " + matchNumber + " of " + matchCount;
}


