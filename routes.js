var express = require("express");
var router = express.Router();

/* 
router.get("/",function(req,res){
    console.log("Basic start page here")
//    res.render("index");
  //  res.send("API working properly")   // response when /.. is accessed
}); */

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db/nobi.db', (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to the nobi SQlite database.');
});

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended:true})); //Hook up with app

// GET puzzle data
router.get('/puzzle/:puzzle_id',(req,res) =>{
  const puzzleToLookUp = req.params.puzzle_id;
  // print them out to confirm their contents:
  db.all(
      //SQL query:
      'SELECT * FROM puzzles WHERE puzzle_id=$id',
      {
          $id:puzzleToLookUp
      },
      (err, row) => {  //Callback function, runs when query finishes
 //     console.log(row)
      //console.log('Puzzle '+row.puzzle_id + ": Hex(" + row.hex_q + ',' + row.hex_r + ',' + row.hex_s + ') colour: '+ row.hex_colour);
      if(row.length>0){
          res.send(row)
      } else {
          res.send({});  // Returning empty object, there are no rows with the puzzle_id we are looking for
      }
  });

});

// GET puzzle solution data
router.get('/puzzle_solution/:puzzle_id',(req,res) =>{
  const puzzleToLookUp = req.params.puzzle_id;
  // print them out to confirm their contents:
  db.all(
      //SQL query:
      'SELECT * FROM puzzles_solution WHERE puzzle_id=$id',
      {
          $id:puzzleToLookUp
      },
      (err, row) => {  //Callback function, runs when query finishes
      //console.log('Puzzle '+row.puzzle_id + ": Hex(" + row.hex_q + ',' + row.hex_r + ',' + row.hex_s + ') colour: '+ row.hex_colour);
      if(row.length>0){
          res.send(row)
      } else {
          res.send({});  // Returning empty object, there are no rows with the puzzle_id we are looking for
      }
  });

});



// POST request when starting the game. Logs the user information into database
router.post('/start',(req,res) =>{
    // console.log(req.body)
    // Inserting user information into database    
    db.serialize(() => {
    
        db.all(
            //SQL query:
            'SELECT user_id FROM users WHERE user_name=$name AND experience=$exp',
            {
                $name:req.body.username,
                $exp:req.body.exp
            },
            (err, row) => {  //Callback function, runs when query finishes
            // Send back last userid with the provided username if it exists(Not checking for duplicate usernames, since that will be rarely the case)
            if(row.length>0){  
                let uid = row[row.length-1].user_id; // Last userid matching the conditions
                let done = [];
                db.all('SELECT DISTINCT puzzle_id FROM user_moves WHERE user_id=$id',{
                    $id:uid,
                },  (err, row) => {
                    for (let index = 0; index < row.length; index++) {
                        done.push(row[index].puzzle_id);
                    }
                    res.send({user_id:uid,done}) // Return the last user with the given username (Row length should be 1) and the puzzles it has already tried/solved
                });
                

            } else {
                // Insert the new users information into the database
                // SQL query:
                let insertQuery = "INSERT INTO users (user_name, adult, experience) VALUES ('" + req.body.username + "'," + req.body.adult + "," + req.body.exp + ")";
                db.run( insertQuery, function(err) {
                    if(err){
                        //Oops something went wrong
                        console.log(err);
                    } else {
                        res.send({user_id:this.lastID}); // Sent back the new userid created
                    }
                });
            }
        }); 
    });
});


// Post request for user move logging
router.post('/logging',(req,res) =>{
    let insertQuery = "INSERT INTO user_moves VALUES (" + req.body.uid + "," + req.body.pid + "," + req.body.q + "," + req.body.r + "," + req.body.s + "," + req.body.c + ","+ req.body.moveNumber + "," + req.body.moveTime + "," + req.body.solved +")";
    // console.log(insertQuery);
    db.run( insertQuery, function(err) {
        if(err){
            //Oops something went wrong
            console.log(err);
        }
    });
    res.send({});
});

// Post request for puzzle rating logging
router.post('/lograting',(req,res) =>{
    let insertQuery = "INSERT INTO puzzle_rating VALUES (" + req.body.uid + "," + req.body.pid + "," + req.body.dif + "," + req.body.int +")";
    // console.log(insertQuery);
    db.run( insertQuery, function(err) {
        if(err){
            //Oops something went wrong
            console.log(err);
        }
    });
    res.send({});
});

/*
router.get('/directory/:param',(req,res)=>{  // :param - will make param into a parameter
    const database = Object.keys(database);
    res.send(database);

    const p = req.params.param; // get the parameter
})*/

module.exports = router;