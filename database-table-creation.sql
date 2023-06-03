CREATE TABLE IF NOT EXISTS users (
    id serial NOT NULL PRIMARY KEY,
    email VARCHAR(100), 
    password VARCHAR(500),             
    salt VARCHAR(200),    
    token text,
    dateloggedin TIMESTAMP,
    datecreated TIMESTAMP
    );


CREATE TABLE IF NOT EXISTS user_yahoo_info (
    id serial NOT NULL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    auth_code VARCHAR(100),
    refresh_token VARCHAR(500), 
    access_token VARCHAR,
    FOREIGN KEY (user_id) REFERENCES users(Id)
    );
	
CREATE TABLE IF NOT EXISTS league_type (
	id serial NOT NULL PRIMARY KEY,
	league_type_name VARCHAR(50),
	league_type_id INTEGER UNIQUE NOT NULL
);

INSERT INTO league_type (league_type_name, league_type_id)
VALUES ('YAHOO', 1)
ON CONFLICT DO NOTHING;
	
CREATE TABLE IF NOT EXISTS user_league (
	id serial NOT NULL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	league_id VARCHAR(150),
    nickname VARCHAR(100),
	league_type_id INTEGER NOT NULL,
	FOREIGN KEY (league_type_id) REFERENCES league_type(league_type_id),
	UNIQUE (league_id, user_id)
);

CREATE TABLE IF NOT EXISTS user_team (
	id serial NOT NULL PRIMARY KEY,
	user_id INTEGER NOT NULL,
	team_id VARCHAR(150),
	league_id VARCHAR(150),
	FOREIGN KEY (league_id, user_id) REFERENCES user_league(league_id, user_id),
	UNIQUE(team_id, league_id)
);


 CREATE TABLE IF NOT EXISTS player_id_type (
 	id serial NOT NULL PRIMARY KEY,
	 player_id_type_name VARCHAR(50),
	 player_id_type_id INTEGER UNIQUE NOT NULL
 );
 
 INSERT INTO player_id_type (player_id_type_name, player_id_type_id)
 	VALUES ('YahooPlayerId', 1)
	ON CONFLICT DO NOTHING;


 CREATE TABLE IF NOT EXISTS user_watchlist (
 	id serial NOT NULL PRIMARY KEY, 
	 user_id INTEGER NOT NULL,
	 player_id VARCHAR(200),
	 player_id_type_id INTEGER,
	 league_id VARCHAR(150),
	 game_id INTEGER NOT NULL,
	 game_datetime TIMESTAMP,
	 FOREIGN KEY (player_id_type_id) REFERENCES player_id_type(player_id_type_id),
	 FOREIGN KEY (league_id, user_id) REFERENCES user_league(league_id, user_id),
	 FOREIGN KEY (user_id) REFERENCES users(id),
	 UNIQUE(player_id, league_id, game_id)
 );

CREATE TABLE IF NOT EXISTS player_id_lookup
(
    IDPLAYER VARCHAR(50) PRIMARY KEY,
    PLAYERNAME VARCHAR(200) NOT NULL,
    FIRSTNAME VARCHAR(100),
    LASTNAME VARCHAR(100),
    IDFANGRAPHS INTEGER,
    FANGRAPHSNAME VARCHAR(200),
    MLBID INTEGER,
    MLBNAME VARCHAR(200),
    CBSID INTEGER,
    CBSNAME VARCHAR(200),
    RETROID VARCHAR(50),
    BREFID VARCHAR(50),
    NFBCID INTEGER,
    NFBCNAME VARCHAR(200),
    ESPNID INTEGER,
    ESPNNAME VARCHAR(200),
    KFFLNAME VARCHAR(200),
    DAVENPORTID VARCHAR(100),
    BPID INTEGER,
    YAHOOID INTEGER,
    YAHOONAME VARCHAR(200),
    MSTRBLLNAME VARCHAR(200),
    FANTPROSNAME VARCHAR(200),
    LASTCOMMAFIRST VARCHAR(200),
    ROTOWIREID INTEGER,
    FANDUELNAME VARCHAR(200),
    FANDUELID INTEGER,
    DRAFTKINGSNAME VARCHAR(200),
    OTTONEUID INTEGER,
    HQID INTEGER,
    RAZZBALLNAME VARCHAR(200),
    FANTRAXID VARCHAR(50),
    FANTRAXNAME VARCHAR(200),
    ROTOWIRENAME VARCHAR(200),
    NFBCLASTFIRST VARCHAR(200),
    ACTIVE BOOLEAN
);

 CREATE INDEX  IF NOT EXISTS pil_yahooid_idx ON player_id_lookup (YAHOOID);
 CREATE INDEX  IF NOT EXISTS pil_yahooname_idx ON player_id_lookup (lower(YAHOONAME));
 CREATE INDEX  IF NOT EXISTS pil_mlbid_idx ON player_id_lookup (MLBID);
 CREATE INDEX  IF NOT EXISTS pil_mlbname_idx ON player_id_lookup (lower(MLBNAME));
 CREATE INDEX  IF NOT EXISTS pil_espnid_idx ON player_id_lookup (ESPNID);
 CREATE INDEX  IF NOT EXISTS pil_espnname_idx ON player_id_lookup (lower(ESPNNAME));


CREATE TABLE IF NOT EXISTS add_drop_schedule (
 	id serial NOT NULL PRIMARY KEY, 
	 user_id INTEGER NOT NULL,
	 add_player_id VARCHAR(200) NOT NULL,
	 drop_player_id VARCHAR(200),
	 league_id VARCHAR(150) NOT NULL,
	 team_id VARCHAR(150) NOT NULL,
	 earliest_add_time_utc TIMESTAMPTZ,
	 has_executed boolean DEFAULT FALSE,
	 attempts INTEGER DEFAULT 0,
	 last_attempt_utc TIMESTAMPTZ,
 
	 FOREIGN KEY (league_id, user_id) REFERENCES user_league(league_id, user_id),
	 FOREIGN KEY (team_id, league_id) REFERENCES user_team(team_id, league_id),
	 FOREIGN KEY (user_id) REFERENCES users(id),
	 UNIQUE(user_id, add_player_id, drop_player_id, league_id, team_id)
 );
 
 
 

 --===================================================================================================================================================
 -- MANUAL PLAYER UPDATES RAN --
 

	
 UPDATE player_id_lookup SET YAHOONAME = 'Jake Irvin' 			, YAHOOID = 11560 WHERE IDPlayer = 'irvinja01'; 
 UPDATE player_id_lookup SET YAHOONAME = 'Matt McLain' 			, YAHOOID = 12390 WHERE IDPlayer = 'mclaima01'; 
 UPDATE player_id_lookup SET YAHOONAME = 'J.P. France' 			, YAHOOID = 12725 WHERE IDPlayer = 'francjp01';  
 UPDATE player_id_lookup SET YAHOONAME = 'Huascar Brazoban' 	, YAHOOID = 12658 WHERE IDPlayer = 'brazohu01'; 
 UPDATE player_id_lookup SET YAHOONAME = 'Jhony Brito' 			, YAHOOID = 12716 WHERE IDPlayer = 'britojh01'; 
 UPDATE player_id_lookup SET YAHOONAME = 'Peyton Battenfield' 	, YAHOOID = 12402 WHERE IDPlayer = 'battepe01'; 