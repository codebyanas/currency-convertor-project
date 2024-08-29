// Define the API key and export it
export const apiKey = '7e2b7ab55ef72172301b518b';

// Function to construct the URL with the selected fromCurrency
export function getUrl(fromCurrency) {
    return `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`;
}
