var api = "https://gateway.holdstation.com/services/launchpad/api/staking/wallets?list=";
var fetchInProgress = false;
var input,inputArray;
console.log(input,inputArray)
var resultTable = document.getElementById("result");

document.getElementById('searchButton').addEventListener('click', results);
document.getElementById('addToWatchlistButton').addEventListener('click', addToWatchlist);

// Load watchlist from localStorage
var watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
});

function processAddress(address) {
  var api_address = api + address;
  resultTable.innerHTML = "";
  
  var headerRow = document.createElement("tr");
  
  var addressHeader = document.createElement("th");
  addressHeader.textContent = "Address";
  headerRow.appendChild(addressHeader);
  
  var pendingRewardHeader = document.createElement("th");
  pendingRewardHeader.textContent = "Pending Reward";
  headerRow.appendChild(pendingRewardHeader);
  
  var harvestedRewardHeader = document.createElement("th");
  harvestedRewardHeader.textContent = "Harvested Reward";
  headerRow.appendChild(harvestedRewardHeader);
  
  resultTable.appendChild(headerRow);

  if (fetchInProgress) {
    // If fetch is in progress, ignore the click
    return;
  }
  fetchInProgress=true;
  fetch(api_address)
    .then(response => response.json())
    .then(data => {
      if (data.length > 0) {
        var dataRow = document.createElement("tr");

        var addressCell = document.createElement("td");
        addressCell.textContent = data[0].address;
        dataRow.appendChild(addressCell);

        var pendingRewardCell = document.createElement("td");
        pendingRewardCell.textContent = data[0].pendingReward;
        dataRow.appendChild(pendingRewardCell);

        var harvestedRewardCell = document.createElement("td");
        harvestedRewardCell.textContent = data[0].harvestedReward;
        dataRow.appendChild(harvestedRewardCell);

        resultTable.appendChild(dataRow);

        // Add the address to the watchlist
      } else {
        alert(`No data found for address: ${address}`);
      }
    })
    .then(()=>{
      if (!watchlist.includes(address)) {
        watchlist.push(address);
        updateWatchlist();
        saveWatchlistToLocalStorage();
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
    fetchInProgress=false;
}

function results() {
input = document.getElementById("Input").value.trim();
inputArray = input.split(",");
console.log(inputArray)
  for (let address of inputArray) {
    console.log(address);
    processAddress(address);
  }

}

function addToWatchlist() {
input = document.getElementById("Input").value.trim();
inputArray = input.split(",");
  if (input !== '') {
    for (let address of inputArray) {
      if (!watchlist.includes(address)) {
        watchlist.push(address);
      }
    }
    updateWatchlist();
    saveWatchlistToLocalStorage();
  }
}

function removeFromWatchlist(address) {
  watchlist = watchlist.filter(item => item !== address);
  updateWatchlist();
  saveWatchlistToLocalStorage();
}

function updateWatchlist() {
  var watchlistItems = document.getElementById("watchlistItems");
  watchlistItems.innerHTML = ""; // Clear existing watchlist items

  watchlist.forEach(function (address) {
    var listItem = document.createElement("li");
    listItem.textContent = address;

    var watchlistBtn = document.createElement('div');
    var searchBtn = document.createElement('button');
    searchBtn.textContent = 'Search';
    searchBtn.onclick = function () {
      processAddress(address);
    }
    var deleteBtn = document.createElement("button");
    deleteBtn.classList = 'delete';
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = function () {
      removeFromWatchlist(address);
    };
    watchlistBtn.appendChild(searchBtn);
    watchlistBtn.appendChild(deleteBtn);
    listItem.appendChild(watchlistBtn);
    watchlistItems.appendChild(listItem);
  });
}

function saveWatchlistToLocalStorage() {
  localStorage.setItem('watchlist', JSON.stringify(watchlist));
}

// Initial load of watchlist
updateWatchlist();
