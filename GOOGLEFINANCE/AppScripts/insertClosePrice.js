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
      // Copy only the first 3 columns (A:C) from rowIndex + 1 to the new row at rowIndex:
      const sourceRow = sheet.getRange(rowIndex + 1, 1, 1, 3);
      const destinationRow = sheet.getRange(rowIndex, 1);
      sourceRow.copyTo(destinationRow);
      
      // Clear the marker value from the old cell (Row: rowIndex + 1, Column: 1)
      sheet.getRange(rowIndex + 1, 1).clearContent();

      // Clear the marker value from the old cell (Row: rowIndex + 1, Column: 1)
      const oldMarkerCell = sheet.getRange(rowIndex + 1, 1);
      oldMarkerCell.clearContent();
      
      // Insert the formula `=($BrowIndex)+1`into the cell BrowIndex+1
      // this will shift all the ordinals by 1 starting from the value 0
      const oldOrdinalCell = sheet.getRange(rowIndex + 1, 2);           
      oldOrdinalCell.setFormula(`=B${rowIndex}+1`);

      // Increment the date in Column C of the new row (rowIndex) by 1 day
      const newDateCell = sheet.getRange(rowIndex, 3); // Column C is index 3
      const currentDate = newDateCell.getValue();

      if (currentDate instanceof Date) {
        // Add 1 day (24 hours) to the existing date
        const nextDate = new Date(currentDate);
        nextDate.setDate(nextDate.getDate() + 1);
        newDateCell.setValue(nextDate);
      } else if (currentDate) {
        // Fallback for non-Date objects (e.g., date formatted as a formula or text)
        newDateCell.setFormula(`=C${rowIndex + 1}+1`);
      }

      SpreadsheetApp.flush(); // Ensure changes are immediately committed
      return;
    }
  }
  
  if (!foundMarker) {
    Logger.log(`Marker "${marker}" was not found in sheet "${sheet.getName()}".`);
  }
}