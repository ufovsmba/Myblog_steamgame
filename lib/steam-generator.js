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
        'playerLevel': profiles.playerLevel,
        'playerAvater': profiles.playerAvater,   
        'personalName': profiles.personalName,
        'profileSummary': profiles.profileSummary,
        'steamState': profiles.steamState,
        'games':games
    },
        function (err, result) {
            if (err) console.log(err);
            contents = result;
            return result;
        });
    
    return {
        path:  'steam/index.html',
        data: {
            title: config.title,
            top_img: config.top_img,
            aside: false,
            content: contents
        },
        layout: ['page', 'post']
    };
}


/*
module.exports = async function (locals) {

    let config = this.config;
    if (!config.steam || !config.steam.enable) {
        return;
    }

    let root = config.root;
    if (root.endsWith('/')) {
        root = root.slice(0, root.length - 1);
    }

    let games=[];
    if (!fs.existsSync(path.resolve(__dirname, '../data/games.json'))) {
        log.info(`Can't find steam game data, please use 'hexo steam -u' command to get data`);
    }else{
        games = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../data/games.json'))).slice(0, config.length || 1000);
    //    log.info(games.length + ' games have been loaded');
    }
    
    let __ = i18n.__(config.language);

    let contents = '';
    ejs.renderFile(path.join(__dirname, 'templates/games.ejs'), {
        'quote': config.steam.quote,
        'steamId': config.steam.steamId,
        'imgUrl': config.steam.imgUrl,
        'games': games,
        '__': __,
        'root': root
    },
        function (err, result) {
            if (err) console.log(err);
            contents = result;
            return result;
        });

    return {
        path: config.steam.path || 'steam-games/index.html',
        data: {
            title: config.steam.title,
            aside: false,
            content: contents
        },
        layout: ['page', 'post']
    };
};
*/