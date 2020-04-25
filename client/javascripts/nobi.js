
class Nobi {

    constructor(userid){   // Size has to be 1 or higher  -> TODO implement check
        // this.puzzleid = puzzleid;
        this.userid = userid;
        this.hexes = new Array();  // Array containing the svg elements
    }


    /***** Get hexagonal board of the given puzzle id *****/
    drawBoard = function(puzzleid){
        let userid = this.userid;
        console.log("USER : " + userid + " ON PUZZLE: " + puzzleid)

        /*****  Variables to set the size of the canvas, board and hexagons *****/
        let shiftValue = 0, shiftVertical = -window.innerHeight*0.1,width = window.innerWidth,height = 0;  // Shift Vertical to shift it to the center of the game canvas
        let h = window.innerHeight, hex_size = 0.05*h, colourBox_size = 0.15*h;// let padding = 25;
        let pointy = Layout(layout_pointy, Point(hex_size,hex_size), Point(window.innerWidth/2,window.innerHeight/2));  // Determines the layout of the hexagons. (Pointy layout here)
        
        /***** Variables used for colouring *****/
        let dragPath = []; // Used to keep track of the path when drag-colouring  || dragPath[x][0] contains the id of the hexagon x in the grid || dragPath[x][1] contains the colour we drew over || dragPath[x][2] - time between current and last move
        let currentHex = [], previousHex = [], backtrack = []; // Used for rule-checking when drag-colouring 
        let clickCount = 0; let singleClickTimer; // Used to detect double-clicks
        window.currentColour = 0; // Initializing currently selected color
        
        /***** Variables used to log the time*****/
        let time,currentTime, previousTime = 0, moveNumber = 0;  /// Used to calculate the time needed between each move
        
        //   SVG.on(document, 'DOMContentLoaded', function() {
        
        /***** Initializing the grid containing the hexagons and the respective solution grid for the puzzle*****/
        const grid = new Grid();
        this.setMap(grid,puzzleid);
        const solution = [];
        this.getSolution(solution,puzzleid);
        /***** Drawing the board *****/
        let drawlast = [];
        setViewingVariables();
        let draw = SVG().addTo('#gameCanvas').size(width,height);
        
        // Drawing the Hexagon SVGs
        for (let index = 0; index < grid.length; index++) {
            if(grid[index].canBeColoured()){
                const corner = polygon_corners(pointy,grid[index])
                const colour = grid.getHexColour(grid[index])
                this.hexes[index] = draw.polygon(corner.map(({ x, y }) => `${x+shiftValue},${y+shiftValue+shiftVertical}`)) 
                .fill(colour)   // Initial colour
                .stroke({ width: 2, color: '#999' })
                .attr({"class":"hex",'cursor':'pointer','id':index})
            } else {
                drawlast.push(index)
            }
        }
        // Drawing the fixed coloured hexagons last, to highlight them with a darker border
        drawlast.forEach(index => {
            const corner = polygon_corners(pointy,grid[index])
            const colour = grid.getHexColour(grid[index])
            this.hexes[index] = draw.polygon(corner.map(({ x, y }) => `${x+shiftValue},${y+shiftValue+shiftVertical}`))
            .fill(colour)   // Initial colour
            .stroke({ width: 5, color: '#000' })
            .attr({"class":"hex",'cursor':'pointer','id':index})
            
        });
        // Drawing the current Colour Box Indicator
        let pathData = this.roundedRectData(colourBox_size,0.6*colourBox_size,10,10,10,10); 
            const colourBox = draw.path(pathData);
            colourBox.fill('#ffffff')
            .move(20, 20)
            .stroke({ color: '#000', width: 2, linecap: 'round', linejoin: 'round' })
            .attr({'class':'colourBox','id':'colourBox'});


///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Helper Function - Add EventListener for Dragging                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
        function mouseMoveWhilstDown(target, whileMove) {
            // Function called, when we are done with with dragging
            let endMove = function () {
                if(dragPath.length>1){ // Log data if we coloured using 'dragging'
                    if(checkIfDone(grid,solution)){     // If the puzzle is done
                        for (let index = 1; index < dragPath.length-1; index++) { // Starting at index 1, since we do not want to log the source of the dragpath 
                            let hex = grid[dragPath[index][0]];
                            moveNumber++;
                            log(userid,puzzleid,hex.q,hex.r,hex.s,hex.colour,moveNumber,dragPath[index][2],0);
                        }
                        // Logging final move manually
                        moveNumber++;
                        let hex = grid[dragPath[dragPath.length-1][0]];
                        log(userid,puzzleid,hex.q,hex.r,hex.s,hex.colour,moveNumber,dragPath[dragPath.length-1][2],1);
                    } else {
                        // Puzzle is not solved, simply log every move
                        for (let index = 1; index < dragPath.length; index++) { 
                            let hex = grid[dragPath[index][0]];
                            moveNumber++;
                            log(userid,puzzleid,hex.q,hex.r,hex.s,hex.colour,moveNumber,dragPath[index][2],0);
                        }
                    }
                }
                window.removeEventListener('mouseover', whileMove);
                window.removeEventListener('mouseup', endMove);
            };
        
            // $(target).mousedown(function(){
            //     console.log("Mouse down")
            // });
            
            
            target.addEventListener('mousedown', function (event) {
                event.stopPropagation();
                if(event.which === 1){ // If we drag using left-click
                    dragPath = []; // Empty dragPath  // dragPath - two dimensional array: dragPath[x][0] - hex_id || dragPath[x][1] - hex_colour  ||  dragPath[x][2] - time between current and last move
                    dragPath.push([event.target.id,grid[event.target.id].colour]); // Push the source of the path     
                    window.currentDragColour = grid[event.target.id].colour;
                    window.addEventListener('mouseover', whileMove,);
                    window.addEventListener('mouseup', endMove);   
                }
            });
        }
              
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Adding EventListeners                                              //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Getting all hexagon svg elements
        let elements = Array.from(document.querySelectorAll('svg .hex'));
        // Adding EventListeners for each of them
        elements.forEach(function(el) {
            // EventListener for normal click and double-click
            el.addEventListener('click', function(event){
                clickCount++;
                if(clickCount === 1){  // Do if single click
                    singleClickTimer = setTimeout(function(){
                        clickCount = 0;
                        changeColour(event);
                    },200); // Time given in ms to listen for dbclick
                } else if (clickCount === 2){ // Do if doubleclick
                    clearTimeout(singleClickTimer);
                    clickCount = 0;
                    resetColour(event);
                }
            }, false);  
            // EventListener for dragging
            mouseMoveWhilstDown(el,dragColour);
            // EventListener for right-click
            el.addEventListener('contextmenu',setCurrentColour);
        });
    
        function setCurrentColour(e){
            console.log(e)
            e.preventDefault();
            if(grid[e.target.id].colour != 0){
                window.currentColour = grid[e.target.id].colour;  // Updating current selected colour
                document.querySelector('#colourBox').setAttribute('style','fill:'.concat(grid.getColourByIndex(window.currentColour)));   // Filling the colour box with the current colour
            }
        }

        function changeColour(e){
            currentHex = grid[e.target.id]; 
            // If the colour of the currently selected Hexagon is not fixed and does not violate the Triplet rule, we colour it to the currently selected colour
            if(currentHex.canBeColoured()){
                if(window.currentColour != 0){  // Only start colouring, when a colour is selected (=> Not the 'uncoloured' state) 
                    if(grid.noTriplets(currentHex,window.currentColour)){
                        currentHex.colour = window.currentColour  // Modify colour to the current colour selected
                        e.target.style.fill = grid.getHexColour(currentHex);   // Updating the colour
                    
                    // Logging the move 
                        currentTime = e.timeStamp;
                        time = currentTime - previousTime;
                        previousTime = currentTime;
                        moveNumber++;
                        if(checkIfDone(grid,solution)){
                            log(userid,puzzleid,currentHex.q,currentHex.r,currentHex.s,currentHex.colour,moveNumber,time,1)   // Puzzle done => Logging solved puzzle
                        } else {
                            log(userid,puzzleid,currentHex.q,currentHex.r,currentHex.s,currentHex.colour,moveNumber,time,0) 
                        }
                    }
                }
            } else {
                // Current Hexagon has a fixed colour. Select fixed colour as current colour.
                setCurrentColour(e);
            }
        };

        function dragColour(e){
            // If we are on the Hex Board
            if($(e.target).attr('class') === 'hex'){
                currentHex = grid[e.target.id];
                previousHex = grid[dragPath[dragPath.length-1][0]];
                // Check, in case we leave the board (ie. if Hex1 is at the edge, we hold the mouse-click down on it, leave the board and move the mouse onto Hex1 again: Current Hex will be the same as the previous Hex in the path-array)
                if(!(currentHex===previousHex) && currentDragColour!=0){
                    // Check if the colour of the current hex is fixed
                    if(currentHex.canBeColoured()){
                        // Check if the currentHex is a neighbour of last coloured Hex && Check for rule: No same-coloured Triplets
                        if(grid.areNeighbours(previousHex,currentHex) && grid.noTriplets(currentHex,window.currentDragColour)){
                            // Check if the current Hex has the same colour as the previous one
                            if(previousHex.colour == currentHex.colour){
                                // If same colour, check if we are backtracking
                                if (dragPath.length>1){ // Check if backtracking is possible
                                    backtrack = grid[dragPath[dragPath.length-2][0]];
                                    if(currentHex === backtrack){ 
                                        // We are backtracking 
                                        // Check if previous Hexagon was one with a fixed colour
                                        if(previousHex.canBeColoured()){
                                            // Colour the previous Hex to its previous colour and remove it from our colouring path
                                            previousHex.colour = dragPath[dragPath.length-1][1];  
                                            $('#'+dragPath[dragPath.length-1][0])[0].setAttribute('style','fill:'.concat(grid.getHexColour(previousHex))); // Getting previous coloured Hex-svg
                                            previousTime -=  dragPath[dragPath.length-1][2];  // Adding the time back from the popped move
                                            dragPath.pop()
                                        } else {
                                            // Previous Hexagon was a fixed coloured one. Simply pop it from our path.
                                            previousTime -=  dragPath[dragPath.length-1][2];
                                            dragPath.pop()
                                        }
                                    } // If we are not backtracking, do nothing, since the colours are the same. We do not push it, else it introduces complications with backtracking 
                                } // If the dragPath only contains one element (or less), do nothing (We are at the source of the dragging path)
                            } else {
                                // If the colours are not the same and we are allowed to colour it then we push it into the dragPath
                                
                                // Logging the move time   
                                currentTime = e.timeStamp;
                                time = currentTime - previousTime;
                                previousTime = currentTime;
                                dragPath.push([e.target.id, currentHex.colour,time]);
                                // Update color of Hexagon to the current drag-colour and show it on the UI
                                currentHex.colour = window.currentDragColour;   
                                e.target.style.fill = grid.getHexColour(currentHex); 
                            }
                        }
                    } else {
                        // If the colour of the current Hex is fixed:
                        // Check if both Hexagons are neighbours and have the same colour || No need to check for the Triplet rule, since that case should never happen at this point (can use graph theory to prove it)
                        if(grid.areNeighbours(previousHex,currentHex) && (previousHex.colour == currentHex.colour)){
                            // Check if the current Hex is already in our dragging Path
                            if(pathIncludes(dragPath,[e.target.id, currentHex.colour])){
                                // Check if we are backtracking
                                backtrack = grid[dragPath[dragPath.length-2][0]];
                                if(currentHex === backtrack){ 
                                    // We are backtracking
                                    // Check if previous Hexagon was one with a fixed colour
                                    if(previousHex.canBeColoured()){
                                        // Colour the previous Hex to its previous colour and remove it from our colouring path
                                        previousHex.colour = dragPath[dragPath.length-1][1];  
                                        $('#'+dragPath[dragPath.length-1][0])[0].setAttribute('style','fill:'.concat(grid.getHexColour(previousHex))); // Getting previous coloured Hex-svg
                                        previousTime -=  dragPath[dragPath.length-1][2];
                                        dragPath.pop()
                                    } else {
                                        // Previous Hexagon was a fixed coloured one. Simply pop it from our path.
                                        previousTime -=  dragPath[dragPath.length-1][2];
                                        dragPath.pop()
                                    }
                                }
                            } // Do nothing, since the current hexagon has a fixed colour. => End of our dragging path.  
                            /*else {
                                // If the Hexagon is a fixed Hexagon with the same colour as our dragging colour, then add the hexagon to our path
                                currentTime = e.timeStamp;
                                time = currentTime - previousTime;
                                previousTime = currentTime;
                                dragPath.push([e.target.id, currentHex.colour,time]);  // No need to colour the fixed Hexagon
                            }*/
                        }
                    }
                }
            }
        }

        function resetColour(e){
            currentHex = grid[e.target.id];
            if(currentHex.colour != 0){
                // Reset the colour (set back to initial colour 0 - white) of the selected hexagon if it's colour was not fixed.
                if(currentHex.canBeColoured()){
                    currentHex.colour = 0; // 0 is the 'uncoloured state' for Hexagons 
                    e.target.style.fill = grid.getHexColour(currentHex);

                    // No need to log the reset ?!
                    /*   currentTime = e.timeStamp;     
                    time = currentTime - previousTime;  // Getting the time 
                    previousTime = currentTime;*/
                    //log(userid,puzzleid,currentHex.q,currentHex.r,currentHex.s,currentHex.colour,time,0)   
                }
            }
        }
                    
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Helper Functions                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Same as Array.includes(), except it uses the values to compare instead of the reference type and is specifically designed for items of the class 'Hex'
        function pathIncludes(path,item){   
            let include = false;
            path.forEach(array => {
                if(array[0] == item[0] && array[1] == item[1]){
                    include = true;
                }
            });
            return include;
        }

    /***** Setting the height and width of game Canvas, and the shiftValue so the board is in the middle of the canvas   *****/
    /***** Hexagons might have negative coordinates. Here: Find the most negative coordinate and shift the board, so all of the coordinates are positive.*****/
        function setViewingVariables(){
            let min=0, max_x=0, max_y=0;
            for (let index = 0; index < grid.length; index++) {
                const corner = polygon_corners(pointy,grid[index]);
                corner.forEach(c => {
                    if(c.x > max_x){
                        max_x = c.x;
                    }
                    if(c.y > max_y){
                        max_y = c.y;
                    }
                    if(c.x < min){
                        min = c.x;
                    }
                    if(c.y < min){
                        min = c.y;
                    }
                });
            }
            // Shift amount is the most negative coordinate of all the hexagons
            shiftValue = -min;           
            // Set width and height of the canvas to fit all the hexagons 
            if(width < max_x+shiftValue){
                width = max_x+shiftValue;    
            } 
            height = max_y+shiftValue;
        }

    /***** Function to check, if the current state of the puzzle corresponds to the solution *****/    
        function checkIfDone(grid,solution){
            // Comparing each Hexagons colour
            for (let i = 0; i < grid.length; i++) {
                if(grid[i].colour != solution[i].colour){
                    return false;
                }
            }
            // Current State is the same as the solution:
            // Show the Solved Pop Up Box
            $("#solvedOverlay").show();
            return true;
        }

    /***** Logging the move *****/    
        function log(userid,puzzleid,hex_q,hex_r,hex_s,hex_colour,moveNumber,time,solved){
            return $.ajax({
                url: 'logging',
                type: 'POST',
                data: {
                    uid: userid,
                    pid: puzzleid,
                    q: hex_q,
                    r: hex_r, 
                    s: hex_s,
                    c: hex_colour,
                    moveNumber:moveNumber,
                    moveTime: time,
                    solved:solved
                },
            })
        }   

        return grid;
    }

