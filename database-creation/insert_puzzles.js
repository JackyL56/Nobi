const sqlite3 = require('sqlite3');

const fs = require('fs');
const readline = require('readline')


var lineReader = require('readline').createInterface({
    input: require('fs').createReadStream('sample.txt')
});
  
lineReader.on('line', function (line) {
    console.log('Line from file:', line);
    
    
    let startRow = false;
    for (let i = 0; i < line.length; i++) {
        
        
        
        if(line.charAt(i) == '"'){
            if(startRow){
                startRow = !startRow;
                console.log("End of Row")
            } else {
                startRow = !startRow;
                console.log("Start of Row")
            }
        }
        // console.log(line.charAt(i));

    }

});

/* 
const inputStream = fs.createReadStream('sample.txt')

const rl = readline.createInterface({input: inputStream})

// var content = fs.readFileSync('sample.txt','utf8');

const generator = (push, next) => {
    rl.on('line', line => {
        push(null, line)
    })
    rl.on('close', () => {
        push(null, __.nil)
    })
}

let counter = 0;

const __ = require('highland')
// Counts number of lines
const countLines = () => {
  __(generator)
    .tap(() => counter++)
    .done(() => console.log(`line count: ${counter}`))
}

countLines(); */