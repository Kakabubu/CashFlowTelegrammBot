var regexpComandGet = /(^( )*)(\/)([^\s-]*)/;

function onUnauthorisedAccess(e) {
  var data = JSON.parse(e.postData.contents);
  var id = data.message.chat.id;
  var name = data.message.chat.first_name + " " + data.message.chat.last_name;
  sendText(id, 'Stop doing this, you, little mother hacker');
  return logMessage('Unautorised message from "' + name + '"(' + id + ') message: "' + data.message + '"');
  return getSheetByName(sheetNameLogs, true).appendRow([
    currentDateTime,
    'Unautorised message from "' + name + '"(' + id + ') message: "' + data.message + '"'
  ]);
}

function onWrongMessageFormat(e) {
  var data = JSON.parse(e.postData.contents);
  var id = data.message.chat.id;
  var text = data.message.text;
  sendText(id, 'Має бути в форматі "сума опис"(з пробілом) приклад: "11.99 Хліб", докладніше:/help');
  return getSheetByName(sheetNameLogs, true).appendRow([
    new Date(),
    'Invalid message format sender:"' + id + '"' + ' message: "' + text + '"'
  ]);
}

function onCommandCalled(e) {
  var data = JSON.parse(e.postData.contents);
  var id = data.message.chat.id;
  var text = data.message.text;
  var matchedText = text.match(regexpComandGet);
  if (!matchedText) return sendText(id, 'Невідома команда: "' + command + '"');
  var [_0, _1, _2, _3, command] = matchedText;
  if (/help/i.test(command)) return onHelpCalled(e);
  if (/getToday/i.test(command)) return onHelpCalled(e);
  sendText(id, 'Невідома команда:"' + command + '"');
}

function onHelpCalled(e) {
  var data = JSON.parse(e.postData.contents);
  var id = data.message.chat.id;
  sendText(id, textOfHelp);
}

function onRowAllreadyExists(authorId, newRow) {
  [_, amount, paymentDescription] = newRow;
  return sendText(
    authorId,
    (amount < 0 ? 'Витрата ' : 'Надходження ')
    + amount + ' грн. з текстом: "' + paymentDescription + '" вже створено в поточнiй датi'
  );
}

function onRowAdded(authorId, newRow) {
  [_, amount, paymentDescription] = newRow;
  var isCost = amount < 0;
  amount = isCost ? -amount : amount;
  sendText(
    authorId,
    (isCost ? 'Витрату ' : 'Надходження ')
    + amount + ' грн. додано з текстом: "' + paymentDescription + '"'
  );
}
