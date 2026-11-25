// Haven "Build your own plan" – saves, lists and removes published plans and notes.
// Paste this into the "Haven plans" Google Sheet: Extensions > Apps Script. It contains no passwords.
// After changing it: Deploy > Manage deployments > pencil > Version: New version > Deploy.
var SHEET_NAME = 'Plans';
var MAX_PLANS_SHOWN = 100;
// Plans tab columns: A time, B plan name, C made by, D dogs, E hidden (x), F plan data, G plan id, H owner code
// Notes tab columns: A time, B note, C made by, D hidden (x), E note id, F owner code
var MAX_NOTES_SHOWN = 200;

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Time', 'Plan name', 'Made by', 'Dogs', 'Hide? (type x)', 'Plan data', 'Plan id', 'Owner code']);
    sh.setFrozenRows(1);
  }
  if (!sh.getRange('G1').getValue()) sh.getRange('G1:H1').setValues([['Plan id', 'Owner code']]);
  return sh;
}
function notesSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Notes');
  if (!sh) {
    sh = ss.insertSheet('Notes');
    sh.appendRow(['Time', 'Note', 'Made by', 'Hide? (type x)', 'Note id', 'Owner code']);
    sh.setFrozenRows(1);
  }
  return sh;
}
// The admin key is typed by you in the "Settings" tab, cell B1. Leave it empty to switch admin deleting off.
function adminKey_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('Settings');
  if (!sh) {
    sh = ss.insertSheet('Settings');
    sh.getRange('A1').setValue('Admin key (type a password only you know in B1)');
  }
  return String(sh.getRange('B1').getValue() || '').trim();
}
function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
// Stops a typed value from being read as a spreadsheet formula.
function safe_(s) {
  s = String(s || '').replace(/[\r\n\t]+/g, ' ').trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function token_(s) {
  s = String(s || '');
  return /^[A-Za-z0-9]{6,40}$/.test(s) ? s : '';
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.website) return reply_({ ok: true });            // hidden trap field: bots fill it in
    lock.waitLock(10000);
    if (d.action === 'checkadmin') { var k = adminKey_(); return reply_({ ok: k !== '' && String(d.admin || '') === k }); }
    if (d.action === 'note') {
      var text = safe_(d.text).slice(0, 500), who = safe_(d.author).slice(0, 40);
      if (!text) return reply_({ ok: false });
      var nid = token_(d.id) || Utilities.getUuid().replace(/-/g, '').slice(0, 12);
      notesSheet_().appendRow([new Date(), text, who, '', nid, token_(d.code)]);
      return reply_({ ok: true });
    }
    if (d.action === 'delete' && d.kind === 'note') return deleteNote_(d);
    if (d.action === 'delete') return deletePlan_(d);
    var title = safe_(d.title).slice(0, 60);
    var author = safe_(d.author).slice(0, 40);
    if (!title) return reply_({ ok: false });
    var clean = {}, count = 0;
    Object.keys(d.place || {}).slice(0, 20).forEach(function (zone) {
      var list = d.place[zone];
      if (!Array.isArray(list)) return;
      clean[String(zone).slice(0, 20)] = list.slice(0, 200).map(function (n) { return String(n).slice(0, 80); });
      count += clean[String(zone).slice(0, 20)].length;
    });
    if (!count || count > 300) return reply_({ ok: false });
    var id = token_(d.id) || Utilities.getUuid().replace(/-/g, '').slice(0, 12);
    sheet_().appendRow([new Date(), title, author, count, '', JSON.stringify(clean), id, token_(d.code)]);
    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
// "Deleting" hides the row (puts an x in column E) so you can always bring a plan back.
function deletePlan_(d) {
  var sh = sheet_(), rows = sh.getDataRange().getValues(), admin = adminKey_();
  var isAdmin = admin !== '' && String(d.admin || '') === admin;
  for (var i = 1; i < rows.length; i++) {
    var id = String(rows[i][6] || 'r' + (i + 1));
    if (id !== String(d.id)) continue;
    var owner = String(rows[i][7] || '');
    if (isAdmin || (owner !== '' && owner === String(d.code || ''))) {
      sh.getRange(i + 1, 5).setValue('x');
      return reply_({ ok: true });
    }
    return reply_({ ok: false });
  }
  return reply_({ ok: false });
}
function deleteNote_(d) {
  var sh = notesSheet_(), rows = sh.getDataRange().getValues(), admin = adminKey_();
  var isAdmin = admin !== '' && String(d.admin || '') === admin;
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][4]) !== String(d.id)) continue;
    var owner = String(rows[i][5] || '');
    if (isAdmin || (owner !== '' && owner === String(d.code || ''))) {
      sh.getRange(i + 1, 4).setValue('x');
      return reply_({ ok: true });
    }
    return reply_({ ok: false });
  }
  return reply_({ ok: false });
}
function doGet() {
  var rows = sheet_().getDataRange().getValues();
  var out = [];
  for (var i = rows.length - 1; i >= 1 && out.length < MAX_PLANS_SHOWN; i--) {
    var r = rows[i];
    if (String(r[4]).trim() !== '') continue;               // hidden or deleted
    try {
      out.push({ id: String(r[6] || 'r' + (i + 1)), time: new Date(r[0]).toISOString(), title: r[1], author: r[2], place: JSON.parse(r[5]) });
    } catch (x) {}
  }
  var nrows = notesSheet_().getDataRange().getValues(), notes = [];
  for (var j = nrows.length - 1; j >= 1 && notes.length < MAX_NOTES_SHOWN; j--) {
    var n = nrows[j];
    if (String(n[3]).trim() !== '' || !n[4]) continue;
    notes.push({ id: String(n[4]), time: new Date(n[0]).toISOString(), text: n[1], author: n[2] });
  }
  return reply_({ builds: out, notes: notes });
}
