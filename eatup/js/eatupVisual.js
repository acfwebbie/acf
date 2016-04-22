var eatupVisual = function(visualId, earliestDate, numDaysShown, earliestTime, latestTime, timeIncrement) {
  this.visualId = visualId;
  this.visual = $('#'+visualId);
  this.earliestDate = earliestDate;
  this.numDaysShown = numDaysShown;
  this.earliestTime = earliestTime;
  this.latestTime = latestTime;
  this.timeIncrement = timeIncrement;
  this.lowerIntensityColor = {r: 240, g: 240, b: 240};
  this.upperIntensityColor = {r: 0, g: 0, b: 0};
  this.highestIntensityNumEntries = 20.0;
  this.tableId = "eatupTable"
}

eatupVisual.prototype.getDates = function(data) {
  var dates = [];
  for (i = 0; i < this.numDaysShown; i++) {
    dates.push(Date.parse(this.earliestDate).addDays(i).getTime());
  }
  return dates;
}

eatupVisual.prototype.processData = function(data) {
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

eatupVisual.prototype.create = function(data) {
  dates = this.getDates(data);
  tableData = this.processData(data);
  table = $("<table>");
  table.attr("id", this.tableId);
  tableHead = $("<thead>");
  tableBody = $("<tbody>");
  this.updateHeader(tableHead, dates);
  this.updateRows(tableBody, dates, tableData);
  table.append(tableHead);
  table.append(tableBody);
  this.visual.append(table);
}

eatupVisual.prototype.update = function(data) {
  // tableData = this.processData(data);
  // var time = ;

  // this.updateCell()
}

eatupVisual.prototype.updateHeader = function(tableHead, dates) {
  var tableHeadTr = $("<tr>");

  tableHeadTr.append("<th>Time</th>");

  for (var i in dates) {
    var currDate = new Date(dates[i]);
    var dateHead = $("<th>").text(currDate.toString("MM/dd"));
    tableHeadTr.append(dateHead);
  }

  tableHead.append(tableHeadTr);
}

eatupVisual.prototype.updateRows = function(tableBody, dates, tableData) {
  for (time = this.earliestTime; time < this.latestTime; time += this.timeIncrement) {
    var tableBodyTr = $("<tr>");
    tableBodyTr.append($("<td>").text(this.hoursFloatToTimeString(time)));
    for (i in dates) {
      tableBodyTr.append(this.createCell(time, dates[i], tableData));
    }
    tableBody.append(tableBodyTr);
  }
}

eatupVisual.prototype.createCell = function(time, date, tableData) {
  if (time in tableData && date in tableData[time]) {
      var entries = tableData[time][date];
      return $("<td>").attr("id", "td_" + time.toString() + "_" + date.toString()).html(this.createFormatedCell(entries));
  } else {
    return $("<td>").attr("id", "td_" + time.toString() + "_" + date.toString()).html(this.createFormatedCell([]));
  }
}

eatupVisual.prototype.updateCell = function(time, date, tableData) {
  var cell = $("#id_" + time.toString() + "_" + date.toString());
  if (time in tableData && date in tableData[time]) {
      var entries = tableData[time][date];
      cell.html(this.createFormatedCell(entries));
  } else {
    cell.html(this.createFormatedCell([]));
  }
}

eatupVisual.prototype.getIntensityColor = function(n) {
  var redRange = this.upperIntensityColor.r - this.lowerIntensityColor.r;
  var greenRange = this.upperIntensityColor.g - this.lowerIntensityColor.g;
  var blueRange = this.upperIntensityColor.b - this.lowerIntensityColor.b;
  var intensity = Math.min(1.0, n/this.highestIntensityNumEntries);
  var red = Math.round(this.lowerIntensityColor.r + intensity * redRange);
  var green = Math.round(this.lowerIntensityColor.g + intensity * greenRange);
  var blue = Math.round(this.lowerIntensityColor.b + intensity * blueRange);
  return "rgb(" + red.toString() + "," + green.toString() + "," + blue.toString() + ")";
}

eatupVisual.prototype.createFormatedCell = function(entries) {
  var cellValue = entries.length;
  var newButton = $("<a>");
  newButton.addClass("calCell waves-effect waves-light btn");
  newButton.css("background-color", this.getIntensityColor(entries.length));
  var text = $("<div>");
  text.text(entries.length);
  newButton.append(text);
  return newButton;
}

eatupVisual.prototype.dateToHoursFloat = function(date) {
  return date.getHours() + date.getMinutes()/60.0 + date.getSeconds()/3600.0 + date.getMilliseconds()/36000000;
}

eatupVisual.prototype.hoursFloatToTimeString = function(hours) {
  return Date.today().addHours(hours).toString("hh:mm");
}