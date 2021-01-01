const ejs = require('ejs');
const path = require('path');
const fs = require('hexo-fs');
const i18n = require('./util').i18n;
const log = require('hexo-log')({
    debug: false,
    silent: false
});
var dom = require('xmldom').DOMParser
var parser = require('fast-xml-parser');
var he = require('he');

module.exports = async function (locals) {
    let config = this.config;
    if (!config.steam || !config.steam.enable) {
        return;
    }

    var options = {
        attributeNamePrefix : "@_",
        attrNodeName: "attr", //default is 'false'
        textNodeName : "#text",
        ignoreAttributes : true,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        parseTrueNumberOnly: false,
        arrayMode: false, //"strict"
        attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
        stopNodes: ["parse-me-as-string"]
    };
    var xmlData =  fs.readFileSync(path.resolve(__dirname, '../data/profile.xml'));
    //console.log(xmlData);
    if( parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
        var jsonObj = parser.parse(xmlData,options);
    }
    var tObj = parser.getTraversalObj(xmlData,options);
    var jsonObj = parser.convertToJson(tObj,options);
    var profile = jsonObj.profile;
    //var profile = JSON.parse(jsonObj);
    //console.log(tObj['profile']);

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
        path:  'steam-games/index.html',
        data: {
            title: 'steam',
            aside: false,
            content: 'doc'
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