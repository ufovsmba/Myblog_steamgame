const fs = require('hexo-fs');
const path = require('path');
const https =require('https');
var url= `https://steamcommunity.com/profiles/76561198423529474/?xml=1`;

const options = {
    timeout: 30 * 60 * 1000,
    rejectUnauthorized: false,
    dataType: 'xml',
    headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"
    }
  };
  
function UpdateInfo()
{
    var response_xml = '';
    https.get(url, options ,(res) => {
        console.log('statusCode:', res.statusCode);
        console.log('headers:', res.headers);
    
        res.on('data', (d) => {
            process.stdout.write(d);
            response_xml+=d;   
        });
        res.on('end', () => {
            fs.writeFile(path.join(__dirname, "/data/profile.xml"), response_xml, err => {
                if (err) {
                    console.log(err);("Failed to write data to games.xml");
                    console.log(err);
                } else {
                    console.log(response_xml.length + "game data are saved.");
                }
            });
            
          });
    
    }).on('error', (e) => {
        console.error(e);
    });

    console.log('123');
}

hexo.extend.console.register('t', 'test', function(args){
  //Register route
  var name = 'steam-games';

  hexo.extend.generator.register(name, require('./lib/' + name + '-generator'));

  var self = this;
  var publicDir = self.public_dir;

  //Generate files
  self.load().then(function () {
    if(!fs.existsSync(publicDir)){
      fs.mkdirSync(publicDir);
    }
  
    var id = name + "/index.html";
    //console.log( self.route.get(id));
    self.route.get(id) && self.route.get(id)._data().then(function (contents) {
        //console.log(id);
        fs.writeFile(path.join(publicDir, id), contents);
        console.log("Generated: %s", id);
        });
    });

});

  /*
  const fs = require('hexo-fs');
const axios = require('axios-https-proxy-fix');
const cheerio = require('cheerio');
const https = require('https');
var log = require('hexo-log')({
    debug: false,
    silent: false
});

const agent = new https.Agent({  
    rejectUnauthorized: false
})

let options = {
    options: [
        { name: '-u, --update', desc: 'Update steam games data' },
        { name: '-d, --delete', desc: 'Delete steam games data' }
    ]
};

hexo.extend.generator.register('steamgames', function (locals) {
    if (!this.config.steam || !this.config.steam.enable) {
        return;
    }
    return require('./lib/steam-games-generator').call(this, locals);
});
hexo.extend.console.register('_steam', 'Update steam games data', options, function (args) {
    if (args.d) {
        if (fs.existsSync(path.join(__dirname, "/data/"))) {
            fs.rmdirSync(path.join(__dirname, "/data/"));
            log.info('Steam games data has been deleted');
        }
    } else if (args.u) {
        if (!this.config.steam || !this.config.steam.enable) {
            log.info("Please add config to _config.yml");
            return;
        }
        if (!this.config.steam.steamId) {
            log.info("Please add steamId to _config.yml");
            return;
        }
        updateSteamGames(this.config.steam.steamId, this.config.steam.tab, this.config.steam.length, this.config.steam.proxy);
    } else {
        console.error("Unknown command, please use \"hexo bangumi -h\" to see the available commands")
    }
});

function updateSteamGames(steamId, tab = "recent", length = 1000, proxy = false) {
    log.info("Getting steam games, please wait...");
    let options = {
        method: "GET",
        url: `https://steamcommunity.com/profiles/${steamId}/games/?tab=${tab}`,
        timeout: 30 * 60 * 1000,
        responseType: "text",
        httpsAgent : agent,
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"
        }
    };
    if (proxy && proxy.host && proxy.port) {
        options.proxy = {
            host: proxy.host,
            port: proxy.port
        };
    }
    axios(options).then(response => {
        if (response.status === 200) {
            let $ = cheerio.load(response.data);
            console.log(response.data);
            let script = $('script[language="javascript"]');
            var games = [];
            for (let i = 0; i < script.length; i++) {
                if (script.eq(i).html().includes("rgGames")) {
                    let rgGames = script.eq(i).html().match(/var.*?rgGames.*?=.*?(\[[\w\W]*?\}\}\]);/);
                    if (rgGames) {
                        games = JSON.parse(rgGames[1]);
                        break;
                    }
                }
            }
            if (games.length === 0) {
                log.error('No game data obtained.')
                return;
            }
            if (!fs.existsSync(path.join(__dirname, "/data/"))) {
                fs.mkdirsSync(path.join(__dirname, "/data/"));
            }
            let gameData = games.slice(0, length);
            fs.writeFile(path.join(__dirname, "/data/games.json"), JSON.stringify(gameData), err => {
                if (err) {
                    log.info("Failed to write data to games.json");
                    console.log(err);
                } else {
                    log.info(gameData.length + "game data are saved.");
                }
            });
        } else {
            console.error('ERROR: ' + response.status)
        }
    }).catch(error => {
        console.log(error);
    });
}




hexo.extend.console.register('t', 'test', function(args){
    updateSteamGames(this.config.steam.steamId, this.config.steam.tab, this.config.steam.length, this.config.steam.proxy);
  });

  */