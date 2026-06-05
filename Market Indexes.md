

---

# Finance APIs

[Guide to Google Finance API and Alternatives](https://scrapfly.io/blog/posts/guide-to-google-finance-api)  


---

# Google Sheets GOOGLEFINANCE function 

[GOOGLEFINANCE Fetches current or historical securities information from Google Finance.](https://support.google.com/docs/answer/3093281?hl=en)  

[How to use the GOOGLEFINANCE function in Google Sheets](https://www.sheetgo.com/blog/google-sheets-formulas/googlefinance-formula-google-sheets/)  

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
in a QUERY().

- Data Refresh: 
The GOOGLEFINANCE function only fetches past dates; it will not display data for the current day.

---