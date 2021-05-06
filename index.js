const fs = require('hexo-fs');
const path = require('path');
const https =require('https');
const cheerio = require('cheerio');
var parser = require('fast-xml-parser');
var log = require('hexo-log')({
    debug: false,
    silent: false
  });


const options = {
    timeout: 30 * 60 * 1000,
    rejectUnauthorized: false,
    dataType: 'xml',
    headers: {
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36"
    }
  };
  
  function GetUrl(url,fuc)
  {
      https.get(url, options ,(res) => {
          var response = '';
          log.debug('statusCode:', res.statusCode);
          log.debug('headers:', res.headers);
      
          res.on('data', (d) => {
              // console.log(d.toString());
              response+=d;
          });
          res.on('end', ()=>{
              // var res = buffer.toString();
            //   console.log(response);
              fuc(response);
          });
  
      }).on('error', (e) => {
          log.error(e);
      });
  
  }
  function SaveGames(response)
  {
  
      if( parser.validate(response) === true) { //optional (it'll return an object in case it's not valid)
          var jsonObj = parser.parse(response,{parseTrueNumberOnly: true});
          var json_data = JSON.stringify(jsonObj,null,4);
          fs.writeFile(path.join(__dirname, "/data/games.json"), json_data, err => {
              if (err) {
                  log.error(err);          
              } else {
                  log.info(json_data.length + "game data are saved.");
              }
          });
      
      }
      
  }
  

  function SaveProfile(response)
  {
    //   console.log(response)
      let $ = cheerio.load(response);
      var data={};
      data["playerLevel"] = $('span[class=friendPlayerLevelNum]').text();
      data["personalName"]  = $('span[class=actual_persona_name]').text();
      data["playerAvater"]  = $('div[class=playerAvatarAutoSizeInner] img').attr('src');
      data["profileSummary"]  = $('div[class=profile_summary]').text().trim();
      data["steamState"]  = $('div[class=profile_in_game_header]').text();
      var json_data = JSON.stringify(data,null,4);
      fs.writeFile(path.join(__dirname, "/data/profiles.json"), json_data, err => {
          if (err) {
              log.error(err);
          } else {
              log.info(json_data.length + "profiles are saved.");
          }
      });
  
  }

hexo.extend.generator.register('steam', function (locals) {
    if (!this.config.steam || !this.config.steam.enable || !this.config.steam.auto_generate) {
      return;
    }
    return require('./lib/steam-generator').call(this, locals);
  });


hexo.extend.console.register('asteam', 'Get my steam games and Generate steam page', function(args){
    if (!this.config.steam || !this.config.steam.enable ) {
        return;
      }
    // get info
    var profile_url= `https://steamcommunity.com/profiles/` + this.config.steam.steamId + '/';
    GetUrl(profile_url,SaveProfile);
    var game_url = `https://steamcommunity.com/profiles/` + this.config.steam.steamId + '/games/?tab=all&xml=1'; 
    GetUrl(game_url,SaveGames);

    //Generate files	
    var name = 'steam';	  
    hexo.extend.generator.register(name, require('./lib/' + name + '-generator'));	  
    var self = this;	
    var publicDir = self.public_dir;	    
    self.load().then(function () {	
        if(!fs.existsSync(publicDir)){	
            fs.mkdirSync(publicDir);	
        }	
        var id = name + "/index.html";	
        self.route.get(id) && self.route.get(id)._data().then(function (contents) {	
            fs.writeFile(path.join(publicDir, id), contents);	
            log.info("Generated: %s", id);	
            });	
    });
  //Register route
});
