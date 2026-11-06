function insertRowAfterLastDate() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Get all values in Column A
  const range = sheet.getRange("A:A");
  const values = range.getValues();
  
  // Search for "LAST DATE" in Column A
  for (let i = 0; i < values.length; i++) {
    if (values[i][0] === "LAST DATE") {
      // insertRowAfter takes a 1-based row index (i + 1)
      sheet.insertRowAfter(i + 1);
      Logger.log(`Inserted a new row after row ${i + 1}`);
      return;
    }
  }
  
  // If not found, log a message or alert
  SpreadsheetApp.getUi().alert('Cell containing "LAST DATE" was not found in Column A.');
}