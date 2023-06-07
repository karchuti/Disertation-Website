var searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Search";
searchInput.style.position = "fixed";
searchInput.style.top = "10px";
searchInput.style.left = "10px";
searchInput.style.padding = "5px";
searchInput.style.border = "1px solid #ccc";
searchInput.style.borderRadius = "4px";
searchInput.style.zIndex = "9999";

document.body.appendChild(searchInput);

var clearButton = document.createElement("button");
clearButton.textContent = "Clear";
clearButton.style.position = "fixed";
clearButton.style.top = "10px";
clearButton.style.left = "calc(10px + " + searchInput.offsetWidth + "px + 5px)";
clearButton.style.padding = "5px 10px";
clearButton.style.border = "1px solid #ccc";
clearButton.style.borderRadius = "4px";
clearButton.style.backgroundColor = "#fff";
clearButton.style.zIndex = "9999";
clearButton.style.display = "none";

document.body.appendChild(clearButton);

var matchCount = document.createElement("div");
matchCount.id = "match-count";
matchCount.style.position = "fixed";
matchCount.style.top = "30px";
matchCount.style.left = "10px";
matchCount.style.padding = "5px 10px";
matchCount.style.backgroundColor = "#fff";
matchCount.style.border = "1px solid #ccc";
matchCount.style.borderRadius = "4px";
matchCount.style.zIndex = "9999";
matchCount.style.display = "none";

document.body.appendChild(matchCount);

searchInput.addEventListener("input", function () {
  var searchText = searchInput.value.trim().toLowerCase();
  var elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, label, span");
  var count = 0;

  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    var text = element.innerText.toLowerCase();
    var regex = new RegExp("(" + searchText + ")", "gi");

    if (text.includes(searchText)) {
      var highlightedText = text.replace(regex, "<span class='highlight'>$1</span>");
      element.innerHTML = highlightedText;
      count++;
    } else {
      element.innerHTML = text;
    }
  }

  if (searchText === "") {
    clearSearchResults();
  }

  showMatchCount(count);
  toggleClearButton(searchText);
});

clearButton.addEventListener("click", function () {
  searchInput.value = "";
  searchInput.focus();
  clearSearchResults();
  toggleClearButton("");
});

function clearSearchResults() {
  var elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, label, span");

  for (var i = 0; i < elements.length; i++) {
    elements[i].innerHTML = elements[i].innerText;
  }

  searchInput.value = "";
  searchInput.focus();
  matchCount.style.display = "none";
  toggleClearButton("");
}

function showMatchCount(count) {
  if (count > 0 && searchInput.value.trim() !== "") {
    matchCount.textContent = count + " match(es) found";
    matchCount.style.display = "block";
  } else {
    matchCount.style.display = "none";
  }
}

function toggleClearButton(searchText) {
  if (searchText === "") {
    clearButton.style.display = "none";
  } else {
    clearButton.style.display = "block";
  }
}
