let beers = document.getElementById("beers");
let beerBar = document.getElementById("beerBar");
let randomBeer = document.getElementById("randomBeer");
let mainContainer = document.getElementById("mainContainer");
var beersContent = document.getElementById("beersContent");
let sortPages = document.getElementById("sortPages");
let pageDiv = document.getElementById("pageDiv");
let printRandomBeer = document.getElementById("showRandomBeer");
let showMoreDetailsCard = document.getElementById("showMoreDetails");
let printSearchInputBeer = document.getElementById("searchInputBeer");
let pageNumber = 1;
let beersPerPage = 5;

beers.addEventListener("click", function () {
  printRandomBeer.innerHTML = "";
  printSearchInputBeer.innerHTML = "";

  sortPages.innerHTML = `
        <select id="pageSize" onchange="pageSizeChange()">
            <option value="" disabled selected hidden>Page Size</option>
            <option value="5">Show 5</option>
            <option value="10">Show 10</option>
            <option value="15">Show 15</option>
        </select>
        <select id="sortBy" onchange="getBeers(this.value)">
            <option value="" disabled selected hidden>Sort by</option>
            <option value="name" id="name">Name</option>
            <option value="alcohol" id="alcohol">Alcohol %</option>
            <option value="bitterness" id="bitterness">Bitterness</option>
        </select>
        `;

  pageDiv.innerHTML = `
        <nav id="pageNum">
        <ul class="pagination">
            <li class="page-item" onclick="goPreviousPage()">
                <a class="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
            <li class="page-item" onclick="goNextPage()">
            <a class="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        </ul>
        </nav>
        `;
  getBeers();
});

randomBeer.addEventListener("click", function () {
  pageDiv.innerHTML = "";
  beersContent.innerHTML = "";
  showMoreDetailsCard.innerHTML = "";
  printSearchInputBeer.innerHTML = "";
  getRandomBeer();
});

beerBar.addEventListener("click", function () {
  location.href = "./index.html";
});

