const sqlite3 = require('sqlite3');

// Open an Sqlite database and provide detailed information if an error occured
let db = new sqlite3.Database(__dirname + '/../db/nobi.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the nobi SQlite database.');
});

// Creating tables for our database
db.run("CREATE TABLE users (user_id INTEGER PRIMARY KEY NOT NULL, user_name TEXT NOT NULL, adult INTEGER, experience INTEGER)"); 
/**
 * Table: users
 *  user_id - int
 *  user_name - text
 *  adult - int // 0 - NO || 1 - YES  (>18)
 *  experience - int (1-5, where 1 - barely any and 5 - a lot)
 */
db.run("CREATE TABLE puzzles (puzzle_id INTEGER NOT NULL, hex_q INTEGER NOT NULL, hex_r INTEGER NOT NULL, hex_s INTEGER NOT NULL, hex_colour INTEGER NOT NULL)");
/**
 * Table: puzzles
 *  puzzle_id - int
 *  hex_q - int
 *  hex_r - int
 *  hex_s - int
 *  hex_colour - integer
 */
db.run("CREATE TABLE puzzles_solution (puzzle_id INTEGER NOT NULL, hex_q INTEGER NOT NULL, hex_r INTEGER NOT NULL, hex_s INTEGER NOT NULL, hex_colour INTEGER NOT NULL)");
/**
 * Table: puzzles_solution
 *  puzzle_id - int
 *  hex_q - int
 *  hex_r - int
 *  hex_s - int
 *  hex_colour - integer
 */

// uncomment when move_count and solved are implemented
//db.run("CREATE TABLE user_moves (user_id INTEGER NOT NULL, puzzle_id INTEGER NOT NULL, hex_q INTEGER NOT NULL, hex_r INTEGER NOT NULL, hex_s INTEGER NOT NULL, hex_colour INTEGER NOT NULL, move_time INTEGER NOT NULL, solved INTEGER NOT NULL, FOREIGN KEY (user_id) REFERENCES users (user_id))");
db.run("CREATE TABLE user_moves (user_id INTEGER NOT NULL, puzzle_id INTEGER NOT NULL, hex_q INTEGER NOT NULL, hex_r INTEGER NOT NULL, hex_s INTEGER NOT NULL, hex_colour INTEGER NOT NULL, move_number INTEGER ,move_time INTEGER, solved INTEGER, FOREIGN KEY (user_id) REFERENCES users (user_id))");
/**
 * Table: puzzles
 *  user_id - int , foreign key linked to users (user_id)
 *  puzzle_id - int
 *  hex_q - int
 *  hex_r - int
 *  hex_s - int
 *  hex_colour - int
 *  move_count - int
 *  solved - int // 1 - solved || 0 - not solved
 */
// Contains how the user rated the puzzle afteer solving it
db.run("CREATE TABLE puzzle_rating (user_id INTEGER NOT NULL, puzzle_id INTEGER NOT NULL, difficulty INTEGER NOT NULL, interesting INTEGER NOT NULL)");
/**
 * Table: puzzle_rating
 *  user_id - int
 *  puzzle_id - int
 *  difficulty - int
 *  interesting - int
 */

// Closing the database connection after all pending queries are completed
db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});