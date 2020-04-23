$(document).ready(() => {
    let userid = 0;
    let currentPuzzle;
    let puzzle_min = 1, puzzle_max = 2; // max - Puzzle id of the last puzzle in the database
    let puzzle_done = [] // Contains the id's of the puzzles already done by the user
    let game,grid;

    /***** Function to get a random puzzle id in the range of puzzle_min and puzzle_max which is not already included in puzzle_done *****/
    let getRandomPuzzle = function(){
        if(puzzle_done.length-1 < (puzzle_max-puzzle_min) ){
            let random = getRandomNumber(puzzle_min,puzzle_max);
            while(puzzle_done.includes(random)){
                random = getRandomNumber(puzzle_min,puzzle_max);
            }
            puzzle_done.push(random);
            return random;
        } else {  
            $('#finishedOverlay').show()
            return false;
        }
    };

    let getRandomNumber = function(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    };

    /***********************StarRating **********************/

    $('.rating_stars span.r').hover(function() {
        // get hovered value
        let rating = $(this).data('rating');
        let value = $(this).data('value');
        $(this).parent().attr('class', '').addClass('rating_stars').addClass('rating_'+rating);
        highlight_star(value);
    }, function() {
        // get hidden field value
        let rating = $("#rating").val();
        let value = $("#rating_val").val();
        $(this).parent().attr('class', '').addClass('rating_stars').addClass('rating_'+rating);
        highlight_star(value);
    }).click(function() {
        // Set hidden field value
        let value = $(this).data('value');
        $("#rating_val").val(value);

        let rating = $(this).data('rating');
        $("#rating").val(rating);
        
        highlight_star(value);
    });
    
    let highlight_star = function(rating) {
        $('.rating_stars span.s').each(function() {
            var low = $(this).data('low');
            var high = $(this).data('high');
            $(this).removeClass('active-high').removeClass('active-low');
            if (rating >= high) $(this).addClass('active-high');
            else if (rating == low) $(this).addClass('active-low');
        });
    }

    /*********************************************************/

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
            let stars = $('.rating :input');
            for (const key in stars) {
                if (stars.hasOwnProperty(key)) {
                    if(stars[key].checked){
                        experience = stars[key].value
                    }
                }
            }


            /***** Putting the information provided into the database *****/ 
            let send = $.ajax({
                url: 'start',
                type: 'POST',
                data: {
                    username: user,
                    adult: isAdult,
                    exp: experience,
                },
            }).done(function(response){ 
                /*****  Returns an Object response, with user_id and done (array of puzzle id's the user already solved/attempted to solve) *****/                
                console.log(response)
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
        // $('#gameCanvas').show()

        
        // currentPuzzle = getRandomPuzzle(puzzle_done);
        // grid = game.drawBoard(currentPuzzle);

        $('#btnNextPuzzle').show();
        $('#btnReset').show();

    });

    // Button to get the next Puzzle
    $('.btnNext').click(function(){
        if(this.id == 'btnNextPuzzle'){  // Skip Puzzle Button
            // Confirm 
            $('#nextConfirmOverlay').show();
        } else { // Solved the Puzzle
            $("#solvedOverlay").hide();
            $('#gameCanvas').empty();
            currentPuzzle = getRandomPuzzle(puzzle_done);
            // game = new Nobi(userid,currentPuzzle);
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
     $('#btnEnd').click(function(){
         $('#end-confirm').show();
     });

     // Confirm End button
     $('#btnEndYes').click(function(){
        $('#gameCanvas').empty();
        location.href = 'end.html'
     });

     // Cancel End Button
     $('#btnEndNo').click(function(){
        $('#end-confirm').hide();
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
    /*************************************************************/

    



})