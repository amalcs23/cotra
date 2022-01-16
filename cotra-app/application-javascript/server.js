const express = require("express");
var bodyParser = require('body-parser');
const fabric = require("./app.js")  
const app = express();
app.use(bodyParser.json());

app.get("/", function(req, res) {
    
    res.send(fabric.sample());
  });
    
app.post("/enrolladmin", function(req, res) {
  var org = Number(req.body.org);
  result =  fabric.enrollAdmin(org);
  res.send(result);
});

app.post("/enrolluser", function(req, res) {
  console.log(req.body.org);
  var org = Number(req.body.org);
  var user = req.body.user;
  result =  fabric.enrollUser(org,user);
  res.send(result);
});

app.post("/init", function(req, res) {
  console.log(req.body.org);
  var org = Number(req.body.org);
  var user = req.body.user;
  result =  fabric.InitLedger(org,user);
  res.send(result);
});

app.post("/createcitizen", function(req, res) {
  console.log(req.body.org);
  var org = Number(req.body.org);
  var user = req.body.user;
  var id = req.body.id;
  var name = req.body.name;
  var age = req.body.age;
  var dose = req.body.dose;
  var certHash = req.body.certHash;
  result =  fabric.CreateCitizen(org,user, id, name, age, dose, certHash);
  res.send(result);
});

app.post("/readcitizen", function(req, res) {
  var org = Number(req.body.org);
  var user = req.body.user;
  var id = req.body.id;
  result =  fabric.ReadCitizen(org,user,id);
  res.send(result);
});

app.post("/updatedose", function(req, res) {
  console.log(req.body.org);
  var org = Number(req.body.org);
  var user = req.body.user;
  var id = req.body.id;
  var dose = req.body.dose;
  result =  fabric.UpdateDose(org,user, id, dose);
  res.send(result);
});

app.listen(3000, function(){
    console.log("server is running on port 3000");
  })