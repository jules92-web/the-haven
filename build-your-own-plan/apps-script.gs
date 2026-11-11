// Haven "Build your own plan" – saves and lists published plans.
// Paste this into a new Google Sheet: Extensions > Apps Script. It contains no passwords.
// Then Deploy > New deployment > Web app > Execute as: Me, Who has access: Anyone.
var SHEET_NAME = 'Plans';
var MAX_PLANS_SHOWN = 100;

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Time', 'Plan name', 'Made by', 'Dogs', 'Hide? (type x)', 'Plan data']);
    sh.setFrozenRows(1);
  }
  return sh;
}
function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
// Stops a typed value from being read as a spreadsheet formula.
function safe_(s) {
  s = String(s || '').replace(/[\r\n\t]+/g, ' ').trim();
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var d = JSON.parse(e.postData.contents);
    if (d.website) return reply_({ ok: true });            // hidden trap field: bots fill it in
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
    lock.waitLock(10000);
    sheet_().appendRow([new Date(), title, author, count, '', JSON.stringify(clean)]);
    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}
function doGet() {
  var rows = sheet_().getDataRange().getValues().slice(1);
  var out = [];
  for (var i = rows.length - 1; i >= 0 && out.length < MAX_PLANS_SHOWN; i--) {
    var r = rows[i];
    if (String(r[4]).trim() !== '') continue;               // hidden by you
    try {
      out.push({ id: 'r' + (i + 2), time: new Date(r[0]).toISOString(), title: r[1], author: r[2], place: JSON.parse(r[5]) });
    } catch (x) {}
  }
  return reply_({ builds: out });
}
