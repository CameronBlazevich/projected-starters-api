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