function getBeers(sortBy) {
  $.ajax({
    url: `https://api.punkapi.com/v2/beers?page=${pageNumber}&per_page=${beersPerPage}`,
    success: function (response) {
      console.log(response);
      mainContainer.style.display = "none";
      beersContent.innerHTML = "";
      showMoreDetailsCard.innerHTML = "";

      let shouldSort = sortBy !== "";

      if (shouldSort) {
        response = performSorting(sortBy, response);
      }

      let printBeers;
      for (let beer of response) {
        printBeers = document.createElement("card");
        printBeers.innerHTML = "";
        printBeers.innerHTML += `
                    <div class="card" style="width: 20rem;">
                    <img src="${beer.image_url}" class="beerImg" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${beer.name}</h5>
                        <p class="card-text">${beer.description}</p>
                        <br>
                        <p class="card-text">Alcohol: ${beer.abv}%</p>
                        <p class="card-text">Bitterness: ${beer.ibu}</p>
                        <p class="card-text">Production date: ${beer.first_brewed}</p>
                        <a href="#" class="btn btn-primary" onclick="showMoreDetails(${beer.id})">More Details</a>
                    </div>
                </div>
                `;
        beersContent.innerHTML += printBeers.innerHTML;
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

function pageSizeChange() {
  const newPageSize = document.getElementById("pageSize").value;
  beersPerPage = newPageSize;
  getBeers();
};

function goNextPage() {
  pageNumber++;
  getBeers();
};

function goPreviousPage() {
  if (pageNumber === 1) {
    return;
  } else {
    pageNumber--;
    getBeers();
  }
};

function performSorting(sortBy, response) {
  switch (sortBy) {
    case "name":
      sortByName(response);
      break;
    case "alcohol":
      sortByAlcohol(response);
      break;
    case "bitterness":
      sortByBitterness(response);
      break;
  }
  return response;
};

function sortByName(response) {
  response.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  });
};

function sortByAlcohol(response) {
  response.sort((a, b) => {
    if (a.abv < b.abv) {
      return -1;
    }
    if (a.abv > b.abv) {
      return 1;
    }
    return 0;
  });
};

function sortByBitterness(response) {
  response.sort((a, b) => {
    if (a.ibu < b.ibu) {
      return -1;
    }
    if (a.ibu > b.ibu) {
      return 1;
    }
    return 0;
  });
};

function showMoreDetails(id) {
  $.ajax({
    url: `https://api.punkapi.com/v2/beers/${id}`,
    success: function (response) {
      console.log(response);

      pageDiv.innerHTML = "";
      sortPages.innerHTML = "";
      printRandomBeer.innerHTML = "";
      beersContent.innerHTML = "";

      for (let beer of response) {
        let showMoreDetailsCard = document.getElementById("showMoreDetails");
        let moreDetailsCard = document.createElement("card");
        moreDetailsCard.innerHTML += `<div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
      <div class="col-md-4">
      <img src="${beer.image_url}" class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8">
      <div class="card-body">
      <h5 class="card-name">${beer.name}</h5>
      <p class="card-desc">${beer.description}</p>
      <br>
      <p class="card-tagline">${beer.tagline}</p>
      <br>
      <p class="card-brewed">Brewed: ${beer.first_brewed}</p>
      <br>
      <p class="card-alcohol">Alcohol: ${beer.abv}%</p>
      <br>
      <p class="card-bitterness">Bitterness: ${beer.ibu} IBU</p>
      <br>
      <h3 class="food_pairing"><b>Food Pairing</b></h3>
      <br>
      <p class="foods">
          1. ${beer.food_pairing[0]}
          <br>
          2. ${beer.food_pairing[1]}
          <br>
          3. ${beer.food_pairing[2]}
      </p>
      </div>
      </div>
      </div>
      </div>`;
        showMoreDetailsCard.innerHTML = moreDetailsCard.innerHTML;
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

function getRandomBeer() {
  $.ajax({
    url: `https://api.punkapi.com/v2/beers/random`,
    success: function (response) {
      console.log(response);
      beersContent.innerHTML = "";
      sortPages.innerHTML = "";

      let printRandomBeer = document.getElementById("showRandomBeer");
      for (let beer of response) {
        console.log(beer);
        mainContainer.style.display = "none";
        printRandomBeer.innerHTML = "";

        printRandomBeer.innerHTML += `
            <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
            <div class="col-md-4">
            <img src="${beer.image_url}" class="img-fluid rounded-start" alt="...">
            </div>
            <div class="col-md-8">
            <div class="card-body">
            <h5 class="card-name">${beer.name}</h5>
            <p class="card-desc">${beer.description}</p>
            <br>
            <p class="card-tagline">${beer.tagline}</p>
            <br>
            <p class="card-brewed">Brewed: ${beer.first_brewed}</p>
            <br>
            <p class="card-alcohol">Alcohol: ${beer.abv}%</p>
            <br>
            <p class="card-bitterness">Bitterness: ${beer.ibu} IBU</p>
            <br>
            <h3 class="food_pairing"><b>Food Pairing</b></h3>
            <br>
            <p class="foods">
                1. ${beer.food_pairing[0]}
                <br>
                2. ${beer.food_pairing[1]}
                <br>
                3. ${beer.food_pairing[2]}
            </p>
            </div>
            </div>
            </div>
            </div>
            `;
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};

//get the beer by its name
function getSearchInputBeer(name) {
  $.ajax({
    url: `https://api.punkapi.com/v2/beers/${name}`,
    success: function (response) {
      console.log(response);

      mainContainer.style.display = "none";
      pageDiv.innerHTML = "";
      beersContent.innerHTML = "";
      sortPages.innerHTML = "";
      printRandomBeer.innerHTML = "";
      showMoreDetailsCard.innerHTML = "";

      for (let beer of response) {
        let getUserInputBeer = document.getElementById("searchInput").value;
        let printUserInputBeer = document.getElementById("searchInputBeer");

        if (getUserInputBeer.toLowerCase() === beer.name.toLowerCase()) {
          printUserInputBeer.innerHTML += `
          <div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
      <div class="col-md-4">
      <img src="${beer.image_url}" class="img-fluid rounded-start" alt="...">
      </div>
      <div class="col-md-8">
      <div class="card-body">
      <h5 class="card-name">${beer.name}</h5>
      <p class="card-desc">${beer.description}</p>
      <br>
      <p class="card-tagline">${beer.tagline}</p>
      <br>
      <p class="card-brewed">Brewed: ${beer.first_brewed}</p>
      <br>
      <p class="card-alcohol">Alcohol: ${beer.abv}%</p>
      <br>
      <p class="card-bitterness">Bitterness: ${beer.ibu} IBU</p>
      <br>
      <h3 class="food_pairing"><b>Food Pairing</b></h3>
      <br>
      <p class="foods">
          1. ${beer.food_pairing[0]}
          <br>
          2. ${beer.food_pairing[1]}
          <br>
          3. ${beer.food_pairing[2]}
      </p>
      </div>
      </div>
      </div>
      </div>
          `;
        }
      }
    },
    error: function (error) {
      console.log(error);
    },
  });
};