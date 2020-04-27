var decimalSeparator = (1 / 2).toLocaleString().substring(1, 2);

function logMessage(message) {
  getSheetByName(sheetNameLogs, true).appendRow([new Date(), message]);
}

function getSheetByName(sName, createIfAbsent) {
  var spreadSheet = SpreadsheetApp.openById(ssId);
  return spreadSheet.getSheetByName(sName)
    ? spreadSheet.getSheetByName(sName)
    : createIfAbsent
      ? spreadSheet.insertSheet(sName)
      : null;
}

function addCashOperation(amount, paymentDescription, currency, authorId) {
  var sheet = getPaymentsSheet();
  Logger.log(getFormatedDate(new Date()));
  var newRow = [getFormatedDate(), amount, paymentDescription];
  if (checkIfRowAllreadyExist(newRow)) return onRowAllreadyExists(authorId, newRow);
  var range = sheet.getRange(getLastEmptyRowNum(), 1, 1, 3);
  Logger.log(range.getValues());
  range.setValues([newRow]);
  onRowAdded(authorId, newRow);
}

function parseCustomStringToFloat(string) {
  var replaceArray = decimalSeparator === "." ? [',', '.'] : ['.', ','];
  return parseFloat(parseFloat((string).toString()
    .replace(replaceArray[0], replaceArray[1])).toFixed(2));
}

function getFormatedDate(date) {
  date = date instanceof Date ? date : date ? new Date(date) : new Date();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  month = (month + '').length === 1 ? '0' + month : month;
  day = (day + '').length === 1 ? '0' + day : day;
  return [date.getFullYear(), month, day].join('/');
}

function getPaymentsSheet() {
  var date = new Date();
  var sName = monthsList[date.getMonth()] + ' ' + date.getYear();
  var sheet = getSheetByName(sName);
  if (!sheet) {
    return sheet;
    //TODO: duplicate tempate list
  }
  return sheet;
}

function getTransactionsRangeArray() {
  return getPaymentsSheet().getRange(1, 1, 40, 3).getValues();
}

function getLastEmptyRowNum(rangeArray) {
  rangeArray = rangeArray ? rangeArray : getTransactionsRangeArray();
  var i = rangeArray.length - 1;
  for (; i >= 0; i--) {
    if (!rangeArray[i].every(function (c) { return c === "" })) break;
  }

  return i + 2;
}

function checkIfRowAllreadyExist(expectedRow) {
  var range = getTransactionsRangeArray();
  var exists = false;
  if (Array.isArray(range[0])) {
    for (var i in range) exists = testRow(range[i], expectedRow, exists);
  } else exists = testRow(range, expectedRow, exists);

  function testRow(testedRow, expectedRow, exists) {
    if (exists) return true;
    testedRow[0] = getFormatedDate(testedRow[0]);
    var _1 = testedRow.join('|').toLowerCase().trim();
    var _2 = expectedRow.join('|').toLowerCase().trim();
    return _1 == _2;
  }

  return exists
}




