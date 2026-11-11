// Settings for the New Haven room plan.
// Paste the "published to web" CSV links from Google Sheets here (File > Share > Publish to web > CSV).
// These links make that tab public, so only publish what you are happy for anyone to see.
window.HAVEN_CONFIG = {
  // Required: the "New Haven Rooms" tab.
  ROOMS_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG0bZM1HIGqsGP3_XLtVJrWUqkxFtjhWNo_PZaQwi3whIdhFYc7co7lJJ8dHboP5nqz3SXQ_UkAA3f/pub?gid=201&single=true&output=csv',
  // Optional: the "Dog Database" tab. Adds male/female dots and current/proposed location.
  // Leave empty if you don't want that tab public.
  DOGS_CSV_URL: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTG0bZM1HIGqsGP3_XLtVJrWUqkxFtjhWNo_PZaQwi3whIdhFYc7co7lJJ8dHboP5nqz3SXQ_UkAA3f/pub?gid=0&single=true&output=csv',
  // How often the page checks the sheet, in seconds.
  POLL_SECONDS: 60
};
// Add ?sample=1 to the page address to preview it with made-up sample data from the sample/ folder.
