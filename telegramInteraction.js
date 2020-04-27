function setWebhook() {
  var url = telegramUrl + "/setWebhook?url=" + webAppUrl;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}

function doGet(e) {
  return HtmlService.createHtmlOutput("Hi there version 112 \n" + JSON.stringify(e, null, 4));
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var senderId = data.message.chat.id;
  var message = data.message.text;
  logMessage(data.message);
  if (!validatedChatIds.includes(senderId)) return onUnauthorisedAccess(e);
  if (regexpComandGet.test(message)) return onCommandCalled(e);
  var matchedText = message.match(messageRegexpMask);
  if (!matchedText) return onWrongMessageFormat(e);
  var [_0, isIncome, amount, _3, _4, _5, paymentDescription] = matchedText;
  amount = parseCustomStringToFloat(amount);
  addCashOperation((isIncome ? amount : -amount), paymentDescription, null, senderId);
}

function sendText(id, text) {
  text = encodeURIComponent(text);
  var url = telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text;
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
}
