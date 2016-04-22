var eatupDB = function(databaseUri, username, password) {
  this.databaseUri = databaseUri;
  this.db = new Firebase(DATABASE_URI);
}

eatupDB.prototype.addEatupEntry = function(userid, start, end, additionalData) {
  additionalData = (additionalData === undefined) ? {} : additionalData;

  eatupEntry = {
    userid: userid,
    start: start.getTime(),
    end: end.getTime(),
  }

  for (var key in additionalData) {
    eatupEntry[key] = additionalData[key];
  }

  // console.log("Adding: ");
  // console.log(JSON.stringify(eatupEntry));
  // console.log(start, end);

  this.db.push(eatupEntry);
}

eatupDB.prototype.getFilteredEatupEntries = function(filter, callback) {
  this.db.once("value", function(snapshot) { 

    var data = snapshot.val();
    var newData = {};
    if (data != null) {
      for (var key in data) {
        var entry = data[key];

        // Processing db entry
        entry.start = new Date(entry.start);
        entry.end = new Date(entry.end);

        // Filtering entry
        if (filter(entry)) {
          newData[key] = entry;
        }
      }
    }

    callback(newData); 
  });
}

eatupDB.prototype.trackUpdates = function(filter, callback) {
  this.db.once("value", function(snapshot) { 

    var data = snapshot.val();
    var newData = {};
    if (data != null) {
      for (var key in data) {
        var entry = data[key];

        // Processing db entry
        entry.start = new Date(entry.start);
        entry.end = new Date(entry.end);

        // Filtering entry
        if (filter(entry)) {
          newData[key] = entry;
        }
      }
    }

    callback(newData); 
  });
}