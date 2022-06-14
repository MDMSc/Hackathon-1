const url = "https://api.openbrewerydb.org/breweries";
const body = document.querySelector('body');
let breweries = [];

// Heading div
const divHead = document.createElement('div');
divHead.setAttribute('class', 'container col-sm-12 col-md-12 col-lg-12 col-xl-12');
divHead.setAttribute('id', 'div-head');
divHead.innerHTML = '<h1>Open Breweries</h1>';

// Search bar in Heading
const divSearch = document.createElement('div');
divSearch.setAttribute('class', 'searchWrapper');

const inputSearch = document.createElement('input');
inputSearch.setAttribute('type', 'text');
inputSearch.setAttribute('class', 'search-bar col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
inputSearch.setAttribute('id', 'search-bar');
inputSearch.setAttribute('placeholder', 'Search by Name or Type only');
divSearch.appendChild(inputSearch);

divHead.appendChild(divSearch);
body.appendChild(divHead);

// Body div
let divContent = document.createElement('div');
divContent.setAttribute('class', 'container col-sm-12 col-sm-12 col-md-12 col-lg-12 col-xl-12');
divContent.setAttribute('id', 'div-content');
body.appendChild(divContent);

let divList = document.createElement('div');
divList.setAttribute('class', 'container col-sm-12 col-md-12 col-lg-12 col-xs-12 col-xl-12 div-list');
divContent.appendChild(divList);

let divRow = document.createElement('div');
divRow.setAttribute('class', 'row');

// Footer div
const divfooter = document.createElement('div');
divfooter.setAttribute('class', 'container col-sm-12 col-md-12 col-lg-12 col-xs-12 col-xl-12 text-center div-footer');
divfooter.innerHTML = '<p>&#169;Made by Murtaza Samim Choudhury</p>';
body.appendChild(divfooter);

// Search bar logic
const searchBar = document.getElementById('search-bar');
searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();
    let filteredB = breweries.filter(brewery => {
        return (brewery.name.toLowerCase().includes(searchString) || brewery.brewery_type.toLowerCase().includes(searchString));
    });

    displayData(filteredB);

});

// Fetch the data
(async function () {
    try {
        const result = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });
        breweries = await result.json();
        displayData(breweries);

    } catch (e) {
        divList.innerHTML = `<p>${e.message}</p>`;
    }
    divList.appendChild(divRow);
})()

let displayData = (dataSet) => {
    const htmlString = dataSet.map(data => {
        // Get full Address information
        let addressArray = [data.street, data.address_2, data.address_3, data.city, data.state, data.country];
        let addressFetched = "";
        addressArray.forEach(address => {
            if (address !== null) {
                addressFetched += `${address}, `;
            }
        })
        addressFetched += `${data.postal_code}`;

        // Get website
        let website = "";
        if (data.website_url !== null) {
            website = `<a href="${data.website_url}" title="${data.website_url}" target="_blank">${data.website_url}</a>`;
        } else {
            website = "Sorry! No Link Available";
        }

        // Get Phone Number
        let phone = "";
        if (data.phone !== null) {
            phone = `<b>${data.phone}</b>`;
        } else {
            phone = "Sorry! No Contact Available";
        }

        // Fill the content
        return `
        <div class="container col-xs-12 col-sm-6 col-md-6 col-lg-3 col-xl-3">
            <div class="card card-sm">
                <div class="card-header" text-center><span class="card-title">${data.name}</span></div>
                <div class="card-body">
                    <p><span class="card-text field-name">Type: </span><b>${data.brewery_type.toUpperCase()}</b></p>
                    <p><span class="card-text field-name">Address: </span><b>${addressFetched}</b></p>
                    <p><span class="card-text field-name">Website: </span>${website}</p>
                    <p><span class="card-text field-name">Contact: </span>${phone}</p>
                </div>
            </div>
        </div>
    `;
    }).join('');
    divRow.innerHTML = htmlString;
}
