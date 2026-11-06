function insertClosePrice() {
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabName = "Plan-2026-2027";
  const marker = "LAST-CLOSE-PRICE";

  // Target the specific tab by name to ensure it runs on the right sheet
  const sheet = ss.getSheetByName(tabName) || ss.getActiveSheet();  
  
  // Get all values in Column A down to the last valued cell
  const range = sheet.getRange("A:A");
  const values = range.getValues();
  
  let foundMarker = false;
  
  // Search through populated rows
  for (let i = 0; i < values.length; i++) {
    
    const cellValue = String(values[i][0]).trim();
    
    if (cellValue === marker) {
      foundMarker = true;
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
  
  if (!foundMarker) {
    Logger.log(`Marker "${marker}" was not found in sheet "${sheet.getName()}".`);
  }
}

 /*
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const marker = "LAST-CLOSE-PRICE";
  const maxLength = 1000;

  // Get all values in Column A
  const range = sheet.getRange("A:A");
  const values = range.getValues();
  
  // Search for the marker in Column A limited to the first maxLength cells
  for (let i = 0; i < maxLength; i++) {
    if (values[i][0] === marker) {  

      // 1-based index of the marker row before insertion
      const rowIndex = i + 1; 

      // Insert a blank row before the marker    
      sheet.insertRowBefore(rowIndex);
      Logger.log(`Inserted a new row ${rowIndex}`);

      // The marker row shifted down to rowIndex + 1. 
      // Copy the marker row to the new blank row at rowIndex.
      const sourceRow = sheet.getRange(rowIndex + 1, 1, 1, sheet.getLastColumn());
      const destinationRow = sheet.getRange(rowIndex, 1);
      
      sourceRow.copyTo(destinationRow);

      return;
    }
  }
  */ 

 
