/**
 * Retrieves the closing price for a given ticker symbol on a specific date.
 * Uses CacheService to prevent rate limiting on recurring calls.
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

  // Format date string for cache key (YYYY-MM-DD)
  const formattedDate = targetDate.toISOString().split('T')[0];
  
  // Create a unique cache key: e.g. "EXSA.DE_2026-09-10"
  const cacheKey = `${ticker.trim().toUpperCase()}_${formattedDate}`;
  const cache = CacheService.getScriptCache();
  const cachedValue = cache.get(cacheKey);

  // Return cached result if available
  if (cachedValue !== null) {
    // Return parsed float if cached item is numeric, otherwise return string message
    return isNaN(Number(cachedValue)) ? cachedValue : Number(cachedValue);
  }

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

    const price = Math.round(validPrices[0] * 100) / 100;

    // Cache the price for 6 hours (21,600 seconds)
    cache.put(cacheKey, price.toString(), 21600);

    return price;

  } catch (error) {
    return "Error: " + error.toString();
  }
}