

---

# Finance APIs

[Guide to Google Finance API and Alternatives](https://scrapfly.io/blog/posts/guide-to-google-finance-api)  


---

# Google Sheets GOOGLEFINANCE function 

[GOOGLEFINANCE Fetches current or historical securities information from Google Finance.](https://support.google.com/docs/answer/3093281?hl=en)  

[How to use the GOOGLEFINANCE function in Google Sheets](https://www.sheetgo.com/blog/google-sheets-formulas/googlefinance-formula-google-sheets/)  

[QUERY function Runs a Google Visualization API Query Language query across data.](https://support.google.com/docs/answer/3093343?hl=en)  

---

## How can I calculate AVERAGES with the function GOOGLEFINANCE?

To calculate an average using the `GOOGLEFINANCE` function, you must nest it 
inside the standard Google Sheets `AVERAGE` and `INDEX` functions. 

This extracts the specific numerical column of historical data (e.g., closing price) 
and averages all the values in that array.

### Standard Average Formula

To find the average closing price of a stock over a specific timeframe (e.g., the last 30 days), 
use this formula:

`=AVERAGE(INDEX(GOOGLEFINANCE("GOOG", "price", TODAY()-30, TODAY(), "DAILY"), 0, 2))`

`GOOGLEFINANCE(...)`: 

Pulls the historical data for the ticker (e.g., "GOOG") from start_date to today.

`INDEX(..., 0, 2)`: 

Isolates the data to remove headers and targets only the second column (which contains the numerical prices).

`AVERAGE(...)`: 

Calculates the mathematical mean of those values.

### Moving Average (e.g., 50-Day or 200-Day)

If you need a Simple Moving Average (SMA), you can adjust the timeframe to capture 
the exact number of days you want to analyze. 

For a 200-day moving average, you can limit the days fetched:

`=AVERAGE(INDEX(GOOGLEFINANCE("AAPL", "price", TODAY()-200, TODAY(), "DAILY"), 0, 2))`

---

# CALCULATE AVERAGES WITH GOOGLEFINANCE

To calculate historical or moving averages of stocks using GOOGLEFINANCE, 
nest the function inside a standard `=AVERAGE()` or `=INDEX()` formula. 

This allows you to pull past pricing data and instantly compute the arithmetic mean.

Here are the most effective methods to calculate averages:

1. Single-Cell Moving Average (Simple Approach)

If you want a single cell that calculates the average closing price over a set period 
(e.g., the last 30 days), use this exact formula:

`=AVERAGE(INDEX(GOOGLEFINANCE("AAPL", "price", TODAY()-30, TODAY(), "DAILY"), 0, 2))`

Replace "AAPL" with your desired ticker symbol and change `TODAY()-30` to the number of days 
you want to analyze.

2. Multi-Cell List

To create a broader data table (which includes the date and price columns), use:

`=GOOGLEFINANCE("AAPL", "price", TODAY()-30, TODAY(), "DAILY")`

You can then use the standard Google Sheets AVERAGE Function to find the average of 
the resulting numerical column manually.

3. Calculating Average Trading Volume

To determine a stock's average trading volume over the past 10 days, 
use a dynamic formula like this:

`=LET(v,INDEX(GOOGLEFINANCE("AAPL", "volume", TODAY()-10, TODAY()),,2),AVERAGE(FILTER(v,ISNUMBER(v))))`

---

[How to Calculate Moving Average in Google Sheets](https://spreadsheetarchitect.substack.com/p/how-to-calculate-moving-average-in)  



---

## Question: How do I use the GOOGLEFINANCE function to retrieve data for a market indexes?

The `GOOGLEFINANCE` function supports major market indexes, 
though retrieving them requires specific ticker formats 
(often prefixed with a dot like .DJI or an index exchange like INDEXNASDAQ:.IXIC).

Commonly supported index tickers in Google Sheets include:

- S&P 500: 
`=GOOGLEFINANCE(".INX", "price")`

- Dow Jones Industrial Average: 
`=GOOGLEFINANCE(".DJI", "price")`

- NASDAQ Composite: 
`=GOOGLEFINANCE(".IXIC", "price")`

- NYSE Composite: 
`=GOOGLEFINANCE(".NYA", "price")`

- FTSE 100: 
`=GOOGLEFINANCE("INDEXFTSE:UKX", "price")`

- Nikkei 225: 
`=GOOGLEFINANCE("INDEXNIK:NI225", "price")`

Because index ticker formatting can occasionally return an error, 
an alternative and highly reliable method for tracking index performance 
is to use the ticker of a major Exchange-Traded Fund (ETF) that tracks 
the index.

Examples of Index ETFs:

- S&P 500 ETF (SPY): 
`=GOOGLEFINANCE("SPY", "price")`

- Nasdaq 100 ETF (QQQ): 
`=GOOGLEFINANCE("QQQ", "price")`

- Dow Jones ETF (DIA): 
`=GOOGLEFINANCE("DIA", "price")`

---

## Question: How do I use the GOOGLEFINANCE function to retrieve data for a market indexes between two dates?

To fetch historical data for a market index in Google Sheets, 
use the syntax: `=GOOGLEFINANCE("Ticker", "close", Start_Date, End_Date, "DAILY")`. 

The index must use its specific exchange prefix 
(e.g., 
"INDEXSP:.INX" for the S&P 500 
or 
"INDEXDJX:.DJI" for the Dow Jones
).

### The Formula

To pull daily closing values between January 1, 2026, and June 1, 2026, 
you would use:

`=GOOGLEFINANCE("INDEXSP:.INX", "close", DATE(2026, 1, 1), DATE(2026, 6, 1), "DAILY")`

### Popular Market Index Tickers

You must include the exact prefix for the index to pull data correctly:

- S&P 500: `INDEXSP:.INX`
- Dow Jones Industrial Average: `INDEXDJX:.DJI`
- Nasdaq Composite: `INDEXIX:.IXIC`
- FTSE 100: `INDEXFTSE:UKX`
- Nikkei 225: `INDEXNIK:.N225`

### Helpful Tips

- Date Formats: 

If you are not using the DATE() function, dates must be 
enclosed in quotes and formatted as MM/DD/YYYY or YYYY-MM-DD depending 
on your spreadsheet locale.

- Output Spacing: 

The formula generates a multi-column table (headers, dates, and prices).

- Remove Headers: 
To strip the headers and keep only the date and price arrays, wrap the formula 
in a `QUERY()`.

- Data Refresh: 
The GOOGLEFINANCE function only fetches past dates; it will not display data for the current day.

---

# What are the most important market index for the European financial sector?

The most important benchmarks for tracking the European financial sector are: 

`STOXX Europe 600 Financial Services` 
`MSCI Europe Financials Index`.

These indices track large and mid-cap financial companies—such as banks, 
insurers, and asset managers—across multiple European nations.

## Flagship Financial Indices 

`STOXX Europe 600 Financial Services`: 

This index tracks financial companies within the broader `STOXX Europe 600`, 
encompassing 17 European countries. It is frequently utilized as the underlying 
benchmark for European financial sector funds, such as the 
`iShares STOXX Europe 600 Financial Services UCITS ETF (DE)`.

`MSCI Europe Financials Index`: 

MSCI's flagship benchmark for the region, which captures the performance of large
and mid-cap financial equities across developed European markets. 

Its largest geographical weights typically come from the United Kingdom, Switzerland, 
and Germany. 

### Regional Market Equivalents

For a broader overview of the market's general health, investors frequently analyze the continent's major equity benchmarks, which heavily factor in financial institutions:EURO STOXX 50: Represents 50 of the largest and most liquid supersector leaders in the Eurozone, serving as the benchmark for various STOXX European equity indices. Because the Eurozone economy is highly bank-centric, this index is deeply influenced by the performance of European financial giants like BNP Paribas and Banco Santander.MSCI Europe: Captures large and mid-cap representation across 15 developed European markets. Financials constitute one of the largest sector weights within this broader, pan-European benchmark.

---

# What are the most important market index for the Asian financial sector?

The MSCI AC Asia Pacific Financials Index (USD) is 
a broad market index that captures large and mid-cap 
representation across five developed markets and eight 
emerging markets in the Asia Pacific region, specifically 
targeting the Financials sector.

Key Performance & Fundamentals (as of May 2026)
Dividend Yield: 3.27% (as of April 30, 2026).
Price-to-Earnings (P/E): 12.45x.
Forward P/E: 11.36x.
Price-to-Book (P/BV): 1.39x.
Index Composition

The index includes companies from the following countries:

- Developed Markets: Australia, Hong Kong, Japan, New Zealand, and Singapore.
- Emerging Markets: China, India, Indonesia, Korea, Malaysia, the Philippines, Taiwan, and Thailand.

While direct tickers for the specific financials-only sub-index are 
often vendor-specific such as: 

- `MXAP:IND` on Bloomberg 
- `302000-USD-STRD` for the broader AC Asia Pacific index on Yahoo Finance

investors often track this region through ETFs like the 

- iShares Core MSCI Pacific ETF (`NYSEARCA:IPAC`).
