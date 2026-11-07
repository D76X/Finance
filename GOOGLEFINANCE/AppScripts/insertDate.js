function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Finance')
  .addItem('Insert Date', 'insertDate')
  .addToUi();
}

function insertDate() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var cell = sheet.getRange('A346');
  cell.setValue(new Date());
}
