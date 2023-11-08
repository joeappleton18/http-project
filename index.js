const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const ejs = require('ejs');



const app = express();
const server = http.createServer(app);
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
	const headers = req.headers;
	// console.log(headers);

	// for (const x in headers) {
	// 	console.log(`${x}: ${headers[x]}`);
	// }
	res.render('index', { headers: headers });
}
);


app.get('/about', (req, res) => {
	res.sendFile(__dirname + '/about.html');
}
);

server.listen(3000, () => {
	console.log('listening on *:3000');
});


