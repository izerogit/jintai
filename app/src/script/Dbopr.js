const fs = require("fs");
const winston = require('winston');
var DBServer = require(__dirname+'/dbserver');

function Dbopr(){
    const dbServer = new DBServer();

    this.configFile = "./config.json";
    this.configData = null;
    this.monitor = [];

function init(){
    initDatabaseConn(function(err, data) {
        if (err) {
            winston.log('info', 'initDatabaseConn faile.err=更改了这个文件' + err);
        } else {
            hasInit = true;
            winston.log('info', 'initDatabaseConn success.data=' + data);
        }

    });
}
    this.initDatabaseConn = function(callback){
        winston.log('info', "[Comparer.initDatabaseConn]start.");
        if(null == this.configData){
            this.getConfig(function(err, data){
                if(err){
                    callback(err, null);
                }else{
                    var database = data.database;
                    for(var index = 0; index < database.length; index++){
                        var item = database[index];
                        winston.log('info', "[Comparer.initDatabaseConn]index=" + index + ",item=" + JSON.stringify(item));
                        var param = {
                            host: item.host,
                            port: item.port,
                            user: item.user,
                            password: item.password,
                            database: item.database
                        };

                        dbServer.addConn(item.id, param, function(err, data){
                            callback(err, data);
                        });
                    }
                }
            });
        }
    };

    ///callback(err, data)：错误时err不为空，data为空；有数据返回时err为空，data不为空，返回数据。
    this.getConfig = function(callback){
        console.log('info', "[InitDb.getConfig]configFile=" + this.configFile + ",this.configData=" + this.configData);

        if(this.configData){
            console.log('info', "[InitDb.getConfig]this.configData has read.");
            callback(null, this.configData);
            return;
        }

        fs.readFile(this.configFile, 'utf-8', function(err, data){
            if(err){
                callback(err, data);
            }else{
                console.log('info', "[Comparer.getConfig]querystring.parse.data=" + data);
                configData = JSON.parse(data, ';', ':');
                console.log(configData);
                //winston.log('info', "[Comparer.getConfig]callback.configData=" + JSON.stringify(configData));
                callback(null, configData);
            }
        });
    };

    this.Query = function(queryStr, callback) {
       dbServer.Query(queryStr,function (err, data) {
                        if (err) {
                            console.log('info', 'initDatabaseConn faile.err=' + err);
                        } else {
                            hasInit = true;
                            console.log('info', 'initDatabaseConn success.data=' + data);
                        }
                    }); 
    };
};

module.exports = Dbopr;
