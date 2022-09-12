const sqlite = require('sqlite3').verbose();

const handleError = (error) => {
  if (error) {
    console.error(error);
  }
}

const db = new sqlite.Database('data.db', error => {
  if (error) {
    handleError(error);
  } else {
    createDivisionsTable();
    createTitlesTable();
    createUsersTable();
  }
});

const createDivisionsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS divisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE,
      active INTEGER DEFAULT 1 NOT NULL
    );
  `;

  db.run(sql, handleError);
};

const createTitlesTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS titles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE COLLATE NOCASE,
      active INTEGER DEFAULT 1 NOT NULL
    );
  `;

  db.run(sql, handleError);
};

const createUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      titleId INTEGER NOT NULL,
      divisionId INTEGER NOT NULL,
      email TEXT NOT NULL UNIQUE COLLATE NOCASE,
      phone TEXT NOT NULL UNIQUE
    );
  `;

  db.run(sql, handleError);
};

module.exports = db;