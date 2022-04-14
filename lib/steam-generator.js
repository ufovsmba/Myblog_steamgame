const ejs = require('ejs');
const path = require('path');
const fs = require('hexo-fs');
const log = require('hexo-log')({
    debug: false,
    silent: false
});


module.exports = async function (locals) {
    let config = this.config.steam;
    if (!config || !config.enable) {
        return;
    }
    var profiles = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/profiles.json')));
    var row_games = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/games.json')));
    if(!row_games ||!row_games.gamesList)
    {
        log.error('game data error , please reget you get data');
        return ;
    }
    var games = row_games.gamesList.games.game;
    games.sort(function(a,b){
        return b.hoursOnRecord - a.hoursOnRecord;
    });
    for(var i=0;i<games.length;i++)
    {
        for(var j = 0;j<config.except.length;j++)
        {
            if(games[i].appID==config.except[j])
                games.splice(i,1);
        }
    }
    if(games.length>config.length)
    {
        games.splice(config.length,games.length-config.length);
    }

    // console.log(profiles);

    let contents = '';
    ejs.renderFile(path.join(__dirname, 'templates/steam.ejs'), {
        'steamId': config.steamId,    
        'playerLevel': config.playerLevel,
        'playerAvater': profiles.playerAvater,   
        'personalName': profiles.personalName,
        'profileSummary': profiles.profileSummary,
        'steamState': profiles.steamState,
        'games':games
    },
        function (err, result) {
            if (err) log.error(err);
            contents = result;
            return result;
        });
    
    return {
        path:  config.path ||'steam/index.html',
        data: {
            title: config.front_matter.title,
            top_img: config.front_matter.top_img,
            aside: config.front_matter.aside,
            content: contents
        },
        layout: ['page', 'post']
    };
}

