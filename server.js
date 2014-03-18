const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const fs = require('fs');
const app = express();
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;
const compression = require('compression')

app.use(compression());
// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));

//handle tracking for thankyou page
app.get('/thankyou', function (req, res) {
	//res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	const filePath = path.resolve(__dirname, 'build', 'index.html');
	fs.readFile(filePath, 'utf8', function (err, data) {
		data = data.replace(/\$GOOGLE_TRACKING_SCRIPT/g, `gtag('event', 'conversion', {'send_to': 'AW-925657075/wsJ3CPiEoIUBEPPPsbkD'});`);
	    res.send(data);
	});
});

//handle homepage for social sharing
app.get('/', function (req, res) {
	//res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	const filePath = path.resolve(__dirname, 'build', 'index.html');
	fs.readFile(filePath, 'utf8', function (err, data) {
		if(req.url.includes('/?fbshare=')){
			let src='https://s3.amazonaws.com/accelerlist-media-share/';
			src = src + req.url.replace('/?fbshare=', '');
			data = data.replace(/\$OG_IMAGE_URL/g, src);
			data = data.replace(/\$OG_URL/g, req.url);
			data = data.replace(/\$OG_IMAGE_WIDTH/g, "1200");
			data = data.replace(/\$OG_IMAGE_HEIGHT/g, "628");
		} else {
			data = data.replace(/\$OG_IMAGE_URL/g, '%PUBLIC_URL%/accelerlist.png');
			data = data.replace(/\$OG_URL/g, 'https://app.accelerlist.com');
			data = data.replace(/\$OG_IMAGE_WIDTH/g, "1200");
			data = data.replace(/\$OG_IMAGE_HEIGHT/g, "630");
			data = data.replace(/\$GOOGLE_TRACKING_SCRIPT/g, "");
		}
	    res.send(data);
	});
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
  return res.send('pong');
});

//handle all URLs
app.get('*', function (req, res) {
	//res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
	const filePath = path.resolve(__dirname, 'build', 'index.html');
	fs.readFile(filePath, 'utf8', function (err, data) {
		data = data.replace(/\$OG_IMAGE_URL/g, '%PUBLIC_URL%/accelerlist.png');
		data = data.replace(/\$OG_URL/g, 'https://app.accelerlist.com');
		data = data.replace(/\$OG_IMAGE_WIDTH/g, "1200");
		data = data.replace(/\$OG_IMAGE_HEIGHT/g, "630");
		data = data.replace(/\$GOOGLE_TRACKING_SCRIPT/g, "");
	    res.send(data);
	});
});

app.listen(process.env.PORT || 8080);

