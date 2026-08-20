# CacheFinance 

[Custom Functions in Google Sheets](https://developers.google.com/apps-script/guides/sheets/functions#creating_a_custom_function)  

[cachefinance - GtiHub](https://github.com/demmings/cachefinance)  

[cachefinance Custom Function](https://demmings.github.io/notes/cachefinance.html)   

---

# QUESTION-01

I use the `GOOGLEFINANCE` function, but for some tickers there is no 
data avaible on Google Finace.

For example for the ETF: 
[iShares STOXX Europe 600 UCITS ETF (DE)](https://www.justetf.com/it/etf-profile.html?isin=DE0002635307) 

I find it on `Just ETF`, and also on `yahoo finance`:
[iShares STOXX Europe 600 UCITS ETF (DE) EUR (Dist) (EXSA.DE)](https://finance.yahoo.com/quote/EXSA.DE/).

However, when I try to look for it on: 
[Google Finance](https://www.google.com/finance/beta) 

by using its ISIN as the keyward `DE0002635307` I get the following answer:

```
The ISIN DE0002635307 identifies the iShares STOXX Europe 600 UCITS ETF (DE) (ETR:EXSA).

Key Details:
Ticker: EXSA
WKN: 263530
Benchmark Index: STOXX Europe 600 Index (tracks 600 of the largest European companies)
Distribution Policy: Distributing
Total Expense Ratio (TER): 0.20% p.a.
Replication Method: Physical (Full replication)
```

But the link below return no data when used in Google Sheet with the function GOOGLEFINANCE: 
https://www.google.com/finance/beta/quote/EXSA:ETR 

In Google Sheet I use the function `GOOGLEFINACE` in combination with other Google Sheet
functions within the following formula to compute the simple average of an ETF or an IDNEX 
of which I know the ticker, over a period of time expressed in days. 

For example, with the follwing formula:

`=AVERAGE(INDEX(GOOGLEFINANCE(E292,"close", TODAY()-200, TODAY(), "DAILY"), 0, 2))`

This formula can be broken down as follows:

`GOOGLEFINANCE(...)`: 

Generates a multi-cell table (an array) containing headers, dates, and historical 
financial values for a specified ticker between start_date and end_date.
In this case "close" is specified, which...

`INDEX(range, row, column)`: 
Extracts the value at the intersection of a specific row and column from that 
generated table.


What Happens When `row=0 and column=2`:

Setting a row or column index to 0 in INDEX tells Google Sheets to return the 
entire row or column instead of a single cell.

`row = 0`: Returns all rows within the specified column.

`column = 2`: Target column 2: 

The GOOGLEFINANCE historical data table formats 

- Column 1 as "Date" 
- Column 2 as the requested "Attribute" value (e.g., Close, Volume, Open).

Combining `row=0 and column=2` outputs a single vertical array (column) containing 
the attribute header and every historical data value, while completely stripping out 
the dates in Column 1.

The more general form of this formula is the following:
`=INDEX(GOOGLEFINANCE("ticker", "attribute", start_date, end_date), row, column)`

---

## STEP-01: `GOOGLEFINANCE("ticker", "attribute", start_date, end_date)`

- Column 1: Contains dates (Date)

- Column 2: 
Contains the value for the specified "attribute" (such as "close", "open", 
"high", "low", or "volume") on each corresponding date; in our specific example 
that would be "close".

- Row 1: Contains header labels (Date and the attribute name).

- Row 2 and beyond: 
Contains the actual daily records starting from `start_date` down to `end_date`.

The following is the meaning of the `INDEX` function:

---

## STEP-02: `INDEX(array, row, column)`

The `INDEX` function takes that generated data table and extracts data 
from a specific cell, row, or column based on the row and column numbers 
provided:

row: The row number in the generated table.

- 1 gives the header row.
- 2 gives the first date entry (the oldest date in the range).
- 0 returns all rows (the entire column).

column: The column number in the generated table.

- 1 selects the dates column.
- 2 selects the attribute/metric values column.
- 0 returns all columns (the entire row).

Pulls the historical data for the ticker (e.g., "GOOG") from start_date to today.

---

## STEP-03:  How They Work Together

Instead of displaying a full table with dates and headers across multiple cells, 
this combined formula retrieves the full dataset in the background and pulls out 
only the specific piece of data located at the row and column intersection you 
specified.

---


Is there a way I can improve the GOOGLEFINANCE function and draw data also for the tickers that 
do not look like have data on Google Finance?

I found [cachefinance](https://github.com/demmings/cachefinance) but I have some doubts whether it solve 
my problem or not and how I would use it to solve the problem if I could.

---

# ANSWER-01A

Yes—but not by changing `GOOGLEFINANCE` itself. 

Google Sheets can query only the securities and attributes available in Google Finance’s underlying data feed; it cannot import an ETF merely because Google Finance’s website can identify its ISIN. Google explicitly notes that some attributes do not work for all symbols and that it does not support most international exchanges. [support.google](https://support.google.com/docs/answer/3093281)

For this ETF, the issue is probably the **Xetra/ETR quote feed**, not the ISIN mapping. `DE0002635307` is correctly associated with ticker `EXSA`, and the Xetra listing is also shown as `EXSA` by BlackRock.  Yahoo Finance, meanwhile, exposes the quote as `EXSA.DE` and currently provides delayed Xetra data. [blackrock](https://www.blackrock.com/lu/intermediaries/products/251931/ishares-stoxx-europe-600-ucits-etf-de-fund)

## What to try first

Use the exchange-qualified ticker rather than the ISIN:

```gs
=GOOGLEFINANCE("ETR:EXSA","price")
```

You can also test:

```gs
=GOOGLEFINANCE("ETR:EXSA","currency")
=GOOGLEFINANCE("ETR:EXSA","closeyest")
=GOOGLEFINANCE("ETR:EXSA","volume")
```

However, if these return `#N/A`, there is no formula syntax that will force Google to retrieve the data. The following alternatives are worth testing, but they are not equivalent listings and should not be silently substituted in a portfolio:

```gs
=GOOGLEFINANCE("FRA:EXSA","price")
=GOOGLEFINANCE("EXSA","price")
```

`FRA:EXSA` refers to a Frankfurt listing, while `ETR:EXSA` refers to Xetra. They may have different liquidity, trading hours, prices, or availability. Google recommends specifying both the exchange and ticker to avoid discrepancies. [support.google](https://support.google.com/docs/answer/3093281)

## Using Yahoo Finance as the fallback

Yahoo’s symbol is:

```text
EXSA.DE
```

You can sometimes retrieve the current value in Google Sheets with:

```gs
=IMPORTDATA("https://query1.finance.yahoo.com/v8/finance/chart/EXSA.DE?range=1d&interval=1m")
```

But this is not a convenient or stable solution: Yahoo’s response is JSON, `IMPORTDATA` may not parse it usefully, and Yahoo can change or restrict undocumented endpoints. A better approach is an Apps Script function using `UrlFetchApp`, preferably against an official or licensed API.

For example, if an API returns JSON in the form:

```json
{
  "price": 66.04,
  "currency": "EUR",
  "timestamp": "2026-08-19T13:34:01+02:00"
}
```

you could expose a custom Sheets function such as:

```javascript
function YAHOOFINANCE(symbol, attribute) {
  const url =
    'https://query1.finance.yahoo.com/v8/finance/chart/' +
    encodeURIComponent(symbol) +
    '?range=1d&interval=1m';

  const response = UrlFetchApp.fetch(url, {
    muteHttpExceptions: true,
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });

  if (response.getResponseCode() !== 200) {
    throw new Error('Yahoo Finance returned HTTP ' + response.getResponseCode());
  }

  const data = JSON.parse(response.getContentText());
  const result = data.chart.result && data.chart.result[0];

  if (!result || !result.meta) {
    throw new Error('No quote data returned for ' + symbol);
  }

  const meta = result.meta;

  switch (String(attribute).toLowerCase()) {
    case 'price':
      return meta.regularMarketPrice ?? meta.previousClose;
    case 'currency':
      return meta.currency || '';
    case 'previousclose':
      return meta.previousClose ?? '';
    default:
      throw new Error('Unsupported attribute: ' + attribute);
  }
}
```

Then:

```gs
=YAHOOFINANCE("EXSA.DE","price")
```

This should be treated as an example rather than production-grade infrastructure. For a reliable portfolio tracker, use a provider with a documented API, authentication, rate limits, and terms that permit your intended use.

## Does CacheFinance solve it?

`cachefinance` may help, but it does not extend Google Finance’s database. It works as a custom Apps Script function that:

1. Tries `GOOGLEFINANCE`.
2. Uses a cached previous value when Google returns `#N/A`.
3. Attempts third-party websites or APIs for selected attributes such as `price`, `name`, and `yieldpct`.

The project specifically describes unsupported-symbol fallback lookups and cached values, but it also warns that third-party lookups can be slow, may fail, and may return `0` or an empty value if no source works. [github](https://github.com/demmings/cachefinance)

For your ETF, the first test would be:

```gs
=CACHEFINANCE("ETR:EXSA","price")
```

If the library’s Yahoo fallback understands the `ETR:EXSA` format, it may convert it to the Yahoo symbol `EXSA.DE`. If it does not, try the Yahoo-style symbol:

```gs
=CACHEFINANCE("EXSA.DE","price")
```

Whether that works depends on the version of the script and its source-selection logic. The repository is relatively old—the latest listed release is from November 2022—so I would inspect and test its current Yahoo adapter before relying on it for financial records. [github](https://github.com/demmings/cachefinance)

You can also provide a default Google value when Google works intermittently:

```gs
=CACHEFINANCE(
  "ETR:EXSA",
  "price",
  GOOGLEFINANCE("ETR:EXSA","price")
)
```

For an always-unsupported symbol, however, the default itself evaluates to `#N/A`; therefore the third-party lookup must support that symbol format.

## Recommended design

For a portfolio spreadsheet, I would separate **security identity**, **data provider**, and **provider symbol**:

| Security | Exchange | Google symbol | Yahoo symbol |
|---|---|---|---|
| ISIN `DE0002635307` | Xetra | `ETR:EXSA` | `EXSA.DE` |

Then use a fallback formula:

```gs
=IFERROR(
  GOOGLEFINANCE(B2,"price"),
  YAHOOFINANCE(C2,"price")
)
```

Where:

- `B2` contains `ETR:EXSA`.
- `C2` contains `EXSA.DE`.

For a simple personal sheet, `CACHEFINANCE` is worth trying because it gives you caching and fallback behavior with little implementation effort. For a more dependable solution, I would use a small Apps Script wrapper around a documented market-data API and store the provider-specific symbol separately from the ISIN.

Do not use cached values for current valuation without also storing the timestamp and source. A cached price can be useful for avoiding gaps in charts, but it should not be mistaken for a current market quote.