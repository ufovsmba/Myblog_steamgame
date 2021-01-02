const fs = require('hexo-fs');
const path = require('path');
const https =require('https');
const cheerio = require('cheerio');
var parser = require('fast-xml-parser');

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
          console.log('statusCode:', res.statusCode);
          console.log('headers:', res.headers);
      
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
          console.error(e);
      });
  
      console.log('123');
  
  }
  function SaveGames(response)
  {
  
      if( parser.validate(response) === true) { //optional (it'll return an object in case it's not valid)
          var jsonObj = parser.parse(response,{parseTrueNumberOnly: true});
          var json_data = JSON.stringify(jsonObj,null,4);
          fs.writeFile(path.join(__dirname, "/data/games.json"), json_data, err => {
              if (err) {
                  console.log(err);("Failed to write data to games.json");
                  console.log(err);
              } else {
                  console.log(json_data.length + "game data are saved.");
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
              console.log(err);("Failed to write data to profiles.json");
              console.log(err);
          } else {
              console.log(json_data.length + "profiles data are saved.");
          }
      });
  
  }

function GentrateFile()
{
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
        console.log( self.route.get(id));	
        self.route.get(id) && self.route.get(id)._data().then(function (contents) {	
            //console.log(id);	
            fs.writeFile(path.join(publicDir, id), contents);	
            console.log("Generated: %s", id);	
            });	
        });
}


hexo.extend.console.register('t', 'test', function(args){
//   var profile_url= `https://steamcommunity.com/profiles/76561198423529474/`;
//   GetUrl(profile_url,SaveProfile);
//   var game_url =`https://steamcommunity.com/profiles/76561198423529474/games/?tab=all&xml=1`; 
//   GetUrl(game_url,SaveGames);

    var name = 'steam';	  

    hexo.extend.generator.register(name, require('./lib/' + name + '-generator'));	  

    var self = this;	
    var publicDir = self.public_dir;	

    //Generate files	
    self.load().then(function () {	
        if(!fs.existsSync(publicDir)){	
        fs.mkdirSync(publicDir);	
        }	

        var id = name + "/index.html";	
       // console.log( self.route.get(id));	
        self.route.get(id) && self.route.get(id)._data().then(function (contents) {	
            //console.log(id);	
            fs.writeFile(path.join(publicDir, id), contents);	
            console.log("Generated: %s", id);	
            });	
        });
  //Register route


});
