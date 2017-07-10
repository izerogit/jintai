const mysql = require('mysql');
const winston = require('winston');
const fs = require("fs");

function DBServer() {
    var dbconn;
    this.configFile = "./config.json";
    this.configData = null;

    

    this.initDatabaseConn = function (callback) {
        winston.log('info', "[Comparer.initDatabaseConn]start.");
        if (null == this.configData) {
            this.getConfig(function (err, data) {
                if (err) {
                    callback(err, null);
                } else {
                    var database = data.database;
                    for (var index = 0; index < database.length; index++) {
                        var item = database[index];
                        winston.log('info', "[Comparer.initDatabaseConn]index=" + index + ",item=" + JSON.stringify(item));
                        var param = {
                            host: item.host,
                            port: item.port,
                            user: item.user,
                            password: item.password,
                            database: item.database
                        };

                        this.addConn(item.id, param, function (err, data) {
                            callback(err, data);
                        });
                    }
                }
            });
        }
    };

this.addConn = function (connName, connParam, callback) {
        winston.log('info', '[DBServer.addConn]start.connName=' + connName);
        var conn = mysql.createConnection({
            host: connParam.host,
            user: connParam.user,
            password: connParam.password,
            database: connParam.database,
            port: connParam.port
        });

        conn.connect(function (err) {
            if (err) {
                winston.log('error', 'error connecting: ' + err.stack);
                callback(err, null);
            } else {
                dbconn = conn;

                winston.log('info', '[DBServer.addConn]success.connName=' + connName);
                callback(null, conn);
            }
        });
    };
    ///callback(err, data)：错误时err不为空，data为空；有数据返回时err为空，data不为空，返回数据。
    this.getConfig = function (callback) {
        console.log('info', "[InitDb.getConfig]configFile=" + this.configFile + ",this.configData=" + this.configData);

        if (this.configData) {
            console.log('info', "[InitDb.getConfig]this.configData has read.");
            callback(null, this.configData);
            return;
        }

        fs.readFile(this.configFile, 'utf-8', function (err, data) {
            if (err) {
                callback(err, data);
            } else {
                console.log('info', "[Comparer.getConfig]querystring.parse.data=" + data);
                configData = JSON.parse(data, ';', ':');
                console.log(configData);
                //winston.log('info', "[Comparer.getConfig]callback.configData=" + JSON.stringify(configData));
                callback(null, configData);
            }
        });
    };


    this.getTableData = function (item, callback) {
        console.log('info', '[DBServer.getTableData]start.connName=firstdatabase');
        var tableName = item;
        if (!conn) {
            console.log('info', 'get conn faile.connName=firstdatabase');
            return null;
        }

        var sqlDesc = 'desc ' + tableName;
        //winston.log('info', "[DBServer.getTableData]sqlDesc=" + sqlDesc);

        var descSelect = null;
        conn.query(sqlDesc, function (err, rows) {
            if (err) {
                console.log('info', err);
                return null;
            }

            console.log('info', "desc: " + rows.length);
            //winston.log('info', rows);

            descSelect = rows;

            var dataSelect = null;
            var sqlSelect = "select * from " + tableName;
            winston.log('info', "[DBServer.getTableData]sqlSelect=" + sqlSelect);
            conn.query(sqlSelect, function (err, rows) {
                if (err) {
                    winston.log('info', '[DBServer.getTableData]err:', err);
                    return null;
                }

                winston.log('info', '[DBServer.getTableData]info length:' + rows.length);
                dataSelect = rows;
                console.log(rows);
                var res = {
                    desc: descSelect,
                    data: dataSelect
                };

                //winston.log('info', "[DBServer.getTableData]res=" + res);
                //winston.log('info', "[DBServer.getTableData]dataSelect[0]=" + dataSelect[0].toString());
                callback(res);
            });
        });
    };

    //执行查询语句
    this.Query = function (queryStr, callback) {
        console.log('info', '[DBServer.Query]start.connName=' + dbconn);
        if (!dbconn) {
            console.log('info', 'get conn faile.connName=' + dbconn);
            return null;
        }


        dbconn.query(queryStr, function (err, rows) {
            if (err) {
                console.log('info', '[DBServer.Query]err:', err);
                return null;
            }

            winston.log('info', '[DBServer.Query]info length:' + rows.length);
            dataSelect = rows;
            console.log(rows);
            var res = {
                data: dataSelect
            };

            //winston.log('info', "[DBServer.getTableData]res=" + res);
            //winston.log('info', "[DBServer.getTableData]dataSelect[0]=" + dataSelect[0].toString());
            callback(res);
        });
    };
};

module.exports = DBServer;
