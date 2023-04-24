const getStadiumLocations = () => {
    return stadiumLocations;
};

const getStadiumLocation = (teamAbbr) => {
    const stadium = stadiumLocations.find(s => s.teamAbbr === teamAbbr);
    if (!stadium) {
        console.log(`Couldn't find stadium for: ${teamAbbr}`);
        return {}
    }

    return stadium;
}

module.exports = { getStadiumLocation, getStadiumLocations }

const stadiumLocations  = [
    {
      "park": "Chase Field",
      "teamName": "Arizona Diamondbacks",
      "teamAbbr": "ARI",
      "lattitude": 33.44527778,
      "longitude": -112.0669444
    },
    {
      "park": "Turner Field",
      "teamName": "Atlanta Braves",
      "teamAbbr": "ATL",
      "lattitude": 33.73527778,
      "longitude": -84.38944444
    },
    {
      "park": "Oriole Park at Camden Yards",
      "teamName": "Baltimore Orioles",
      "teamAbbr": "BAL",
      "lattitude": 39.28388889,
      "longitude": -76.62166667
    },
    {
      "park": "Fenway Park",
      "teamName": "Boston Red Sox",
      "teamAbbr": "BOS",
      "lattitude": 42.34638889,
      "longitude": -71.0975
    },
    {
      "park": "Wrigley Field",
      "teamName": "Chicago Cubs",
      "teamAbbr": "CHC",
      "lattitude": 41.94833333,
      "longitude": -87.65555556
    },
    {
      "park": "U.S. Cellular Field",
      "teamName": "Chicago White Sox",
      "teamAbbr": "CHW",
      "lattitude": 41.83,
      "longitude": -87.63388889
    },
    {
      "park": "Great American Ball Park",
      "teamName": "Cincinnati Reds",
      "teamAbbr": "CIN",
      "lattitude": 39.0975,
      "longitude": -84.50666667
    },
    {
      "park": "Progressive Field",
      "teamName": "Cleveland Indians",
      "teamAbbr": "CLE",
      "lattitude": 41.49583333,
      "longitude": -81.68527778
    },
    {
      "park": "Coors Field",
      "teamName": " Colorado Rockies",
      "teamAbbr": "COL",
      "lattitude": 39.75611111,
      "longitude": -104.9941667
    },
    {
      "park": "Comerica Park",
      "teamName": "Detroit Tigers",
      "teamAbbr": "DET",
      "lattitude": 42.33916667,
      "longitude": -83.04861111
    },
    {
      "park": "Minute Maid Park",
      "teamName": "Houston Astros",
      "teamAbbr": "HOU",
      "lattitude": 29.75694444,
      "longitude": -95.35555556
    },
    {
      "park": "Kauffman Stadium",
      "teamName": "Kansas City Royals",
      "teamAbbr": "KC",
      "lattitude": 39.05138889,
      "longitude": -94.48055556
    },
    {
      "park": "Angel Stadium of Anaheim",
      "teamName": "Los Angeles Angels of Anaheim",
      "teamAbbr": "LAA",
      "lattitude": 33.80027778,
      "longitude": -117.8827778
    },
    {
      "park": "Dodger Stadium",
      "teamName": "Los Angeles Dodgers",
      "teamAbbr": "LAD",
      "lattitude": 34.07361111,
      "longitude": -118.24
    },
    {
      "park": "Marlins Park",
      "teamName": "Miami Marlins",
      "teamAbbr": "MIA",
      "lattitude": 25.77805556,
      "longitude": -80.21972222
    },
    {
      "park": "Miller Park",
      "teamName": "Milwaukee Brewers",
      "teamAbbr": "MIL",
      "lattitude": 43.02833333,
      "longitude": -87.97111111
    },
    {
      "park": "Target Field",
      "teamName": "Minnesota Twins",
      "teamAbbr": "MIN",
      "lattitude": 44.98166667,
      "longitude": -93.27833333
    },
    {
      "park": "Citi Field",
      "teamName": "New York Mets",
      "teamAbbr": "NYM",
      "lattitude": 40.75694444,
      "longitude": -73.84583333
    },
    {
      "park": "Yankee Stadium",
      "teamName": "New York Yankees",
      "teamAbbr": "NYY",
      "lattitude": 40.82916667,
      "longitude": -73.92638889
    },
    {
      "park": "O.co Coliseum",
      "teamName": "Oakland Athletics",
      "teamAbbr": "OAK",
      "lattitude": 37.75166667,
      "longitude": -122.2005556
    },
    {
      "park": "Citizens Bank Park",
      "teamName": "Philadelphia Phillies",
      "teamAbbr": "PHI",
      "lattitude": 39.90583333,
      "longitude": -75.16638889
    },
    {
      "park": "PNC Park",
      "teamName": "Pittsburgh Pirates",
      "teamAbbr": "PIT",
      "lattitude": 40.44694444,
      "longitude": -80.00583333
    },
    {
      "park": "Petco Park",
      "teamName": "San Diego Padres",
      "teamAbbr": "SD",
      "lattitude": 32.70729983,
      "longitude": -117.1565998
    },
    {
      "park": "Safeco Field",
      "teamName": "Seattle Mariners",
      "teamAbbr": "SEA",
      "lattitude": 47.59138889,
      "longitude": -122.3325
    },
    {
      "park": "AT&T Park",
      "teamName": "San Francisco Giants",
      "teamAbbr": "SF",
      "lattitude": 37.77833333,
      "longitude": -122.3894444
    },
    {
      "park": "Busch Stadium",
      "teamName": "St. Louis Cardinals",
      "teamAbbr": "STL",
      "lattitude": 38.6225,
      "longitude": -90.19305556
    },
    {
      "park": "Tropicana Field",
      "teamName": "Tampa Bay Rays",
      "teamAbbr": "TB",
      "lattitude": 27.76833333,
      "longitude": -82.65333333
    },
    {
      "park": "Rangers Ballpark in Arlington",
      "teamName": "Texas Rangers",
      "teamAbbr": "TEX",
      "lattitude": 32.75138889,
      "longitude": -97.08277778
    },
    {
      "park": "Rogers Centre",
      "teamName": "Toronto Blue Jays",
      "teamAbbr": "TOR",
      "lattitude": 43.64138889,
      "longitude": -79.38916667
    },
    {
      "park": "Nationals Park",
      "teamName": "Washington Nationals",
      "teamAbbr": "WSH",
      "lattitude": 38.87277778,
      "longitude": -77.0075
    }
  ];