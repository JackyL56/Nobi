"use strict";

$(document).ready(() => {
  let userid = 0;
  let currentPuzzle;
  let nShapes = 6; // Number of different puzzle shapes

  let nPuzzlesPerShape = 30; // Number of puzzles for each shape

  let puzzlesToDo = []; // Contains the id's of puzzles not done yet

  let puzzle_done = []; // Contains the id's of the puzzles already done by the user

  let game, grid;
  let endGame = false; // To keep track of which end button was pressed

  /***** Function to get a random puzzle id in the range of puzzle_min and puzzle_max which is not already included in puzzle_done *****/
  // Initializes the puzzles still available

  let initPuzzlesToDo = function initPuzzlesToDo(puzzles_done) {
    let id = 1;

    for (let index = 0; index < nShapes; index++) {
      let array = [];

      for (let puzzle = 0; puzzle < nPuzzlesPerShape; puzzle++) {
        if (!puzzles_done.includes(id)) {
          array.push(id);
        }

        id++;
      }

      puzzlesToDo.push(array);
    }
  };

  let getNextPuzzle = function getNextPuzzle() {
    // Check if there are still puzzles available
    if (puzzle_done.length < nShapes * nPuzzlesPerShape) {
      let nextPuzzleShape = puzzle_done.length % nShapes;
      let nextPuzzleId = puzzlesToDo[nextPuzzleShape][Math.floor(Math.random() * puzzlesToDo[nextPuzzleShape].length)]; // Puzzle Id of the next Shape

      puzzle_done.push(nextPuzzleId);
      puzzlesToDo[nextPuzzleShape].splice(puzzlesToDo[nextPuzzleShape].indexOf(nextPuzzleId), 1);
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
  }); // Checks if the form is filled.

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