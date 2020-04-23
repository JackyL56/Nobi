const sqlite3 = require('sqlite3');

// Open an Sqlite database and provide detailed information if an error occured
let db = new sqlite3.Database('./db/nobi.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the nobi SQlite database.');
});


db.serialize(() => {

    // TUTORIAL PUZZLE 0
    // insert hex positions of puzzle 1:  (puzzle_id, hex_q, hex_r, hex_s, hex_colour)
    db.run("INSERT INTO puzzles VALUES (0,-3,0,3,1)");
    db.run("INSERT INTO puzzles VALUES (0,-3,1,2,2)");
    db.run("INSERT INTO puzzles VALUES (0,-2,-1,3,0)");
    db.run("INSERT INTO puzzles VALUES (0,-2,0,2,2)");
    db.run("INSERT INTO puzzles VALUES (0,-2,1,1,1)");
    db.run("INSERT INTO puzzles VALUES (0,-1,-1,2,0)");
    db.run("INSERT INTO puzzles VALUES (0,-1,0,1,0)");
    db.run("INSERT INTO puzzles VALUES (0,0,0,0,1)");
    db.run("INSERT INTO puzzles VALUES (0,1,0,-1,0)");
    db.run("INSERT INTO puzzles VALUES (0,1,1,-2,0)");
    db.run("INSERT INTO puzzles VALUES (0,2,-1,-1,1)");
    db.run("INSERT INTO puzzles VALUES (0,2,0,-2,3)");
    db.run("INSERT INTO puzzles VALUES (0,2,1,-3,0)");
    db.run("INSERT INTO puzzles VALUES (0,3,-1,-2,3)");
    db.run("INSERT INTO puzzles VALUES (0,3,0,-3,0)");


    // PUZZLE 1
    // insert hex positions of puzzle 1:  (puzzle_id, hex_q, hex_r, hex_s, hex_colour)
    db.run("INSERT INTO puzzles VALUES (1,-2,0,2,0)");
    db.run("INSERT INTO puzzles VALUES (1,-2,1,1,0)");
    db.run("INSERT INTO puzzles VALUES (1,-2,2,0,0)");
    db.run("INSERT INTO puzzles VALUES (1,-1,-1,2,0)");
    db.run("INSERT INTO puzzles VALUES (1,-1,0,1,0)");
    db.run("INSERT INTO puzzles VALUES (1,-1,1,0,1)");
    db.run("INSERT INTO puzzles VALUES (1,-1,2,-1,0)");
    db.run("INSERT INTO puzzles VALUES (1,0,-2,2,2)");
    db.run("INSERT INTO puzzles VALUES (1,0,-1,1,0)");
    db.run("INSERT INTO puzzles VALUES (1,0,0,0,0)");
    db.run("INSERT INTO puzzles VALUES (1,0,1,-1,3)");
    db.run("INSERT INTO puzzles VALUES (1,0,2,-2,0)");
    db.run("INSERT INTO puzzles VALUES (1,1,-2,1,0)");
    db.run("INSERT INTO puzzles VALUES (1,1,-1,0,0)");
    db.run("INSERT INTO puzzles VALUES (1,1,0,-1,2)");
    db.run("INSERT INTO puzzles VALUES (1,1,1,-2,0)");
    db.run("INSERT INTO puzzles VALUES (1,2,-2,0,1)");
    db.run("INSERT INTO puzzles VALUES (1,2,-1,-1,0)");
    db.run("INSERT INTO puzzles VALUES (1,2,0,-2,3)");

    // PUZZLE 2
    // insert hex positions of puzzle 1:  (puzzle_id, hex_q, hex_r, hex_s, hex_colour)
    db.run("INSERT INTO puzzles VALUES (2,-2,0,2,0)");
    db.run("INSERT INTO puzzles VALUES (2,-2,1,1,0)");
    db.run("INSERT INTO puzzles VALUES (2,-2,2,0,3)");
    db.run("INSERT INTO puzzles VALUES (2,-1,-1,2,2)");
    db.run("INSERT INTO puzzles VALUES (2,-1,0,1,0)");
    db.run("INSERT INTO puzzles VALUES (2,-1,1,0,2)");
    db.run("INSERT INTO puzzles VALUES (2,-1,2,-1,4)");
    db.run("INSERT INTO puzzles VALUES (2,0,-2,2,1)");
    db.run("INSERT INTO puzzles VALUES (2,0,-1,1,0)");
    db.run("INSERT INTO puzzles VALUES (2,0,0,0,0)");
    db.run("INSERT INTO puzzles VALUES (2,0,1,-1,0)");
    db.run("INSERT INTO puzzles VALUES (2,0,2,-2,0)");
    db.run("INSERT INTO puzzles VALUES (2,1,-2,1,0)");
    db.run("INSERT INTO puzzles VALUES (2,1,-1,0,3)");
    db.run("INSERT INTO puzzles VALUES (2,1,0,-1,0)");
    db.run("INSERT INTO puzzles VALUES (2,1,1,-2,0)");
    db.run("INSERT INTO puzzles VALUES (2,2,-2,0,0)");
    db.run("INSERT INTO puzzles VALUES (2,2,-1,-1,0)");
    db.run("INSERT INTO puzzles VALUES (2,2,0,-2,0)");

    // TUTORIAL PUZZLE 0 SOLUTION
    // insert hex positions of puzzle 1:  (puzzle_id, hex_q, hex_r, hex_s, hex_colour)
    db.run("INSERT INTO puzzles_solution VALUES (0,-3,0,3,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,-3,1,2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (0,-2,-1,3,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,-2,0,2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (0,-2,1,1,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,-1,-1,2,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,-1,0,1,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,0,0,0,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,1,0,-1,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,1,1,-2,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,2,-1,-1,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,2,0,-2,3)");
    db.run("INSERT INTO puzzles_solution VALUES (0,2,1,-3,1)");
    db.run("INSERT INTO puzzles_solution VALUES (0,3,-1,-2,3)");
    db.run("INSERT INTO puzzles_solution VALUES (0,3,0,-3,1)");


    // PUZZLE 1 SOLUTION
    // insert hex positions of puzzle 1:  (puzzle_id, hex_q, hex_r, hex_s, hex_colour)
    db.run("INSERT INTO puzzles_solution VALUES (1,-2,0,2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,-2,1,1,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,-2,2,0,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,-1,-1,2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,-1,0,1,1)");
    db.run("INSERT INTO puzzles_solution VALUES (1,-1,1,0,1)");
    db.run("INSERT INTO puzzles_solution VALUES (1,-1,2,-1,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,0,-2,2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,0,-1,1,1)");
    db.run("INSERT INTO puzzles_solution VALUES (1,0,0,0,3)");
    db.run("INSERT INTO puzzles_solution VALUES (1,0,1,-1,3)");
    db.run("INSERT INTO puzzles_solution VALUES (1,0,2,-2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,1,-2,1,1)");
    db.run("INSERT INTO puzzles_solution VALUES (1,1,-1,0,3)");
    db.run("INSERT INTO puzzles_solution VALUES (1,1,0,-1,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,1,1,-2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (1,2,-2,0,1)");
    db.run("INSERT INTO puzzles_solution VALUES (1,2,-1,-1,3)");
    db.run("INSERT INTO puzzles_solution VALUES (1,2,0,-2,3)");

    // PUZZLE 2 SOLUTION
    // insert hex positions of puzzle 1:  (puzzle_id, hex_q, hex_r, hex_s, hex_colour)
    db.run("INSERT INTO puzzles_solution VALUES (2,-2,0,2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,-2,1,1,3)");
    db.run("INSERT INTO puzzles_solution VALUES (2,-2,2,0,3)");
    db.run("INSERT INTO puzzles_solution VALUES (2,-1,-1,2,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,-1,0,1,3)");
    db.run("INSERT INTO puzzles_solution VALUES (2,-1,1,0,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,-1,2,-1,4)");
    db.run("INSERT INTO puzzles_solution VALUES (2,0,-2,2,1)");
    db.run("INSERT INTO puzzles_solution VALUES (2,0,-1,1,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,0,0,0,3)");
    db.run("INSERT INTO puzzles_solution VALUES (2,0,1,-1,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,0,2,-2,4)");
    db.run("INSERT INTO puzzles_solution VALUES (2,1,-2,1,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,1,-1,0,3)");
    db.run("INSERT INTO puzzles_solution VALUES (2,1,0,-1,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,1,1,-2,4)");
    db.run("INSERT INTO puzzles_solution VALUES (2,2,-2,0,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,2,-1,-1,2)");
    db.run("INSERT INTO puzzles_solution VALUES (2,2,0,-2,4)");


    console.log('successfully created the users_to_pets table in pets.db');
  
    // print them out to confirm their contents:
    db.each("SELECT puzzle_id, hex_q, hex_r, hex_s, hex_colour FROM puzzles", (err, row) => {
        console.log('Puzzle '+row.puzzle_id + ": Hex(" + row.hex_q + ',' + row.hex_r + ',' + row.hex_s + ') colour: '+ row.hex_colour);
    });
});

db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Close the database connection.');
});