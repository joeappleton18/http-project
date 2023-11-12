const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const bodyParser = require('body-parser');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');
const audio = path.join(__dirname, 'glass.mp3');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));
app.get('/', (req, res) => {
	const headers = req.headers;
	// console.log(headers);

	// for (const x in headers) {
	// 	console.log(`${x}: ${headers[x]}`);
	// }
	console.log(res.socket);
	res.render('index', { headers: headers });
}
);


app.get('/about', (req, res) => {
	res.sendFile(__dirname + '/about.html');
}
);

app.get('/differentRequests', (req, res) => {
	res.render('differentRequests');
});

app.get('/chat', (req, res) => {
	res.cookie("webAndDatabaseSystems", "I love web development!!!")
	res.render('chat');
});

app.post('/differentRequests', (req, res) => {

	const data = req.body;
	console.log(data);
	res.send(req.body);

});


app.get('/controls', (req, res) => {
	res.render('controls');
})

app.get('/grid', (req, res) => {
	res.render('grid');
})

app.use((req, res) => {
	res.status(404).render('404', { headers: req.headers, path: { url: req.originalUrl, method: req.method } });

}
);


io.on('connection', (socket) => {
	socket.on('chat message', (msg) => {
		io.emit('chat message', msg);
	});

	socket.on('play', () => {
		console.log('sending audio');
		const stream = fs.createReadStream(audio, { highWaterMark: 1000 });

		stream.on('data', (chunk) => {
			console.log('sending chunk');
			io.emit('audioChunk', chunk);
		});

		stream.on('end', () => {
			console.log('sending end');
			io.emit('audioEnd');
		});

		socket.on('disconnect', () => {
			console.log('Client disconnected');
			stream.destroy();
		});

	});
});


server.listen(3000, () => {
	console.log('listening on *:3000');
});


