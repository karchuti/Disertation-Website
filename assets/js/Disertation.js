var searchInput = document.createElement("input");
searchInput.ariaLabel = "search-box";
searchInput.type = "text";
searchInput.placeholder = "Search";
searchInput.style.cssText =
  "position: fixed; top: 10px; left: 10px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; z-index: 2;";

document.body.appendChild(searchInput);

var clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.style.cssText =
  "position: fixed; top: 10px; left: calc(10px + " +
  searchInput.offsetWidth +
  "px + 5px); padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; z-index: 2; display: none;";

document.body.appendChild(clearButton);

var nextButton = document.createElement("button");
nextButton.style.cssText =
  "position: fixed; top: 10px; left: calc(10px + " +
  searchInput.offsetWidth +
  "px + 105px); padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; z-index: 2; display: none;";
nextButton.textContent = "→";

document.body.appendChild(nextButton);

var previousButton = document.createElement("button");
previousButton.style.cssText =
  "position: fixed; top: 10px; left: calc(10px + " +
  searchInput.offsetWidth +
  "px + 65px); padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; z-index: 2; display: none;";
previousButton.textContent = "←";

document.body.appendChild(previousButton);

var matchCount = document.createElement("div");
matchCount.id = "match-count";
matchCount.style.cssText =
  "position: fixed; top: 45px; left: 10px; padding: 5px 10px; border: 1px solid #ccc; border-radius: 4px; z-index: 2; display: none;";

document.body.appendChild(matchCount);

var searchResults = [];
var currentIndex = -1;

searchInput.addEventListener("input", function () {
  var searchText = searchInput.value.trim();
  var elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span");
  var count = 0;
  searchResults = [];
  currentIndex = -1;

  if (searchText === "") {
    clearSearchResults();
    return;
  }

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var text = element.textContent;

    var regex = new RegExp("(?<!\\w)" + escapeRegExp(searchText) + "(?!\\w)", "gi");
    var match = text.match(regex);

    if (match) {
      var resultElement = document.createElement(element.tagName);

      for (var j = 0; j < match.length; j++) {
        var highlightedText = document.createElement("span");
        highlightedText.className = "highlight";
        highlightedText.textContent = match[j];
        var regexCaseSensitive = new RegExp("(?<!\\w)" + escapeRegExp(match[j]) + "(?!\\w)", "g");
        text = text.replace(regexCaseSensitive, highlightedText.outerHTML);
      }

      resultElement.innerHTML = text;

      // Copy attributes from the original element to the new result element
      Array.from(element.attributes).forEach(function (attr) {
        resultElement.setAttribute(attr.name, attr.value);
      });

      // Replace the original element with the new result element
      element.parentNode.replaceChild(resultElement, element);

      searchResults.push({
        element: resultElement,
        originalText: element.textContent,
      });

      count++;
    } else {
      element.innerHTML = element.textContent;
    }
  }

  highlightCurrentIndex();
  showMatchCount(searchResults.length);
  toggleClearButton(searchText);
  showNavigationButtons();
  reloadCSS();
});

searchInput.addEventListener("keydown", function (event) {
  if (searchInput.value === "") {
    clearSearchResults();
    reloadCSS();
  }

  if (searchInput.value.length === 1 && event.key === "Backspace") {
    clearSearchResults();
    toggleClearButton("");
    reloadCSS();
  }
});

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  searchInput.focus();
  clearSearchResults();
  toggleClearButton("");
  reloadCSS();
});

nextButton.addEventListener("click", function () {
  if (searchResults.length > 0) {
    currentIndex = (currentIndex + 1) % searchResults.length;
    highlightCurrentIndex();
  }
});

previousButton.addEventListener("click", function () {
  if (searchResults.length > 0) {
    currentIndex = (currentIndex - 1 + searchResults.length) % searchResults.length;
    highlightCurrentIndex();
  }
});

function clearSearchResults() {
  for (var i = 0; i < searchResults.length; i++) {
    var result = searchResults[i];
    var element = result.element;

    element.innerHTML = result.originalText;
    element.classList.remove("current");
  }

  // Clear highlight border from all elements
  var highlightedElements = document.querySelectorAll(".highlight-border");
  highlightedElements.forEach(function (element) {
    element.classList.remove("highlight-border");
  });

  searchInput.value = "";
  searchInput.focus();
  matchCount.style.display = "none";
  nextButton.style.display = "none";
  previousButton.style.display = "none";
  currentIndex = -1;
  toggleClearButton("");
}

function showMatchCount(count) {
  if (count > 0 && searchInput.value.trim() !== "") {
    currentIndex = 0; // Initialize currentIndex as 0
    var currentIndexDisplay = currentIndex + 1;
    var totalMatches = searchResults.length;
    matchCount.textContent = currentIndexDisplay + " of " + totalMatches + " matches found";
    matchCount.style.display = "block";
  } else {
    matchCount.style.display = "none";
  }
}

function toggleClearButton(searchText) {
  clearButton.style.display = searchText === "" ? "none" : "block";
}

function showNavigationButtons() {
  if (searchResults.length > 0) {
    nextButton.style.display = "block";
    previousButton.style.display = "block";
    currentIndex = 0; // Set currentIndex to 0
    highlightCurrentIndex(); // Highlight the current index
  } else {
    nextButton.style.display = "none";
    previousButton.style.display = "none";
  }
}

function highlightCurrentIndex() {
  var highlightedElements = document.querySelectorAll(".highlight-border");

  // Remove highlight border from all elements
  highlightedElements.forEach(function (element) {
    element.classList.remove("highlight-border");
  });

  if (currentIndex >= 0 && currentIndex < searchResults.length) {
    var result = searchResults[currentIndex];
    var element = result.element;

    if (element.classList.contains("content1-card-overlay")) {
      element = element.closest(".content1-card");
    } else if (element.classList.contains("subtitle")) {
      element = element.closest(".content2-card .body");
    }

    if (element) {
      element.classList.add("highlight-border");
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // Update the match count display
  var currentIndexDisplay = currentIndex + 1;
  var totalMatches = searchResults.length;
  matchCount.textContent = currentIndexDisplay + " of " + totalMatches + " matches found";
  matchCount.style.display = "block";
}

function reloadCSS() {
  var links = document.getElementsByTagName("link");
  for (var i = 0; i < links.length; i++) {
    var href = links[i].href;
    links[i].href = href;
  }
}

// Helper function to escape special characters in regex
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