    /***** Get the tutorial *****/
    drawTutorial = function(){
        let tutorialid = 0;
        let shiftValue = 0, shiftVertical = -window.innerHeight*0.22,width = window.innerWidth,height = 0;  // Shift Vertical to shift it to the center of the game canvas
        let h = window.innerHeight, hex_size = 0.05*h, colourBox_size = 0.15*h; let padding = 25;
        let pointy = Layout(layout_pointy, Point(hex_size,hex_size), Point(window.innerWidth/2,window.innerHeight/2));


        /***** Variables used for colouring *****/
        let dragPath = []; // Used to keep track of the path when drag-colouring  || dragPath[x][0] contains the id of the hexagon x in the grid || dragPath[x][1] contains the colour we drew over || dragPath[x][2] - time between current and last move
        let currentHex = [], previousHex = [], backtrack = []; // Used for rule-checking when drag-colouring 
        let clickCount = 0; let singleClickTimer; // Used to detect double-clicks
        window.currentColour = 0; // Initializing currently selected color

        //*************************************** Drawing first Tutorial Board *********************************************************/

        const board = new Grid();
        // Create a Hexagonal board of size 2 and change colours manually 
        board.createMapHex(2);
        // All hexagons created by createMapHex have colour 0. We have to manually set the colours afterwards.
        board.getHex(-1,0).colour = 1;board.getHex(0,0).colour = 2;board.getHex(1,0).colour = 3;
        board.getHex(-1,0).setColourFixed(1);board.getHex(0,0).setColourFixed(2);board.getHex(1,0).setColourFixed(3);

        /***** Drawing the board *****/
        let drawlast = [];
        // setViewingVariables();
        let drawTut1 = SVG().addTo('#tutBoard1').size(width,400);

        // Drawing the Hexagon SVGs
        for (let index = 0; index < board.length; index++) {
            if(board[index].canBeColoured()){
                const corner = polygon_corners(pointy,board[index])
                const colour = board.getHexColour(board[index])
                this.hexes[index] = drawTut1.polygon(corner.map(({ x, y }) => `${x+shiftValue},${y+shiftValue+shiftVertical}`)) 
                .fill(colour)   // Initial colour
                .stroke({ width: 2, color: '#999' })
                .attr({"class":"t_hex",'cursor':'pointer','id':'t_'+index})
                .data('id',index);
            } else {
                drawlast.push(index)
            }
        }
        // Drawing the fixed coloured hexagons last, to highlight them with a darker border
        drawlast.forEach(index => {
            const corner = polygon_corners(pointy,board[index])
            const colour = board.getHexColour(board[index])
            this.hexes[index] = drawTut1.polygon(corner.map(({ x, y }) => `${x+shiftValue},${y+shiftValue+shiftVertical}`))
            .fill(colour)   // Initial colour
            .stroke({ width: 5, color: '#000' })
            .attr({"class":"t_hex",'cursor':'pointer','id':'t_'+index})
            .data('id',index);
        });
        // Drawing the current Colour Box Indicator
        let t_currentColour = 0;
        let pathData = this.roundedRectData(colourBox_size,0.6*colourBox_size,10,10,10,10); 
        const t_colourBox = drawTut1.path(pathData);
        t_colourBox.fill('#ffffff')
        .move(20, 20)
        .stroke({ color: '#000', width: 2, linecap: 'round', linejoin: 'round' })
        .attr({'class':'colourBox','id':'t_colourBox'});

        /***** Adding EventListeners for Tutorial Board 1 *****/     

        let t_elements = Array.from(document.querySelectorAll('svg .t_hex'));
        t_elements.forEach(function(el) {
            // EventListener for normal click and double-click
            el.addEventListener('click', function(event){
                clickCount++;
                if(clickCount === 1){  // Do if single click
                    singleClickTimer = setTimeout(function(){
                        clickCount = 0;
                        t_changeColour(event);
                    },200); // Time given in ms to listen for dbclick
                } else if (clickCount === 2){ // Do if doubleclick
                    clearTimeout(singleClickTimer);
                    clickCount = 0;
                    t_resetColour(event);
                }
            }, false);  
            // EventListener for right-click
            el.addEventListener('contextmenu',t_setCurrentColour);
        });

        function t_setCurrentColour(e){
            e.preventDefault();
            // console.log(e.target.dataset.id)  // TODO if enough time: put id into dataset instead of the id attribute (AND replace window.currentColour with let currentColour?) 
            if(board[e.target.dataset.id].colour != 0){ 
                t_currentColour = board[e.target.dataset.id].colour;  // Updating current selected colour
                document.querySelector('#t_colourBox').setAttribute('style','fill:'.concat(board.getColourByIndex(t_currentColour)));   // Filling the colour box with the current colour
            }
        }

        function t_changeColour(e){
            currentHex = board[e.target.dataset.id]; 
            // If the colour of the currently selected Hexagon is not fixed and does not violate the Triplet rule, we colour it to the currently selected colour
            if(currentHex.canBeColoured()){
                if(t_currentColour != 0){  // Only start colouring, when a colour is selected (=> Not the 'uncoloured' state) 
                    if(board.noTriplets(currentHex,t_currentColour)){
                        currentHex.colour = t_currentColour  // Modify colour to the current colour selected
                        e.target.style.fill = board.getHexColour(currentHex);   // Updating the colour
                    }
                }
            } else {
                // Selected a fixed coloured hexagon: Use the coolour as selected colour
                t_setCurrentColour(e);    
            }
            t_checkIfDone();
        };

        function t_resetColour(e){
            currentHex = board[e.target.dataset.id];
            if(currentHex.colour != 0){
                // Reset the colour (set back to initial colour 0 - white) of the selected hexagon if it's colour was not fixed.
                if(currentHex.canBeColoured()){
                    currentHex.colour = 0; // 0 is the 'uncoloured state' for Hexagons 
                    e.target.style.fill = board.getHexColour(currentHex);
                }
            }
        }

        function t_checkIfDone(){
            let done = true;
            for (let index = 0; index < board.length; index++) {
                if(board[index].colour == 0){
                    done = false;
                }   
            }
            if(done){
                $('#tutOverlay').show();
            }
            return done; 
            /* board.forEach(hex => {
                if(hex.colour == 0){
                    done = false;
                }
            });
            return done; */
        }

        //*************************************** Drawing second Tutorial Board *********************************************************/
        const grid = new Grid();
        this.setMap(grid,tutorialid);
        const solution = [];
        this.getSolution(solution,tutorialid);
        
        /***** Drawing the board *****/
        drawlast = [];
        setViewingVariables();
        let draw = SVG().addTo('#tutBoard2').size(width,height+shiftVertical+padding);
        
        // Drawing the Hexagon SVGs
        for (let index = 0; index < grid.length; index++) {
            if(grid[index].canBeColoured()){
                const corner = polygon_corners(pointy,grid[index])
                const colour = grid.getHexColour(grid[index])
                this.hexes[index] = draw.polygon(corner.map(({ x, y }) => `${x+shiftValue},${y+shiftValue+shiftVertical}`)) 
                .fill(colour)   // Initial colour
                .stroke({ width: 2, color: '#999' })
                .attr({"class":"hex",'cursor':'pointer','id':index})
            } else {
                drawlast.push(index)
            }
        }
        // Drawing the fixed coloured hexagons last, to highlight them with a darker border
        drawlast.forEach(index => {
            const corner = polygon_corners(pointy,grid[index])
            const colour = grid.getHexColour(grid[index])
            this.hexes[index] = draw.polygon(corner.map(({ x, y }) => `${x+shiftValue},${y+shiftValue+shiftVertical}`))
            .fill(colour)   // Initial colour
            .stroke({ width: 5, color: '#000' })
            .attr({"class":"hex",'cursor':'pointer','id':index})
        });
        // Drawing the current Colour Box Indicator
        let currentColour = 0;
        const colourBox = draw.path(pathData);
        colourBox.fill('#ffffff')
        .move(20, 20)
        .stroke({ color: '#000', width: 2, linecap: 'round', linejoin: 'round' })
        .attr({'class':'colourBox','id':'colourBox'});


            // TODO ADD EVENTLISTENERS IN USING A SEPARATE FUNCTION
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Helper Function - Add EventListener for Dragging                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function mouseMoveWhilstDown(target, whileMove) {
    // Function called, when we are done with with dragging
    let endMove = function () {
        checkIfDone(grid,solution);
        window.removeEventListener('mouseover', whileMove);
        window.removeEventListener('mouseup', endMove);
    };

    target.addEventListener('mousedown', function (event) {
        event.stopPropagation(); 
        if(event.which === 1){
            dragPath = []; // Empty dragPath  // dragPath - two dimensional array: dragPath[x][0] - hex_id || dragPath[x][1] - hex_colour  ||  dragPath[x][2] - time between current and last move
            dragPath.push([event.target.id,grid[event.target.id].colour]); // Push the source of the path     
            window.currentDragColour = grid[event.target.id].colour;
            window.addEventListener('mouseover', whileMove,);
            window.addEventListener('mouseup', endMove);   
        }
    });
}
      
///////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                    Adding EventListeners                                              //
///////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Getting all hexagon svg elements
        let elements = Array.from(document.querySelectorAll('svg .hex'));
        // Adding EventListeners for each of them
        elements.forEach(function(el) {
            // EventListener for normal click and double-click
            el.addEventListener('click', function(event){
                clickCount++;
                if(clickCount === 1){  // Do if single click
                    singleClickTimer = setTimeout(function(){
                        clickCount = 0;
                        changeColour(event);
                    },200); // Time given in ms to listen for dbclick
                } else if (clickCount === 2){ // Do if doubleclick
                    clearTimeout(singleClickTimer);
                    clickCount = 0;
                    resetColour(event);
                }
            }, false);  
            // EventListener for dragging
            mouseMoveWhilstDown(el,dragColour);
            // EventListener for right-click
            el.addEventListener('contextmenu',setCurrentColour);
        });

        function setCurrentColour(e){
            e.preventDefault();
            if(grid[e.target.id].colour != 0){
                currentColour = grid[e.target.id].colour;  // Updating current selected colour
                document.querySelector('#colourBox').setAttribute('style','fill:'.concat(grid.getColourByIndex(currentColour)));   // Filling the colour box with the current colour
            }
        }

        function changeColour(e){
            currentHex = grid[e.target.id]; 
            // If the colour of the currently selected Hexagon is not fixed and does not violate the Triplet rule, we colour it to the currently selected colour
            if(currentHex.canBeColoured()){
                if(currentColour != 0){  // Only start colouring, when a colour is selected (=> Not the 'uncoloured' state) 
                    if(grid.noTriplets(currentHex,currentColour)){
                        currentHex.colour = currentColour  // Modify colour to the current colour selected
                        e.target.style.fill = grid.getHexColour(currentHex);   // Updating the colour
                    }
                } 
            } else {
                // Selected a fixed coloured hexagon: Use the coolour as selected colour
                setCurrentColour(e);
            }
            checkIfDone(grid,solution);
        };

        function dragColour(e){
            // If we are on the Hex Board
            if($(e.target).attr('class') === 'hex'){
                currentHex = grid[e.target.id];
                previousHex = grid[dragPath[dragPath.length-1][0]];
                // Check, in case we leave the board (ie. if Hex1 is at the edge, we hold the mouse-click down on it, leave the board and move the mouse onto Hex1 again: Current Hex will be the same as the previous Hex in the path-array)
                if(!(currentHex===previousHex) && currentDragColour!=0){
                    // Check if the colour of the current hex is fixed
                    if(currentHex.canBeColoured()){
                        // Check if the currentHex is a neighbour of last coloured Hex && Check for rule: No same-coloured Triplets
                        if(grid.areNeighbours(previousHex,currentHex) && grid.noTriplets(currentHex,window.currentDragColour)){
                            // Check if the current Hex has the same colour as the previous one
                            if(previousHex.colour == currentHex.colour){
                                // If same colour, check if we are backtracking
                                if (dragPath.length>1){ // Check if backtracking is possible
                                    backtrack = grid[dragPath[dragPath.length-2][0]];
                                    if(currentHex === backtrack){ 
                                        // We are backtracking 
                                        // Check if previous Hexagon was one with a fixed colour
                                        if(previousHex.canBeColoured()){
                                            // Colour the previous Hex to its previous colour and remove it from our colouring path
                                            previousHex.colour = dragPath[dragPath.length-1][1];  
                                            $('#'+dragPath[dragPath.length-1][0])[0].setAttribute('style','fill:'.concat(grid.getHexColour(previousHex))); // Getting previous coloured Hex-svg
                                            dragPath.pop()
                                        } else {
                                            dragPath.pop()
                                        }
                                    } // If we are not backtracking, do nothing, since the colours are the same. We do not push it, else it introduces complications with backtracking 
                                } // If the dragPath only contains one element (or less), do nothing (We are at the source of the dragging path)
                            } else {
                                // If the colours are not the same and we are allowed to colour it then we push it into the dragPath
                                 dragPath.push([e.target.id, currentHex.colour]);
                                // Update color of Hexagon to the current drag-colour and show it on the UI
                                currentHex.colour = window.currentDragColour;   
                                e.target.style.fill = grid.getHexColour(currentHex); 
                            }
                        }
                    } else {
                        // If the colour of the current Hex is fixed:
                        // Check if both Hexagons are neighbours and have the same colour || No need to check for the Triplet rule, since that case should never happen at this point (can use graph theory to prove it)
                        if(grid.areNeighbours(previousHex,currentHex) && (previousHex.colour == currentHex.colour)){
                            // Check if the current Hex is already in our dragging Path
                            if(pathIncludes(dragPath,[e.target.id, currentHex.colour])){
                                // Check if we are backtracking
                                backtrack = grid[dragPath[dragPath.length-2][0]];
                                if(currentHex === backtrack){ 
                                    // We are backtracking
                                    // Check if previous Hexagon was one with a fixed colour
                                    if(previousHex.canBeColoured()){
                                        // Colour the previous Hex to its previous colour and remove it from our colouring path
                                        previousHex.colour = dragPath[dragPath.length-1][1];  
                                        $('#'+dragPath[dragPath.length-1][0])[0].setAttribute('style','fill:'.concat(grid.getHexColour(previousHex))); // Getting previous coloured Hex-svg
                                        dragPath.pop()
                                    } else {
                                        // Previous Hexagon was a fixed coloured one. Simply pop it from our path.
                                        dragPath.pop()
                                    }
                                }
                            } // Do nothing, since the current hexagon has a fixed colour. => End of our dragging path. 
                        }
                    }
                }
            }
        }

        function resetColour(e){
            currentHex = grid[e.target.id];
            if(currentHex.colour != 0){
                // Reset the colour (set back to initial colour 0 - white) of the selected hexagon if it's colour was not fixed.
                if(currentHex.canBeColoured()){
                    currentHex.colour = 0; // 0 is the 'uncoloured state' for Hexagons 
                    e.target.style.fill = grid.getHexColour(currentHex);
                }
            }
        }
                    
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        //                                    Helper Functions                                                   //
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Same as Array.includes(), except it uses the values to compare instead of the reference type and is specifically designed for items of the class 'Hex'
        function pathIncludes(path,item){   
            let include = false;
            path.forEach(array => {
                if(array[0] == item[0] && array[1] == item[1]){
                    include = true;
                }
            });
            return include;
        }

        function setViewingVariables(){
            let min=0, max_x=0, max_y=0;
            for (let index = 0; index < grid.length; index++) {
                const corner = polygon_corners(pointy,grid[index]);
                corner.forEach(c => {
                    if(c.x > max_x){
                        max_x = c.x;
                    }
                    if(c.y > max_y){
                        max_y = c.y;
                    }
                    if(c.x < min){
                        min = c.x;
                    }
                    if(c.y < min){
                        min = c.y;
                    }
                });
            }
            // Shift amount is the most negative coordinate of all the hexagons
            shiftValue = -min;           
            // Set width and height of the canvas to fit all the hexagons 
            if(width < max_x+shiftValue){
                width = max_x+shiftValue;    
            }
            height = max_y+shiftValue;
        }

        /***** Function to check, if the current state of the puzzle corresponds to the solution *****/    
        function checkIfDone(grid,solution){
            // Comparing each Hexagons colour
            for (let i = 0; i < grid.length; i++) {
                if(grid[i].colour != solution[i].colour){
                    return false;
                }
            }
            // Current State is the same as the solution:
            // Show the Solved Pop Up Box
            $("#tutOverlay").show();
            return true;
        }
        return grid;
    }


/***** Function initialize the grid with the given puzzle id *****/
    setMap = function (grid,puzzleid){
        $.ajax({
            async: false,
            url: 'puzzle/'+puzzleid,
            type: 'GET',
            dataType:'json',
            
        }).done(function(data){
            data.forEach(element => {
                grid.push((Hex(element.hex_q,element.hex_r,element.hex_s,element.hex_colour)))
            }, 
            function errorCallback(error) {
                console.log(error); 
            });
        });
    }

/***** Function to initialize the solution grid *****/
    getSolution = function(array,puzzleid){
        $.ajax({
            async: false,
            url: 'puzzle_solution/'+puzzleid,
            type: 'GET',
            dataType:'json',
            
        }).done(function(data){
            data.forEach(element => {
                array.push((Hex(element.hex_q,element.hex_r,element.hex_s,element.hex_colour)))
            }, 
            function errorCallback(error) {
                console.log(error); 
            });
        });
    }

