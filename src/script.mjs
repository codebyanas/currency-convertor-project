import { apiKey, getUrl } from "./apikey.mjs";

const dropList = document.querySelectorAll("form select"),
fromCurrency = document.querySelector(".from select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        // Selecting USD by default as FROM currency and NPR as TO currency
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "NPR" ? "selected" : "";
        // Creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        // Inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target); // Calling loadFlag with passing target element as an argument
    });
}

function loadFlag(element){
    for(let code in country_list){
        if(code == element.value){ // If currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img"); // Selecting img tag of particular drop list
            // Passing country code of a selected currency code in a img url
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

window.addEventListener("load", ()=>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); // Preventing form from submitting
    getExchangeRate();
});

const exchangeIcon = document.querySelector("form .icon");
exchangeIcon.addEventListener("click", ()=>{
    let tempCode = fromCurrency.value; // Temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; // Passing TO currency code to FROM currency code
    toCurrency.value = tempCode; // Passing temporary currency code to TO currency code
    loadFlag(fromCurrency); // Calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency); // Calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate(); // Calling getExchangeRate
})

function getExchangeRate(){
    const amount = document.querySelector("form input");
    const exchangeRateTxt = document.querySelector("form .exchange-rate");
    let amountVal = amount.value;
    
    // If user doesn't enter any value or enters 0, then we'll put 1 value by default in the input field
    if(amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }
    
    exchangeRateTxt.innerText = "Getting exchange rate...";
    
    // Use the URL from getUrl function
    const url = getUrl(fromCurrency.value);

    // Fetching API response and returning it with parsing into js object
    fetch(url).then(response => response.json()).then(result =>{
        let exchangeRate = result.conversion_rates[toCurrency.value]; // Getting user selected TO currency rate
        let totalExRate = (amountVal * exchangeRate).toFixed(2); // Multiplying user entered value with selected TO currency rate
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExRate} ${toCurrency.value}`;
    }).catch(() =>{ // If user is offline or any other error occurred while fetching data, then catch function will run
        exchangeRateTxt.innerText = "Something went wrong";
    });
}
