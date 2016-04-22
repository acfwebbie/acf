var eatupTable = function(tableId, earliestDate, numDaysShown, earliestTime, latestTime, timeIncrement) {
  this.tableId = tableId;
  this.table = $('#'+tableId);
  this.tableHead = this.table.find("thead");
  this.tableBody = this.table.find("tbody");
  this.earliestDate = earliestDate;
  this.numDaysShown = numDaysShown;
  this.earliestTime = earliestTime;
  this.latestTime = latestTime;
  this.timeIncrement = timeIncrement;
}

eatupTable.prototype.getDates = function(data) {
  var dates = [];
  for (i = 0; i < this.numDaysShown; i++) {
    dates.push(Date.parse(this.earliestDate).addDays(i).getTime());
  }
  return dates;
}

eatupTable.prototype.processData = function(data) {
  var tableData = {};
  for (key in data) {
    var entry = data[key];
    var entryTime = Math.floor(this.dateToHoursFloat(entry.start)/this.timeIncrement) * this.timeIncrement;
    var entryDate = entry.start.clone().clearTime().getTime();
    if (entryTime in tableData && entryDate in tableData[entryTime]) {
      tableData[entryTime][entryDate].push(entry);
    } else if (this.earliestTime <= entryTime && entryTime <= this.latestTime) {
      if (!(entryTime in tableData)) {
        tableData[entryTime] = {};
      }
      tableData[entryTime][entryDate] = [entry];
    }
  }
  return tableData;
}

eatupTable.prototype.update = function(data) {
  dates = this.getDates(data);
  tableData = this.processData(data);
  this.updateHeader(dates);
  this.updateRows(dates, tableData);
}

eatupTable.prototype.updateHeader = function(dates) {
  var tableHeadTr = $("<tr>");

  tableHeadTr.append("<th>Time</th>");

  for (var i in dates) {
    var currDate = new Date(dates[i]);
    var dateHead = $("<th>").text(currDate.toString("MM/dd"));
    tableHeadTr.append(dateHead);
  }

  this.tableHead.append(tableHeadTr);
}

eatupTable.prototype.updateRows = function(dates, tableData) {
  for (time = this.earliestTime; time < this.latestTime; time += this.timeIncrement) {
    var tableBodyTr = $("<tr>");
    tableBodyTr.append($("<td>").text(this.hoursFloatToTimeString(time)));
    for (i in dates) {
      tableBodyTr.append(this.createCell(time, dates[i], tableData));
    }
    this.tableBody.append(tableBodyTr);
  }
}

eatupTable.prototype.createCell = function(time, date, tableData) {
  if (time in tableData && date in tableData[time]) {
      var entries = tableData[time][date];
      return $("<td>").html(this.createFormatedCell(entries));
  } else {
    return $("<td>");
  }
}

eatupTable.prototype.createFormatedCell = function(entries) {
  var cellValue = entries.length;
  return cellValue;
}

eatupTable.prototype.dateToHoursFloat = function(date) {
  return date.getHours() + date.getMinutes()/60.0 + date.getSeconds()/3600.0 + date.getMilliseconds()/36000000;
}

eatupTable.prototype.hoursFloatToTimeString = function(hours) {
  return Date.today().addHours(hours).toString("hh:mm");
}