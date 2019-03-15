var dbConfig = require('./dbConfig');

var pool = null;
var appPool = null;
var rememberConfig = null;
var dbInfo = JSON.parse(JSON.stringify(dbConfig.dbConfig));

module.exports = {

    getAppConnection : function (sql, appName, dbList) {
        if (rememberConfig === appName) {
            if (appPool) return appPool;
        } else {
            rememberConfig = appName;
        }

        //if (appPool) return appPool;
        var conn;//= new sql.ConnectionPool(dbConfig);
        var dbObj;
        if (dbList) {
            for (var i=0; i< dbList.length; i++) {
                if (appName === dbList[i].APP_NAME) {
                    dbObj = dbList[i];
                    break;
                }
            }
        }
        if (typeof dbObj === 'object') {
            dbInfo.user = dbObj.USER_NAME;
            dbInfo.password = dbObj.PASSWORD;
            dbInfo.server = dbObj.SERVER;
            dbInfo.database = dbObj.DATABASE_NAME;

            conn = new sql.ConnectionPool(dbInfo);
        } else {
            conn = new sql.ConnectionPool(dbConfig.dbConfig);
        }
        //override close behavior to eliminate the pool
        var close_conn = conn.close;
        conn.close = function(){
            appPool = null;
            close_conn.apply(conn, arguments);
        }

        return appPool = conn.connect()
            .then(function(){ return conn; })
            .catch(function(err){
                appPool = null;
                return Promise.reject(err);
            });
    },

    getConnection : function (sql) {
       if (pool) return pool;

       var conn = new sql.ConnectionPool(dbConfig.dbConfig);
        var close_conn = conn.close;
        conn.close = function(){
            pool = null;
            close_conn.apply(conn, arguments);
        }

        return pool = conn.connect()
            .then(function(){ return conn; })
            .catch(function(err){
                pool = null;
                return Promise.reject(err);
            });
    }      
}