    /***** Function to check, if the current state of the puzzle corresponds to the solution *****/    
    checkIfDone = function(grid,solution){
        // Comparing each Hexagons colour
        for (let i = 0; i < grid.length; i++) {
            if(grid[i].colour != solution[i].colour){
                return false;
            }
        }
        // Current State is the same as the solution:
        // Show the Solved Pop Up Box
        $("#solved-dialog").css('visibility', 'visible');
        return true;
    }

    /**
 * Get path data for a rounded rectangle. Allows for different radius on each corner.
 * @param  {Number} w   Width of rounded rectangle
 * @param  {Number} h   Height of rounded rectangle
 * @param  {Number} tlr Top left corner radius
 * @param  {Number} trr Top right corner radius
 * @param  {Number} brr Bottom right corner radius
 * @param  {Number} blr Bottom left corner radius
 * @return {String}     Rounded rectangle SVG path data
 */

  roundedRectData = function (w, h, tlr, trr, brr, blr) {
    return 'M 0 ' + tlr
      + ' A ' + tlr + ' ' + tlr + ' 0 0 1 ' + tlr + ' 0'
      + ' L ' + (w - trr) + ' 0'
      + ' A ' + trr + ' ' + trr + ' 0 0 1 ' + w + ' ' + trr
      + ' L ' + w + ' ' + (h - brr)
      + ' A ' + brr + ' ' + brr + ' 0 0 1 ' + (w - brr) + ' ' + h
      + ' L ' + blr + ' ' + h
      + ' A ' + blr + ' ' + blr + ' 0 0 1 0 ' + (h - blr)
      + ' Z';
  };

}
