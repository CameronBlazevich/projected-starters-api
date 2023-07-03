const {
  addHoursToDate,
  roundToNearestHourAndConvertTimezone,
  addOneDay,
} = require('../utilities/dateHelper');
const {
  extractNumbersFromString,
} = require('../utilities/extract-numbers-from-string');
const { getStadiumLocations } = require('../stadiums/stadium-locations');

const { getWeatherForecast } = require('./weather-api');

const getWeatherInfoAtStadiums = async () => {
  const stadiumLocations = getStadiumLocations();

  const weatherResults = [];

  for (let i = 0; i < stadiumLocations.length; i++) {
    try {
      const stadiumForecast = await getWeatherForecast(
        stadiumLocations[i].lattitude,
        stadiumLocations[i].longitude
      );

      // map result to only useful info
      const mapped = mapStadiumForecast(stadiumForecast, stadiumLocations[i]);
      weatherResults.push(mapped);
    } catch (error) {
      console.log(error);
    }
  }

  return weatherResults;
};

const mapStadiumForecast = (weatherForecast, stadiumLocation) => {
  //ToDo: throw away a bunch of data in the middle of the night

  const mapped = {
    teamAbbr: stadiumLocation.teamAbbr,
    parkName: stadiumLocation.park,
    lattitude: stadiumLocation.lattitude,
    longitude: stadiumLocation.longitude,
    location: weatherForecast.location,
  };

  const forecastDays = mapForecastDays(weatherForecast.forecast.forecastday);

  mapped.forecast = {
    days: forecastDays,
  };

  return mapped;
};

const mapForecastDays = (forecastDays) => {
  let mappedDays = [];
  for (let i = 0; i < forecastDays.length; i++) {
    const day = forecastDays[i];
    const mapped = {
      date: day.date,
      high: day.maxtemp_f,
      low: day.mintemp_f,
    };

    const hourlyForecast = mapHourlyForecast(day.hour);
    mapped.hourlyForecast = hourlyForecast;

    mappedDays.push(mapped);
  }
  return mappedDays;
};

const mapHourlyForecast = (hourlyInfo) => {
  const dayHours = [];
  for (let i = 0; i < hourlyInfo.length; i++) {
    const hour = hourlyInfo[i];

    const mappedHour = {
      time_epoch: hour.time_epoch,
      //ToDo: figure out what tz this time is
      time_local: hour.time,
      temp_f: hour.temp_f,
      wind: {
        speed_mph: hour.wind_mph,
        direction: hour.wind_dir,
        degree: hour.wind_degree,
        gust_mph: hour.gust_mph,
      },
      humidity: hour.humidity,
      feels_like_f: hour.feelslike_f,
      chance_of_rain: hour.chance_of_rain,
      chance_of_snow: hour.chance_of_snow,
      condition: {
        description: hour.condition.text,
        icon: hour.condition.icon,
      },
    };

    dayHours.push(mappedHour);
  }

  return dayHours;
};

const addWeatherInfoToProjectedLineups = (weatherInfo, projectedLineups) => {
  for (let i = 0; i < projectedLineups.length; i++) {
    const dayOfGames = projectedLineups[i];

    const games = dayOfGames.games;

    for (var j = 0; j < games?.length; j++) {
      const game = games[j];

      const weatherInfoAtStadium = weatherInfo.find(
        (wi) => wi.teamAbbr === game.homeTeam
      );
      if (!weatherInfoAtStadium) {
        console.log(`Didn't find any weather info for ${game.homeTeam}`);
      }

      // get gameTime in local time
      const tzAtStadium = weatherInfoAtStadium.location.tz_id;
      game.stadium_timezone = tzAtStadium;

      const gameTimeStamp = parseInt(
        extractNumbersFromString(game.dateTime),
        10
      );

      const gameTimeAtStadium = roundToNearestHourAndConvertTimezone(
        gameTimeStamp,
        tzAtStadium
      );

      const formattedDate = gameTimeAtStadium.slice(0, 10);

      const weatherInfoForDayOfGame = weatherInfoAtStadium.forecast.days.find(
        (day) => day.date === formattedDate
      );
      if (!weatherInfoForDayOfGame) {
        // we're probably too late in the day to retrieve forecast info for this day
        console.log(`No weather info for ${formattedDate}`);
        continue;
      }

      const weatherAroundGame = [];
      for (let k = -2; k < 5; k++) {
        const hourToFind = addHoursToDate(gameTimeAtStadium, k);
        let weatherAtThatHour = weatherInfoForDayOfGame.hourlyForecast.find(
          (hf) => hf.time_local === hourToFind
        );
        if (!weatherAtThatHour) {
          const weatherInfoForNextDay = weatherInfoAtStadium.forecast.days.find(
            (day) => day.date === addOneDay(formattedDate)
          );
          weatherAtThatHour = weatherInfoForNextDay.hourlyForecast.find(
            (hf) => hf.time_local === hourToFind
          );
        }
        weatherAroundGame.push(weatherAtThatHour);
      }

      game.weather = weatherAroundGame;
    }
  }

  return projectedLineups;
};

module.exports = { addWeatherInfoToProjectedLineups, getWeatherInfoAtStadiums };
