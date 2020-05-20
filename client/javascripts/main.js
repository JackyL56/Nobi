'use strict';
$(document).ready(() => {
    let userid = 0;
    let currentPuzzle;
    let sample_puzzle1 = 1; let sample_puzzle2 = 2; // Id's of the sample puzzles
    let numberOfSamplePuzzles = 2;
    let puzzle_min = 3, puzzle_max = 1102; // max - Puzzle id of the last puzzle in the database
    let puzzle_done = [] // Contains the id's of the puzzles already done by the user
    let game,grid;
    let endGame = false; // To keep track of which end button was pressed

    // $('#solvedOverlay').show();

    /***** Function to get a random puzzle id in the range of puzzle_min and puzzle_max which is not already included in puzzle_done *****/
    let getRandomPuzzle = function(){
        // Check if there are still puzzles available
        if(puzzle_done.length-1 < (puzzle_max-puzzle_min+numberOfSamplePuzzles) ){
            if(!puzzle_done.includes(1)){
                puzzle_done.push(1);
                return sample_puzzle1;
            } else if(!puzzle_done.includes(2)){
                puzzle_done.push(2);
                return sample_puzzle2;
            } else {
                let random = getRandomNumber(puzzle_min,puzzle_max);
                while(puzzle_done.includes(random)){
                    random = getRandomNumber(puzzle_min,puzzle_max);
                }
                puzzle_done.push(random);
                return random;    
            }
        } else {  
            $('#finishedOverlay').show()
            return false;
        }
    };

    let getRandomNumber = function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    /***************************  Adding Click Functions to buttons  ***************************/
    
    $('#btnStart').click(function(){
        if(formcheck()){
            $('#btnStart').attr('disabled',true);
            $("#startPage").hide()
            $('#btnPlay').show()
            $('#tutorialPage').show()


        /***** Getting User Information *****/
            // Get Username
            let user = $('#username').val();
            // Get Age variable
            let isAdult = 0;
            if($('#radio-yes')[0].checked){
                isAdult = 1;
            } else if($('#radio-no')[0].checked){
                isAdult = 0;
            }
            // Get the experience rating
            let experience=0;
            let stars = $('.rating :input[name="rating"]');
            for (const key in stars) {
                if (stars.hasOwnProperty(key)) {
                    if(stars[key].checked){
                        experience = stars[key].value
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
                    exp: experience,
                },
            }).done(function(response){ 
                /*****  Returns an Object response, with user_id and done (array of puzzle id's the user already solved/attempted to solve) *****/                
                // console.log(response)
                userid = response.user_id;
                if(response.done){  // If the array of puzzles is not empty
                    puzzle_done = response.done;
                }
              // Initialize the game Nobi and draw the tutorial board
                game = new Nobi(userid);
                grid = game.drawTutorial();

            }).fail(function(jqXHR,textStatus){
                console.log(jqXHR);
                console.log(textStatus)
            });
        }        
    });
    
    $('#btnPlay').click(function(){
        
        $('#btnPlay').attr('disabled',true).hide();

        $('.tutBoard').empty();
        $("#tutorialPage").hide();
        $('#gamePage').show()

        $('#btnNextPuzzle').show();
        $('#btnReset').show();

    });

    // Button to get the next Puzzle
    $('.btnNext').click(function(){
        if(this.id == 'btnNextPuzzle'){  // Skip Puzzle Button
            // Confirm 
            $('#nextConfirmOverlay').show();
        } else { // Solved the Puzzle Pressed Play
            // If solved the puzzle, log how the user rates the puzzle
            if(this.id == 'btnNextSolved'){
                // Check if both fields are filled in
                if(ratingcheck()){
                    let difficulty=0;
                    let dstars = $('.rating :input[name="drating"]');
                    for (const key in dstars) {
                        if (dstars.hasOwnProperty(key)) {
                            if(dstars[key].checked){
                                difficulty = dstars[key].value
                                dstars[key].checked = false;
                            }
                        }
                    }
                    
                    let interesting=0;
                    let istars = $('.rating :input[name="irating"]');
                    for (const key in istars) {
                        if (istars.hasOwnProperty(key)) {
                            if(istars[key].checked){
                                interesting = istars[key].value
                                istars[key].checked = false;
                            }
                        }
                    }
                    logRating(userid,currentPuzzle,difficulty,interesting);
                } else { return }
            }

            // Load the next puzzle
            $("#solvedOverlay").hide();
            $('#gameCanvas').empty();
            currentPuzzle = getRandomPuzzle(puzzle_done);
            if(currentPuzzle){ // Checks if we have finished all the puzzles
                grid = game.drawBoard(currentPuzzle)
            }            
        } 
    });

    // Reset button, to reset the colours of the puzzle
    $('.btnReset').click(function(){
        $('.hex').each(function(){
            if(grid[this.id].canBeColoured()){
                grid[this.id].colour = 0;
                this.style.fill = grid.getColourByIndex(0);
            }
        });
     });

     // End Button
     $('.btnEnd').click(function(){
        // If end button after solving the puzzle
        if(this.id == 'btnEnd'){
            // Check if both fields are filled in
            if(ratingcheck()){
                endGame = true;
                $('#endOverlay').show();
                $('#end-confirm').show();
            } else { return }
        } else {
            $('#endOverlay').show();
            $('#end-confirm').show();
        }
     });

     // Confirm End button
    $('#btnEndYes').click(function(){
        // Log Puzzle Rating of final Puzzle
        if(endGame){
            let difficulty=0;
            let dstars = $('.rating :input[name="drating"]');
            for (const key in dstars) {
                if (dstars.hasOwnProperty(key)) {
                    if(dstars[key].checked){
                        difficulty = dstars[key].value
                        dstars[key].checked = false;
                    }
                }
            }
            
            let interesting=0;
            let istars = $('.rating :input[name="irating"]');
            for (const key in istars) {
                if (istars.hasOwnProperty(key)) {
                    if(istars[key].checked){
                        interesting = istars[key].value
                        istars[key].checked = false;
                    }
                }
            }
            logRating(userid,currentPuzzle,difficulty,interesting);
        } else {
            $('#gameCanvas').empty();
            location.href = 'end.html';
        }
    });

     // Cancel End Button
     $('#btnEndNo').click(function(){
         endGame = false;
        $('#endOverlay').hide();
    });

    $('#btnNextYes').click(function(){
        $('#nextConfirmOverlay').hide();
        $('#gameCanvas').empty();
        currentPuzzle = getRandomPuzzle(puzzle_done);
        // game = new Nobi(userid,currentPuzzle);
        if(currentPuzzle){ // Checks if we have finished all the puzzles
            grid = game.drawBoard(currentPuzzle)
        }
    });

    $('#btnNextNo').click(function(){
        $('#nextConfirmOverlay').hide();
    });

    $('#btnFinished').click(function(){
        location.href = 'end.html'
    });

    $('#btnTutOkay').click(function(){
        $('#tutOverlay').hide();
    });

    // Checks if the form is filled.
    function formcheck(){
        $('.alert').hide();
        let filled = true;
        if($('#username').val()==''){
             $('#user-alert').slideDown();
            filled= false;
        }
        if($('.radio').find('input').serializeArray().length == 0){
            // $('#ageAlert').show()
            $('#age-alert').slideDown();
            filled = false;
        }
        if($('.rating').find('input').serializeArray().length == 0){
            // $('#expAlert').show()
            $('#exp-alert').slideDown();
           filled = false;
        }

        return filled;
    }

    function ratingcheck(){
        $('.alert').hide();
        let filled = true;
        if($('.rating').find('input[name="drating"]').serializeArray().length == 0){
            // $('#ageAlert').show()
            $('#dif-alert').slideDown();
            filled = false;
        }
        if($('.rating').find('input[name="irating"]').serializeArray().length == 0){
            // $('#ageAlert').show()
            $('#int-alert').slideDown();
            filled = false;
        }
        return filled;
    }

    // Log the user rating of puzzle
    function logRating(uid,pid,d,i){
        return $.ajax({
            url: 'lograting',
            type: 'POST',
            data: {
                uid: uid,
                pid: pid,
                dif: d,
                int: i,
            },
        }).done(function(data){
            if(endGame){
                $('#gameCanvas').empty();
                location.href = 'end.html'
            }
        })
    }

    /*************************************************************/

    



})