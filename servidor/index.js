var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
let arrayNotas = [];

// Settings for CORS
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.header('Access-Control-Allow-Origin', 'http://localhost:8080');
  
  // Request methods you wish to allow
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  
  // Request headers you wish to allow
  res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Pass to next layer of middleware
  next();
  });
  

app.get('/', function (req, res) {
  res.send('Hello World!');
});

io.on('connection', function(socket){

    socket.emit('connection', arrayNotas);

    socket.on('nuevaNota', function(nota){
        arrayNotas.push(nota);
        socket.broadcast.emit('nuevaNota', nota);
    })
    // Quiero que se borre la nota de todas partes si la borro en una sesión, pero no me termina de funcionar

    socket.on('borrarNota', function(indice){
        console.log(indice);
        arrayNotas.splice(JSON.parse(indice), 1);
        socket.broadcast.emit('borrarNota', JSON.stringify(indice));
        /*
        //Enviamos este evento para App la cual generará una notificación indicando que se ha borrado una nota
        socket.broadcast.emit('notaborrada', {
          nickname: socket.nick,
          nombreNota: nota.texto
        });*/
    });

    socket.on('cambioRealizado', function(nuevoArray){
      arrayNotas = nuevoArray;
      socket.broadcast.emit('cambioRealizado', arrayNotas);
    });

});

http.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});