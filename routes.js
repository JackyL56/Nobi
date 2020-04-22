var express = require("express");
var router = express.Router();

router.get("/",function(req,res){
    console.log("Basic start page here")
//    res.render("index");
  //  res.send("API working properly")   // response when /.. is accessed
});



/*
router.get('/directory/:param',(req,res)=>{  // :param - will make param into a parameter
    const database = Object.keys(database);
    res.send(database);

    const p = req.params.param; // get the parameter
})*/

module.exports = router;