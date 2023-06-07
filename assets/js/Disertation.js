var searchButton = document.getElementById("search-button");
var clearButton = document.getElementById("clear-button");
var matchCount = document.getElementById("match-count");
var previousButton = document.getElementById("previous-button");
var nextButton = document.getElementById("next-button");

clearButton.classList.add("hidden"); // Initially hide the clear button
matchCount.classList.add("hidden"); // Initially hide the match count
previousButton.classList.add("hidden"); // Initially hide the previous match button
nextButton.classList.add("hidden"); // Initially hide the next match button

var highlightedElements = []; // Array to store the highlighted elements
var currentIndex = -1; // Current index of the highlighted element

searchButton.addEventListener("click", function () {
  var input = document.getElementById("search-input").value;
  var elementsToSearch = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, label, span");
  var count = 0; // Initialize the match count

  // Validate input
  if (input.trim() === "") {
    // Display an error message or take appropriate action
    alert("Please enter a search term.");
    return;
  }

  // Run the clear function to remove previous highlights
  clearSearchResults();

  for (var i = 0; i < elementsToSearch.length; i++) {
    var element = elementsToSearch[i];
    var text = element.innerText;

    if (text.includes(input)) {
      var regex = new RegExp("(\\b" + input + "\\b)", "gi");
      var highlightedText = text.replace(regex, function (match) {
        count++; // Increment the match count for each match
        return "<span class='highlight'>" + match + "</span>";
      });

      element.innerHTML = highlightedText;

      // Store the highlighted element in the array
      highlightedElements.push(element);
    }
  }

  if (count > 0) {
    matchCount.textContent = count + " match(es) found";
    matchCount.classList.remove("hidden"); // Show the match count
    previousButton.classList.remove("hidden"); // Show the previous match button
    nextButton.classList.remove("hidden"); // Show the next match button
    clearButton.classList.remove("hidden"); // Show the clear button
    searchButton.classList.add("hidden"); // Hide the search button
    currentIndex = -1; // Reset the current index
    scrollToNextMatch(); // Scroll to the first match and highlight it
  } else {
    alert("No matches found.");
  }

  // Preserve the search input value
  document.getElementById("search-input").value = input;
});

clearButton.addEventListener("click", clearSearchResults);

previousButton.addEventListener("click", function () {
  if (currentIndex > 0) {
    // Remove the current highlight from the previous highlighted element
    highlightedElements[currentIndex].querySelector(".highlight").classList.remove("current-highlight");
    currentIndex--;
    // Add the current highlight to the new current highlighted element
    highlightedElements[currentIndex].querySelector(".highlight").classList.add("current-highlight");
    scrollToElement(highlightedElements[currentIndex]);
  }
});

nextButton.addEventListener("click", function () {
  if (currentIndex < highlightedElements.length - 1) {
    // Remove the current highlight from the previous highlighted element
    highlightedElements[currentIndex].querySelector(".highlight").classList.remove("current-highlight");
    currentIndex++;
    // Add the current highlight to the new current highlighted element
    highlightedElements[currentIndex].querySelector(".highlight").classList.add("current-highlight");
    scrollToElement(highlightedElements[currentIndex]);
  }
});

function clearSearchResults() {
  var elementsToClear = document.querySelectorAll(".highlight");

  for (var i = 0; i < elementsToClear.length; i++) {
    var element = elementsToClear[i];
    element.outerHTML = element.innerText;
  }

  document.getElementById("search-input").value = "";
  clearButton.classList.add("hidden"); // Hide the clear button
  matchCount.classList.add("hidden"); // Hide the match count
  previousButton.classList.add("hidden"); // Hide the previous match button
  nextButton.classList.add("hidden"); // Hide the next match button
  searchButton.classList.remove("hidden"); // Show the search button
  highlightedElements = []; // Clear the highlighted elements array
  currentIndex = -1; // Reset the current index
}

function scrollToNextMatch() {
  currentIndex = 0; // Set the current index to the first match
  // Add the current highlight to the first match
  highlightedElements[currentIndex].querySelector(".highlight").classList.add("current-highlight");
  scrollToElement(highlightedElements[currentIndex]);
}

function scrollToElement(element) {
  element.scrollIntoView({ behavior: "smooth" });
}
