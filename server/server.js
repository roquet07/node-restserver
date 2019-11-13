require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//habilitar la carpeta public
app.use( express.static(path.resolve(__dirname, '../public' )));



//Configuración global de rutas
app.use( require('./routes/index.js'));


mongoose.connect(process.env.URLDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
}, (err) => {
  if (err) {
      throw err;
  }
  console.log('Base de Datos online');

});

// mongoose.connect('mongodb://localhost:27017/cafe', 
// {useNewUrlParser: true,
//   useUnifiedTopology: true}, 
// (err, res) => {
//     if (err) throw err;
 
//     console.log('Base de datos online');
 
// });



// mongoose.connect('mongodb://localhost:27017/cafe',  {
//   useNewUrlParser: true,
//   useUnifiedTopology: true

// });

app.listen(process.env.PORT  , () =>{
  console.log('Escuchando puerto', process.env.PORT );
}); 