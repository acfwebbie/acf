var EARLIEST_DATE = "3 days ago";
var NUM_DAYS_SHOWN = 7;
var EARLIEST_TIME = 8.0;
var LATEST_TIME = 24.0;
var TIME_INCREMENT = 0.5;
var DATABASE_URI = "https://acfeatup.firebaseio.com/eatups";
var CALENDAR_TABLE_ID = "eatupVisual";

(function($){
  $(function(){
    $('.button-collapse').sideNav();
    runEatups();
  });
})(jQuery);

function runEatups() {
  var db = new eatupDB(DATABASE_URI);
  var visual = new eatupVisual(CALENDAR_TABLE_ID,
                             EARLIEST_DATE,
                             NUM_DAYS_SHOWN,
                             EARLIEST_TIME,
                             LATEST_TIME,
                             TIME_INCREMENT);

  var start = Date.today().setTimeToNow();
  var end = Date.today().setTimeToNow().addHours(3);

  db.addEatupEntry(1, start, end);

  db.getFilteredEatupEntries(function(entry) {
    return (
      (entry.start.compareTo(Date.parse(EARLIEST_DATE)) != -1) && 
      (entry.end.compareTo(Date.parse(EARLIEST_DATE).addDays(7)) != 1)
    );
  }, function(data) {
    visual.create(data);;
  });

  db.trackUpdates(function(entry) {
    return (
      (entry.start.compareTo(Date.parse(EARLIEST_DATE)) != -1) && 
      (entry.end.compareTo(Date.parse(EARLIEST_DATE).addDays(7)) != 1)
    );
  }, function(data) {
    // visual.update(data);;
  });
}