const moment = require('moment-timezone');

function roundToNearestHourAndConvertTimezone(date, timezone) {
  const momentDate = convertToTimezone(date, timezone);
  const roundedMoment = roundToNearestHour(momentDate);
  const result = roundedMoment.format(`YYYY-MM-DD HH:mm`);

  return result;
}

const convertToTimezone = (date, timezone) => {
  // convert the timestamp to a date object
  const d = moment(date);

  // convert the date to the specified timezone
  const momentDate = moment.tz(d, timezone);
  return momentDate;
}

const roundToNearestHour = (moment) => {
  const roundedMoment = moment.startOf('hour').add(moment.minutes() < 30 ? 0 : 1, 'hour');
  return roundedMoment;
}

function addHoursToTimestamp(timestamp, hours) {
  // convert the timestamp to a Date object
  const date = new Date(timestamp);

  // add the specified number of hours to the date
  date.setHours(date.getHours() + hours);

  // return the timestamp of the updated date
  return date.getTime();
}


function addHoursToDate(inputDate, hoursToAdd) {
  // Create a new Date object from the input date string
  let date = new Date(inputDate.replace(/-/g, '/') + ':00');
  
  // Add the specified number of hours to the date
  date.setTime(date.getTime() + (hoursToAdd * 60 * 60 * 1000));
  
  // Format the output date as a string in the desired format
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hours = ("0" + date.getHours()).slice(-2);
  let minutes = ("0" + date.getMinutes()).slice(-2);
  let outputDate = `${year}-${month}-${day} ${hours}:${minutes}`;
  
  return outputDate;
}


function getTodayAndXMore(numberToGet) {
  const today = new Date();
  const todayInPacificTime = convertToTimezone(today, "America/Los_Angeles");
  let formatted = todayInPacificTime.format(`YYYY-MM-DD`);

  let formattedDates = [];
  formattedDates.push(formatted);
  for (let i = 1; i <= numberToGet; i++) {
    formatted = addOneDay(formatted);
    formattedDates.push(formatted)
  }

  return formattedDates;
}

function addOneDay(dateString) {
  // Convert the input string to a Date object
  let date = new Date(dateString);
  
  // Add one day to the date
  date.setUTCDate(date.getUTCDate() + 1);
  
  // Format the output date as "yyyy-mm-dd"
  let year = date.getUTCFullYear();
  let month = ("0" + (date.getUTCMonth() + 1)).slice(-2);
  let day = ("0" + date.getUTCDate()).slice(-2);
  let outputDate = year + "-" + month + "-" + day;
  
  return outputDate;
}






module.exports = { getTodayAndXMore, roundToNearestHourAndConvertTimezone, addHoursToTimestamp, addHoursToDate, addOneDay };
