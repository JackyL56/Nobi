"use strict";

$(document).ready(() => {
  let userid = 0;
  let currentPuzzle;
  let nShapes = 6; // Number of different puzzle shapes

  // let nPuzzlesPerShape = 30; // Number of puzzles for each shape
  let nPuzzlesPerShape = [15,13,11,9,7,5]; // Number of puzzles for each shape [5x5,5x7,7x7,7x9,9x9,11x11]
  let puzzlesPerShapeLeft = [15,13,11,9,7,5]
  let totalPuzzleCount = 60; // 15+13+11+9+7+5

  let puzzlesToDo = []; // Contains the id's of puzzles not done yet

  let puzzle_done = []; // Contains the id's of the puzzles already done by the user

  let game, grid;
  let endGame = false; // To keep track of which end button was pressed

  /***** Function to get a random puzzle id in the range of puzzle_min and puzzle_max which is not already included in puzzle_done *****/
  // Initializes the puzzles still available

  let initPuzzlesToDo = function initPuzzlesToDo(puzzles_done) {
    let id = 1;

    for (let index = 0; index < nShapes; index++) {
      // let array = [];

      for (let puzzle = 0; puzzle < nPuzzlesPerShape[index]; puzzle++) {
        if (!puzzles_done.includes(id)) {
          // array.push(id);
          puzzlesToDo.push(id);
        } else {
          // Find shape of the puzzle, which the player already completed!
          let tmp = id; let shape = 0;
          while(tmp>0){
            tmp = tmp - nPuzzlesPerShape[shape];
            shape++;
          }
          puzzlesPerShapeLeft[shape-1] = puzzlesPerShapeLeft[shape-1]-1;
        }

        id++;
      }

      // puzzlesToDo.push(array);
    }
  };

  let getNextPuzzle = function getNextPuzzle() {
    // Check if there are still puzzles available
    if (puzzle_done.length < totalPuzzleCount) {
      if(puzzle_done.length == 0){ // Every Player gets 3 "easy" puzzles in the beginning
        puzzlesToDo.splice(puzzlesToDo.indexOf(1), 1);
        puzzle_done.push(1);
        puzzlesPerShapeLeft[0] = puzzlesPerShapeLeft[0]-1; 
        return 1;
      } 
      if(puzzle_done.length == 1){ // Every Player gets 3 "easy" puzzles in the beginning
      puzzlesToDo.splice(puzzlesToDo.indexOf(3), 1);
      puzzle_done.push(3);
      puzzlesPerShapeLeft[0] = puzzlesPerShapeLeft[0]-1;
        return 3;
      } 
      if(puzzle_done.length == 2){ // A little bit trickier than Puzzle 1 and 3
        puzzlesToDo.splice(puzzlesToDo.indexOf(2), 1);
        puzzle_done.push(2);  
        puzzlesPerShapeLeft[0] = puzzlesPerShapeLeft[0]-1;
        return 2;
      } 

      // After solving all 3 "easy" Puzzles, choose the next Puzzle using a biased Roulette Selection Method.

      let nextAllowedShapes = 1;

      if(puzzle_done.length < (nShapes+1)) {
        nextAllowedShapes = puzzle_done.length-1;
      } else {
        nextAllowedShapes = nShapes; 
      }

      //  let nextPuzzleShape = Math.ceil((Math.random() * nextAllowedShapes));
      let range = 0;
      for(let i = 0; i<nextAllowedShapes;i++){
        range = range + puzzlesPerShapeLeft[i];
      }

      // index of next puzzleId
      let pindex = Math.floor( (Math.random() * range))
      let nextPuzzleId = puzzlesToDo[pindex];

      // Find shape of the puzzle
      let tmp = nextPuzzleId; let shape = 0;
      while(tmp>0){
        tmp = tmp - nPuzzlesPerShape[shape];
        shape++;
      }

      puzzlesToDo.splice(puzzlesToDo.indexOf(nextPuzzleId), 1);
      puzzle_done.push(nextPuzzleId);
      puzzlesPerShapeLeft[shape-1] = puzzlesPerShapeLeft[shape-1]-1;

      return nextPuzzleId;
      
    } else {
      $('#finishedOverlay').show();
      return false;
    }
  };
  /***************************  Adding Click Functions to buttons  ***************************/


  $('#btnStart').click(function () {
    if (formcheck()) {
      $('#btnStart').attr('disabled', true);
      $("#startPage").hide();
      $('#btnPlay').show();
      $('#tutorialPage').show();
      /***** Getting User Information *****/

      let user = $('#username').val(); // Get Username

      let isAdult = 0; // Get Age variable

      if ($('#radio-yes')[0].checked) {
        isAdult = 1;
      } else if ($('#radio-no')[0].checked) {
        isAdult = 0;
      }

      let experience = 0; // Get the experience rating

      let stars = $('.rating :input[name="rating"]');

      for (const key in stars) {
        if (stars.hasOwnProperty(key)) {
          if (stars[key].checked) {
            experience = stars[key].value;
          }
        }
      }
      
      /***** Putting the information provided into the database *****/

      $.ajax({
        url: 'start',
        type: 'POST',
        data: {
          username: user,
          adult: isAdult,
          exp: experience
        }
      }).done(function (response) {
        /*****  Returns an Object response, with user_id and done (array of puzzle id's the user already solved/attempted to solve) *****/
        // console.log(response)
        userid = response.user_id;

        if (response.done) {
          // If the array of puzzles is not empty
          puzzle_done = response.done;
        } // Initialize the game Nobi and draw the tutorial board


        initPuzzlesToDo(puzzle_done);
        game = new Nobi(userid);
        grid = game.drawTutorial();
      }).fail(function (jqXHR, textStatus) {
        console.log(jqXHR);
        console.log(textStatus);
      });
    }
  });
  $('#btnPlay').click(function () {
    $('#btnPlay').attr('disabled', true).hide();
    $('.tutBoard').empty();
    $("#tutorialPage").hide();
    $('#gamePage').show();
    $('#btnNextPuzzle').show();
    $('#btnReset').show();
  }); // Button to get the next Puzzle

  $('.btnNext').click(function () {
    if (this.id == 'btnNextPuzzle') {
      // Skip Puzzle Button
      // Confirm 
      $('#nextConfirmOverlay').show();
    } else {
      // Solved the Puzzle Pressed Play
      // If solved the puzzle, log how the user rates the puzzle
      if (this.id == 'btnNextSolved') {
        // Check if both fields are filled in
        if (ratingcheck()) {
          let difficulty = 0;
          let dstars = $('.rating :input[name="drating"]');

          for (const key in dstars) {
            if (dstars.hasOwnProperty(key)) {
              if (dstars[key].checked) {
                difficulty = dstars[key].value;
                dstars[key].checked = false;
              }
            }
          }

          let interesting = 0;
          let istars = $('.rating :input[name="irating"]');

          for (const key in istars) {
            if (istars.hasOwnProperty(key)) {
              if (istars[key].checked) {
                interesting = istars[key].value;
                istars[key].checked = false;
              }
            }
          }

          logRating(userid, currentPuzzle, difficulty, interesting);
        } else {
          return;
        }
      } // Load the next puzzle


      $("#solvedOverlay").hide();
      $('#gameCanvas').empty(); // currentPuzzle = getRandomPuzzle(puzzle_done);

      currentPuzzle = getNextPuzzle();

      if (currentPuzzle) {
        // Checks if we have finished all the puzzles
        grid = game.drawBoard(currentPuzzle);
      }
    }
  }); // Reset button, to reset the colours of the puzzle

  $('#btnHelp').click(function () {
    $('#helpOverlay').show();
  });
  $('.btn-Back').click(function () {
    if (grid.backPath.length > 0) {
      let move = grid.backPath.pop();

      for (let index = 0; index < move[0].length; index++) {
        grid[move[0][index]].colour = move[1][index];
        $('#' + move[0][index])[0].style.fill = grid.getColourByIndex(move[1][index]);
      }
    }
  });
  $('.btnReset').click(function () {
    let indexArray = [];
    let colourArray = [];
    $('.hex').each(function () {
      if (grid[this.id].canBeColoured()) {
        indexArray.push(this.id);
        colourArray.push(grid[this.id].colour);
        grid[this.id].colour = 0;
        this.style.fill = grid.getColourByIndex(0);
      }
    });
    grid.backPath.push([indexArray, colourArray]);
  }); // End Button

  $('.btnEnd').click(function () {
    // If end button after solving the puzzle
    if (this.id == 'btnEnd') {
      // Check if both fields are filled in
      if (ratingcheck()) {
        endGame = true;
        $('#endOverlay').show();
        $('#end-confirm').show();
      } else {
        return;
      }
    } else {
      $('#endOverlay').show();
      $('#end-confirm').show();
    }
  }); // Confirm End button

  $('#btnEndYes').click(function () {
    // Log Puzzle Rating of final Puzzle
    if (endGame) {
      let difficulty = 0;
      let dstars = $('.rating :input[name="drating"]');

      for (const key in dstars) {
        if (dstars.hasOwnProperty(key)) {
          if (dstars[key].checked) {
            difficulty = dstars[key].value;
            dstars[key].checked = false;
          }
        }
      }

      let interesting = 0;
      let istars = $('.rating :input[name="irating"]');

      for (const key in istars) {
        if (istars.hasOwnProperty(key)) {
          if (istars[key].checked) {
            interesting = istars[key].value;
            istars[key].checked = false;
          }
        }
      }

      logRating(userid, currentPuzzle, difficulty, interesting);
    } else {
      $('#gameCanvas').empty();
      location.href = 'end.html';
    }
  }); // Cancel End Button

  $('#btnEndNo').click(function () {
    endGame = false;
    $('#endOverlay').hide();
  });
  $('#btnNextYes').click(function () {
    $('#nextConfirmOverlay').hide();
    $('#gameCanvas').empty();
    currentPuzzle = getNextPuzzle(puzzle_done); // game = new Nobi(userid,currentPuzzle);

    if (currentPuzzle) {
      // Checks if we have finished all the puzzles
      grid = game.drawBoard(currentPuzzle);
    }
  });
  $('#btnNextNo').click(function () {
    $('#nextConfirmOverlay').hide();
  });
  $('#btnFinished').click(function () {
    location.href = 'end.html';
  });
  $('#btnTutOkay').click(function () {
    $('#tutOverlay').hide();
  });
  $('#btnHelpOkay').click(function () {
    $('#helpOverlay').hide();
  }); 
  $('#btnReminder').click(function () {
    $('#reminderOverlay').hide();
  }); 
  
  // Checks if the form is filled.

  function formcheck() {
    $('.alert').hide();
    let filled = true;

    if ($('#username').val() == '') {
      $('#user-alert').slideDown();
      filled = false;
    }

    if ($('.radio').find('input').serializeArray().length == 0) {
      // $('#ageAlert').show()
      $('#age-alert').slideDown();
      filled = false;
    }

    if ($('.rating').find('input').serializeArray().length == 0) {
      // $('#expAlert').show()
      $('#exp-alert').slideDown();
      filled = false;
    }

    return filled;
  }

  function ratingcheck() {
    $('.alert').hide();
    let filled = true;

    if ($('.rating').find('input[name="drating"]').serializeArray().length == 0) {
      // $('#ageAlert').show()
      $('#dif-alert').slideDown();
      filled = false;
    }

    if ($('.rating').find('input[name="irating"]').serializeArray().length == 0) {
      // $('#ageAlert').show()
      $('#int-alert').slideDown();
      filled = false;
    }

    return filled;
  } // Log the user rating of puzzle


  function logRating(uid, pid, d, i) {
    return $.ajax({
      url: 'lograting',
      type: 'POST',
      data: {
        uid: uid,
        pid: pid,
        dif: d,
        int: i
      }
    }).done(function (data) {
      if (endGame) {
        $('#gameCanvas').empty();
        location.href = 'end.html';
      }
    });
  }
  /*************************************************************/

});