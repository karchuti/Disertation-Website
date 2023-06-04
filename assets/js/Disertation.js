window.onscroll = function () { scrollFunction() };
function scrollFunction() {
  var elementScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrollPos = (elementScroll / windowHeight) * 100;
  document.getElementById("progBar").style.width = scrollPos + "%";
}

// /////////////////////////////////////////////////////////////////////////////////////////////////////////

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  var elementScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrollPos = (elementScroll / windowHeight) * 100;
  document.getElementById("progBar").style.width = scrollPos + "%";
}

window.onscroll = function() {
  scrollFunction();
};

var searchTerm = "";

function scrollFunction() {
  var elementScroll = document.body.scrollTop || document.documentElement.scrollTop;
  var windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var scrollPos = (elementScroll / windowHeight) * 100;
  document.getElementById("progBar").style.width = scrollPos + "%";
}

var searchIndex = 0;
var searchResults = [];

document
  .getElementById("searchButton")
  .addEventListener("click", performSearch);
document
  .getElementById("nextButton")
  .addEventListener("click", goToNextResult);
document
  .getElementById("prevButton")
  .addEventListener("click", goToPrevResult);
document
  .getElementById("searchInput")
  .addEventListener("input", enableSearchButton);

function performSearch() {
  searchTerm = document.getElementById("searchInput").value.trim();

  searchResults = [];
  removeHighlights();

  if (searchTerm !== "") {
    var elementsToSearch = document.querySelectorAll("h1, h2, p");

    for (var i = 0; i < elementsToSearch.length; i++) {
      var elementText = elementsToSearch[i].textContent;

      if (
        elementText.toLowerCase().includes(searchTerm.toLowerCase()) &&
        isHighlightedElement(elementsToSearch[i])
      ) {
        var regex = new RegExp(searchTerm, "gi");
        var matches = elementText.matchAll(regex);

        for (var match of matches) {
          var matchIndex = match.index;
          var matchLength = match[0].length;

          searchResults.push({
            element: elementsToSearch[i],
            index: matchIndex,
            length: matchLength,
          });
        }
      }
    }

    if (searchResults.length > 0) {
      searchIndex = 0;
      highlightAllMatches();
      showSearchResult(searchIndex);
      document.getElementById("nextButton").disabled = false;
      document.getElementById("prevButton").disabled = false;
    } else {
      document.getElementById("searchResults").innerHTML = "No results found.";
      document.getElementById("nextButton").disabled = true;
      document.getElementById("prevButton").disabled = true;
    }
  } else {
    document.getElementById("searchResults").innerHTML = "";
    document.getElementById("nextButton").disabled = true;
    document.getElementById("prevButton").disabled = true;
  }
}

function goToNextResult() {
  searchIndex++;
  if (searchIndex >= searchResults.length) {
    searchIndex = 0;
  }
  showSearchResult(searchIndex);
}

function goToPrevResult() {
  searchIndex--;
  if (searchIndex < 0) {
    searchIndex = searchResults.length - 1;
  }
  showSearchResult(searchIndex);
}

function enableSearchButton() {
  var searchTerm = document.getElementById("searchInput").value.trim();
  document.getElementById("searchButton").disabled = searchTerm === "";
}

function highlightAllMatches() {
  for (var i = 0; i < searchResults.length; i++) {
    var result = searchResults[i];
    var element = result.element;
    var start = result.index;
    var length = result.length;

    var text = element.textContent;
    var highlightedText =
      text.substring(0, start) +
      '<span class="highlight">' +
      text.substring(start, start + length) +
      "</span>" +
      text.substring(start + length);

    element.innerHTML = highlightedText;
  }
}

function showSearchResult(index) {
  var result = searchResults[index];
  var element = result.element;

  if (index > 0) {
    var previousMatch = searchResults[index - 1].element;
    var previousMatches = previousMatch.querySelectorAll(".highlight");
    previousMatches.forEach(function (match) {
      match.classList.remove("highlight");
      match.style.fontWeight = "normal";
    });
  }

  var currentMatches = element.querySelectorAll(".highlight");
  currentMatches.forEach(function (match) {
    match.classList.add("highlight");
    match.style.fontWeight = "bold";
  });

  element.scrollIntoView({ behavior: "smooth", block: "center" });
}

function removeHighlights() {
  var highlightedElements = document.querySelectorAll(".highlight");
  highlightedElements.forEach(function (element) {
    var parentElement = element.parentNode;
    var text = element.textContent;
    var textNode = document.createTextNode(text);
    parentElement.replaceChild(textNode, element);
  });
}

function isHighlightedElement(element) {
  var excludedTags = ["LABEL", "A"];
  var tagName = element.tagName;
  return !excludedTags.includes(tagName.toUpperCase());
}
