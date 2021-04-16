export const init_db = async (db: any) => {  await db.none(    `CREATE TABLE IF NOT EXISTS users (      username varchar(256) PRIMARY KEY,      email varchar(256) UNIQUE NOT NULL,      password text NOT NULL,      test boolean NOT NULL DEFAULT FALSE    );    CREATE INDEX IF NOT EXISTS users_username_index ON users (username);    CREATE TABLE IF NOT EXISTS sessions (      username varchar(256) REFERENCES users NOT NULL,      sessionID varchar(32) PRIMARY KEY,      last_activity timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL    );    CREATE INDEX IF NOT EXISTS sessions_sessionID_index ON sessions (sessionID);    CREATE TABLE IF NOT EXISTS ideas (      ideaname varchar(256) PRIMARY KEY,      username varchar(256) REFERENCES users NOT NULL,      describtion text NOT NULL,      short_desc text NOT NULL,      link text NOT NULL    );    CREATE INDEX IF NOT EXISTS ideas_ideaname_index ON ideas (ideaname);    CREATE TABLE IF NOT EXISTS tags (      tagname varchar(256) PRIMARY KEY    );    CREATE INDEX IF NOT EXISTS tags_tagname_index ON tags (tagname);    CREATE TABLE IF NOT EXISTS ideastags (      ideaname varchar(256) REFERENCES ideas NOT NULL,      tagname varchar(256) REFERENCES tags NOT NULL    );    CREATE INDEX IF NOT EXISTS ideastags_ideaname_index ON ideastags (ideaname);    CREATE TABLE IF NOT EXISTS comments (      commentID SERIAL PRIMARY KEY,      ideaname varchar(256) REFERENCES ideas NOT NULL,      commenttext text NOT NULL,      username varchar(256) REFERENCES users NOT NULL    );    CREATE INDEX IF NOT EXISTS comments_ideaname_index ON comments (ideaname);    CREATE TABLE IF NOT EXISTS announcement (      ideaname varchar(256) REFERENCES ideas NOT NULL,      username varchar(256) REFERENCES users NOT NULL,      anname varchar(256) PRIMARY KEY,      text text NOT NULL    );    CREATE INDEX IF NOT EXISTS announcement_ideaname_index ON announcement (ideaname);    CREATE TABLE IF NOT EXISTS antags (      anname varchar(256) REFERENCES announcement NOT NULL,      tagname varchar(256) REFERENCES tags NOT NULL    );    CREATE INDEX IF NOT EXISTS antags_anname_index ON antags (anname);    CREATE TABLE IF NOT EXISTS ancomments (      commentID SERIAL PRIMARY KEY,      anname varchar(256) REFERENCES ideas NOT NULL,      commenttext text NOT NULL,      username varchar(256) REFERENCES users NOT NULL    );    CREATE INDEX IF NOT EXISTS ancomments_anname_index ON ancomments (anname);    `,  )}