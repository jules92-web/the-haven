// Settings for "Build your own plan".
window.HAVEN_BUILD_CONFIG = {
  // The "Dog Database" tab, published to the web as CSV (same link as the room plan uses).
  DOGS_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG0bZM1HIGqsGP3_XLtVJrWUqkxFtjhWNo_PZaQwi3whIdhFYc7co7lJJ8dHboP5nqz3SXQ_UkAA3f/pub?gid=0&single=true&output=csv',
  // The web address of the small Google Apps Script that saves and lists published plans.
  // Leave empty until it is set up (see apps-script.gs). Until then people can still build and
  // save plans on their own phone, but not publish them.
  BUILDS_API_URL: '',
  // How often the list of published plans refreshes, in seconds.
  POLL_SECONDS: 60
};
// Add ?sample=1 to the page address to try it with made-up sample dogs and plans.
