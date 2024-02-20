const express = require('express');  // se importa modulul Express
const application = express(); // instanta reprezinta serverul web

application.use(express.static('proiectLicenta'));  // se adauga middleware
                                            // -> toate fisierele din acest folder devin publice prin intermediul serverului

var fileName = '/proiectLicenta/licenta.html'
var portVal = 3000;

application.get('/', (req, res) => {
  
  res.sendFile(__dirname + fileName);  // __dirname = directorul curent al fisierului de cod
});

application.listen(portVal, () => {
  console.log('Serverul rulează pe portul: ' + portVal);
});





