const sqlite3 = require('sqlite3');
const fs = require('fs');
const readline = require('readline')


let lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('puzzles.txt')
});

const db = new sqlite3.Database('../db/nobi.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the nobi SQlite database.');
});

function Map(x, y,c,h) {
    return {x: x, y: y,c:c,h:h};
}

// Adding some Puzzles and Solutions manually
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
    // db.run("INSERT INTO puzzles_info VALUES (1,3,0,-3,0)");
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

    // INSERT INFO FOR PUZZLE 1 AND 2
    db.run("INSERT INTO puzzles_info VALUES (1,'5x5',3,6)")
    db.run("INSERT INTO puzzles_info VALUES (2,'5x5',4,6)")
  
    // print them out to confirm their contents:
    /* db.each("SELECT puzzle_id, hex_q, hex_r, hex_s, hex_colour FROM puzzles", (err, row) => {
        console.log('Puzzle '+row.puzzle_id + ": Hex(" + row.hex_q + ',' + row.hex_r + ',' + row.hex_s + ') colour: '+ row.hex_colour);
    }); */
// });


let linecount = 0;
let puzzleid = 3 // Puzzle already contains 3 puzzles (id: 0,1,2)
let map = Map(0,0,0,0);
let offsetX=0,offsetY=0;
// db.serialize(() => {
    lineReader.on('line', function (line) {
        let tmp = linecount%3;
        linecount++;
        switch(tmp){
            case 0:
                // Get Puzzle Information
                let info = line.split('_');    // [0] - size || [1] - shape || [2] - colours || [3] - hints 
                let psize = info[0].split('x');   // [0] - x || [1] - y
                let colours = info[2].split('=');
                let hints = info[3].split('=');

                map.y = psize[0]; 
                map.x = psize[1];
                map.c = colours[1];
                map.h = hints[1];
            
                // Offsets , to make (0,0) the middle of the Board
                offsetX = Math.round((map.x-1)/2);
                offsetY = Math.round((map.y-1)/2);

                // db.serialize(() => {
                    let insertQuery = "INSERT INTO puzzles_info VALUES ("+puzzleid +",'"+info[0]+"',"+map.c+","+map.h+")";
                    db.run( insertQuery, function(err) {
                        if(err){
                            //Oops something went wrong
                            console.log(err);
                            console.log(insertQuery)
                        }
                    });
                // }); 


                break;
            case 1:
                // Insert Puzzle into database
                hexinfo = line.split(/([0-9]+)/).filter(Boolean);  // Splitting the coordinates and colour of each hexagon
                // for(let i=0; i<hexinfo.length;i=i+2){
                //     console.log("info" , hexinfo[i]);
                //     console.log("X: ",hexinfo[i].charCodeAt(1));
                //     console.log("Y: ",hexinfo[i].charCodeAt(0));
                //     console.log("C: ", hexinfo[i+1]);
                // }
                for (let i = 0; i < hexinfo.length; i = i+2) {

                    let x = hexinfo[i].charCodeAt(1)-offsetY-97;
                    let y = hexinfo[i].charCodeAt(0)-offsetX-97;  // Substract 97 to reset charCode of 'a' to 0, 'b' to 1...
                    let z = -x-y;

                    // console.log("x: ",x," - ",hexinfo[i].charAt(1), " with ", line.charCodeAt(i), " with offset ",offsetX);
                    // console.log("y: ",y," - ",line.charAt(i+1), " with ", line.charCodeAt(i+1), " with offset ",offsetY);
                    
                    // db.serialize(() => {
                        let insertQuery = "INSERT INTO puzzles VALUES ("+puzzleid +","+ x + "," + y +","+ z + ","+hexinfo[i+1]+")";
                        db.run( insertQuery, function(err) {
                            if(err){
                                //Oops something went wrong
                                console.log(err);
                                console.log(insertQuery)
                            }
                        });
                    // }); 
                }
                break;
            case 2:
                // Insert Solutions into database
                hexinfo = line.split(/([0-9]+)/).filter(Boolean);  // Splitting the coordinates and colour of each hexagon
                for (let i = 0; i < hexinfo.length; i = i+2) {
                    
                    let x = hexinfo[i].charCodeAt(1)-offsetY-97;
                    let y = hexinfo[i].charCodeAt(0)-offsetX-97;  // Substract 97 to reset charCode of 'a' to 0, 'b' to 1...
                    let z = -x-y;

                    // db.serialize(() => {
                        let insertQuery = "INSERT INTO puzzles_solution VALUES ("+puzzleid +","+ x + "," + y +","+ z + ","+hexinfo[i+1]+")";
                        db.run( insertQuery, function(err) {
                            if(err){
                                //Oops something went wrong
                                console.log(err);
                                console.log(insertQuery)
                            }
                        });
                    // }); 
                }
                puzzleid++;
                break;
        }
    });
});

// db.close((err) => {
//     if (err) {
//         return console.error(err.message);
//     }
//     console.log('Close the database connection.');
// });

// db.serialize(() => {
//     db.close((err) => {
//         if (err) {
//             return console.error(err.message);
//         }
//         console.log('Close the database connection.');
//     });
// });