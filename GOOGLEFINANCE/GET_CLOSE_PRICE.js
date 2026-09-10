/**
 * Retrieves the closing price for a given ticker symbol on a specific date.
 * 
 * @param {string} ticker - Symbol name (e.g., "STOXXIEX.DE", "VOO", "AAPL")
 * @param {string|Date} inputDate - Target date (e.g., "2024-03-15" or a Date cell)
 * @return {number|string} The closing price or an error message.
 * @customfunction
 */
function GET_CLOSE_PRICE(ticker, inputDate) {
  if (!ticker || typeof ticker !== "string") {
    return "Invalid Ticker";
  }

  const targetDate = new Date(inputDate);
  if (isNaN(targetDate.getTime())) {
    return "Invalid Date";
  }

  // Format date boundaries to UTC Unix timestamps (seconds)
  const startOfDay = Math.floor(new Date(Date.UTC(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth(),
    targetDate.getUTCDate(), 0, 0, 0
  )).getTime() / 1000);

  const endOfDay = startOfDay + 86400; // Add 24 hours

  // Encode ticker string for API call (handles symbols like ^GSPC)
  const encodedTicker = encodeURIComponent(ticker.trim());
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodedTicker}?period1=${startOfDay}&period2=${endOfDay}&interval=1d`;

  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    
    if (response.getResponseCode() !== 200) {
      return "Ticker not found or API error";
    }

    const json = JSON.parse(response.getContentText());
    const result = json.chart.result;

    if (!result || result.length === 0 || !result[0].indicators.quote[0].close) {
      return "No price found (Market Closed / Weekend)";
    }

    // Extract non-null close prices
    const closePrices = result[0].indicators.quote[0].close;
    const validPrices = closePrices.filter(price => price !== null);

    if (validPrices.length === 0) {
      return "No trading data for this date";
    }

    return Math.round(validPrices[0] * 100) / 100;

  } catch (error) {
    return "Error: " + error.toString();
  }
}