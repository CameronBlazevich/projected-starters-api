const express = require('express');
const router = express.Router();
const cacheManager = require('../cache/cache-manager');
const { addHoursToDate, roundToNearestHourAndConvertTimezone, addOneDay } = require('../utilities/dateHelper');
const { extractNumbersFromString } = require('../utilities/extract-numbers-from-string')


router.get("/", async (req, res) => {
    try {
        const weatherInfo = cacheManager.getFromCache('weather-info');
        const projectedLineups = cacheManager.getFromCache('projected-lineups');


        //=============================================
        // extract later

        for (let i= 0; i < projectedLineups.length; i++) {
            const dayOfGames = projectedLineups[i];
            

            const games = dayOfGames.games;

            for (var j=0; j < games.length; j++) {
                const game = games[j];

                const weatherInfoAtStadium = weatherInfo.find(wi => wi.teamAbbr === game.homeTeam);
                if (!weatherInfoAtStadium) {
                    console.log(`Didn't find any weather info for ${game.homeTeam.teamAbbr}`)
                }

                // get gameTime in local time
                const tzAtStadium = weatherInfoAtStadium.location.tz_id;
                game.stadium_timezone = tzAtStadium;

                const gameTimeStamp = parseInt(extractNumbersFromString(game.dateTime), 10);

                const gameTimeAtStadium = roundToNearestHourAndConvertTimezone(gameTimeStamp, tzAtStadium);

                const formattedDate = gameTimeAtStadium.slice(0,10);
                
                const weatherInfoForDayOfGame = weatherInfoAtStadium.forecast.days.find(day => day.date === formattedDate);
                if (!weatherInfoForDayOfGame) {
                    // we're probably too late in the day to retrieve forecast info for this day
                    console.log(`No weather info for ${formattedDate}`)
                    continue;
                }

                const weatherAroundGame = []
                for (let k = -2; k < 5; k++) {
                    const hourToFind = (addHoursToDate(gameTimeAtStadium, k));
                    let weatherAtThatHour = weatherInfoForDayOfGame.hourlyForecast.find(hf => hf.time_local === hourToFind)
                    if (!weatherAtThatHour) {
                        const weatherInfoForNextDay = weatherInfoAtStadium.forecast.days.find(day => day.date === addOneDay(formattedDate));
                        weatherAtThatHour = weatherInfoForNextDay.hourlyForecast.find(hf => hf.time_local === hourToFind);
                    }
                    weatherAroundGame.push(weatherAtThatHour);
                }

                game.weather = weatherAroundGame;
            }
        }


        //============================================


        return res.status(200).json(projectedLineups);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
})

module.exports = router;