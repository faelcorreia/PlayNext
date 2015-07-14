var express = require('express');
var request = require('request');
var app = express();
app.use(express.static(__dirname + '/app'))

var key = 'B1D8105F367F2C4FE1ACA9C1F64EC504';

app.get('/game/:user', function (req, res) {
	var user = req.params.user;
	request('http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=' + key + '&vanityurl=' + user,
		function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var data = JSON.parse(body);
				if (data.response.success == 1)
					getGame(data.response.steamid, res);
				else
					res.sendStatus(401);
			}
			else {
				res.sendStatus(401);
			}
		});

	
});

var getGame = function(steamid, res) {
	request('http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + key + '&steamid=' + steamid + '&format=json&include_appinfo=1',
		function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    var data = JSON.parse(body);
		    var games = [];
		    if (data.response.game_count > 0) {
			    data.response.games.forEach(function(game) {
			    	if (game.playtime_forever < 120) {
			    		games.push(game);
			    	}
			    });
			    var index = Math.floor(Math.random() * games.length);
			    var obj = {
			    	appid : games[index].appid,
			    	logoHash : games[index].img_logo_url,
			    	name : games[index].name
			    }
			    res.send(obj);	    
			}
			else {
				res.sendStatus(400);
			}
		  }
		  else {
		  	res.sendStatus(400);
		  }
		})
}

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
});