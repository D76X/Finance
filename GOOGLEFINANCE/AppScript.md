# Google Apps Script

[Automate & extend Google Workspace with simple code - Google](https://developers.google.com/apps-script)  

---

# Analytics with Adam

[Apps Script For Google Sheets from Scratch - Playlist - Analytics with Adam](https://www.youtube.com/playlist?list=PLNvPFA43mDu5oszvH_FoO4xcxxy9UMBZS)  

[Google Apps Script for Beginners: Start Automating Google Sheets Analytics with Adam](https://www.youtube.com/watch?v=8UmdqwY9AdA)  

[Automate Google Sheets with App Script - Beginner Tutorial #1 - Variables Analytics with Adam](https://www.youtube.com/watch?v=JLdNy-bpJnI&list=PLNvPFA43mDu5oszvH_FoO4xcxxy9UMBZS&index=2)  

---

# Q01

When I run the function below nothing happens. This confuses me because it used to work and insert the row above the row 363. I do not understand what I do wrong 

``` 
function insertClosePrice() { 
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet(); const marker = "LAST-CLOSE-PRICE"; const maxLength = 1000;

    // Get all values in Column A const range = sheet.getRange("A:A"); const values = range.getValues(); // Search for the marker in Column A limited to the first maxLength cells for (let i = 0; i < maxLength; i++) { if (values[i][0] === marker) {

    // 1-based index of the marker row before insertion const rowIndex = i + 1;

    // Insert a blank row before the marker sheet.insertRowBefore(rowIndex); Logger.log(`Inserted a new row ${rowIndex}`);

    // The marker row shifted down to rowIndex + 1. // Copy the marker row to the new blank row at rowIndex. const sourceRow = sheet.getRange(rowIndex + 1, 1, 1, sheet.getLastColumn()); const destinationRow = sheet.getRange(rowIndex, 1); sourceRow.copyTo(destinationRow);

    return; 

        } 
    }
} 
```

# ANSWER 01

The reason nothing happens when you run this script is due to how Google Apps Script handles **`getActiveSheet()`**, along with a couple of edge cases in the loop and copy logic.

-----

### 1\. Primary Cause: `getActiveSheet()` Targets the Wrong Tab

When you run a function from the **Google Apps Script editor** by clicking the "Run" button, 
Apps Script does not always detect which tab you are currently viewing in your browser. 
Instead, it defaults to the **first sheet tab** in the workbook (in your spreadsheet, this is `Aggregate`), or whichever tab was open when the file was last saved.

Because **`Plan-2026-2027`** is the 8th tab in your spreadsheet:

  * The script searches Column A of the first tab (`Aggregate`).
  * It never finds `"LAST-CLOSE-PRICE"`.
  * The `if` condition is never met, the loop finishes silently, and nothing is inserted.

-----

### 2\. Secondary Issues in the Code

1.  **Loop Bound vs. Sheet Size:**  
    `sheet.getRange("A:A").getValues()` returns an array with the exact number of rows in the sheet. If a sheet has fewer than 1,000 rows, looping up to `maxLength = 1000` can cause a silent error (`Cannot read properties of undefined (reading '0')`) when it searches past the end of the sheet.

2.  **Whitespace / Exact Match:**  
    `values[i][0] === marker` requires an exact match. If the cell ever has a leading or trailing space (e.g., `"LAST-CLOSE-PRICE "`), the match fails.

3.  **Row Duplication Logic:**  
    When `sheet.insertRowBefore(rowIndex)` runs:
      * A new blank row is inserted at row 363, pushing the marker row down to 364.
      * `sourceRow` (row 364) is then copied back onto `destinationRow` (row 363).
      * This duplicates the marker row into row 363, resulting in two identical rows.

-----

### Recommended Corrected Script

To fix this 

1. explicitly reference `'Plan-2026-2027'` by name or fallback to the active sheet, 
2. trim cell values, and 
3. log a warning if the marker is not found:

``` javascript
function insertClosePrice() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  // Target the specific tab by name to ensure it runs on the right sheet
  const sheet = ss.getSheetByName("Plan-2026-2027") || ss.getActiveSheet();
  
  const marker = "LAST-CLOSE-PRICE";
  
  // Get all values in Column A
  const range = sheet.getRange("A:A");
  const values = range.getValues();
  
  let found = false;
  
  // Search through populated rows
  for (let i = 0; i < values.length; i++) {
    const cellValue = String(values[i][0]).trim();
    
    if (cellValue === marker) {
      found = true;
      const rowIndex = i + 1; // 1-based index
      
      // Insert a blank row before the marker row
      sheet.insertRowBefore(rowIndex);
      Logger.log(`Inserted a new row at row ${rowIndex}`);
      
      // The original marker row has now moved to rowIndex + 1.
      // Copy row formatting/formulas from rowIndex + 1 to the new row at rowIndex:
      const sourceRow = sheet.getRange(rowIndex + 1, 1, 1, sheet.getLastColumn());
      const destinationRow = sheet.getRange(rowIndex, 1);
      sourceRow.copyTo(destinationRow);
      
      SpreadsheetApp.flush(); // Ensure changes are immediately committed
      return;
    }
  }
  
  if (!found) {
    Logger.log(`Marker "${marker}" was not found in sheet "${sheet.getName()}".`);
  }
}

```

### What to check next:

1.  Replace your function in the Apps Script editor with the code above.
2.  Click **Run**, then check the **Execution log** at the bottom of the editor window. If the marker is not found, it will log the sheet name it searched so you can verify immediately.


---
