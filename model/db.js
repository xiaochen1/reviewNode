const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const SD = require("silly-datetime");
const dburl = "mongodb://localhost:27017";
const dbName = "reviewNode";


exports._connect = _connect;
exports.getDocumentsByColName = getDocumentsByColName;
exports.addUser = addUser; // 添加用户
exports.register = register; // 注册用户
exports.checkLogin = checkLogin;
exports.getShuoList = getShuoList;
exports.addShuoShuo = addShuoShuo;

//数据库连接
/**
 * 
 * @param {*数据库名称*} dbname 
 * @param {*回调函数*} cb 
 */
function _connect(cb) {

    let client = new MongoClient(dburl, { useNewUrlParser: true });

    client.connect((err) => {
        // assert.equal(null, err);
        const db = client.db(dbName);
        console.log("client------->");
        console.log(client);
        console.log("db------->");

        console.log(db);
        console.log("client内容到此结束");
        cb(err, db, client);
    });
}


//根据集合名称获取集合数据
/**
 * 
 * @param {数据库名称} dbname 
 * @param {集合名称} colname 
 * @param {查询时条件} option 
 * @param {回调函数} callback 
 */
function getDocumentsByColName(colname, option = {}, opquery = { page_size: 10, page_index: 1 }, callback) {
    _connect((err, db, client) => {

        assert.equal(err, null);
        console.log("getDocumentsByColName-------");
        console.log(db);
        console.log(client);
        assert.equal(null, err);
        console.log("根据集合名称获取集合中的数据");
        console.log(colname);
        const collection = db.collection(colname);
        console.log(collection);

        let result = {
            code: 500,
            msg: "",
            page_index: opquery.page_index || 1,
            page_size: opquery.page_size || 10,
            total_records: 0,
            total_pages: 0,
            data: []
        };

        let cursor = collection.find(option);

        cursor.limit(result.page_size).skip((opquery.page_index - 1) * opquery.page_size).toArray((err, docs) => {
            assert.equal(err, null);
            cursor.count(false, {}, (err, count) => {
                assert.equal(err, null);
                result.code = 200;
                result.msg = "查询成功";
                result.total_records = count;
                result.total_pages = Math.ceil(count / result.page_size);
                result.data = docs;

                callback(null, result);
                client.close();

            });
        });

        // cursor.count(true, { limit: opquery.page_size, skip: (opquery.page_index - 1) * opquery.page_size }, (err, count) => {
        //     assert.equal(err, null);

        //     cursor.toArray((err, docs) => {
        //         assert.equal(err, null);
        //         result.data = docs;
        //         result.page_index = opquery.page_index || result.page_index;
        //         result.page_size = opquery.page_size || result.page_size;
        //         result.total_pages = Math.ceil(docs.length / result.page_size);
        //         result.total_records = count;

        //         callback(null, result);
        //         client.close();
        //     });
        // })

        // collection.find({}).limit(3).skip(2).toArray((err, docs) => {
        //     assert.equal(null, err);
        //     let result = {};
        //     callback(null, docs);
        //     client.close();
        // });
    });
}

//------ 用户表 （user）  相关操作-----------------------------------------------------

// 增
function addUser(info, cb) {
    _connect((err, db, client) => {
        assert.equal(err, null);
        let user_coll = db.collection("user");
        user_coll.insertOne(info, {}, (err, result) => {
            console.log(assert.equal(err, null));
            console.log(result);
            cb(null, result);
            client.close();
        });
    });
}

// 查
function getUserInfo(info, cb) {

}


/**
 * 
 * @param  info  用户信息
 */
function register(info, cb) {
    addUser(info, cb);
}


function checkLogin(info, cb) {
    _connect((err, db, client) => {
        assert.equal(err, null);
        let collection = db.collection("user");
        let query = {
            username: info.username || "",
            password: info.password || ""
        }
        let returnResult = {};
        console.log(info.username, info.password);
        // let cursor = collection.find(query);
        let cursor = collection.find(query);
        cursor.toArray((err, docs) => {
            if (err || docs.length == 0) {
                returnResult.code = 500;
                returnResult.msg = "用户名或密码错误";
                returnResult.data = null;
                cb(returnResult.msg, returnResult);
                client.close();
                return;
            }
            returnResult.code = 200;
            returnResult.msg = "登录成功";
            returnResult.data = docs[0];
            cb(null, returnResult);
            client.close();

        });

    });
}


function getShuoList(userid, cb) {
    _connect((err, db, client) => {

        if (err) {
            cb(err, null);
            return;
        }
        let collection = db.collection("shuoshuo");
        let cursor = collection.find();
        console.log("cursor-------------->");
        console.log(cursor);

        cursor.sort("created", -1).toArray((err, docs) => {
            if (err) {
                cb(err, null);
                return;
            }

            docs = docs.map(element => {
                element.created = SD.format(element.created, "YYYY-MM-DD HH:mm:ss");
                return element;
            });

            console.log(docs);


            let usercoll = db.collection("user");
            let user_cursor = usercoll.find();
            user_cursor.toArray((err, userdocs) => {
                if (err) {
                    cb(err, null);
                    return;
                }

                let alluser = userdocs;
                let returnResult = {};
                returnResult.allShuoShuo = docs;
                returnResult.allUser = userdocs;

                cb(null, returnResult);

            });
        });
    });
}



function addShuoShuo(info, cb) {
    _connect((err, db, client) => {
        if (err) {
            cb(err, null);
            return;

        }

        let collection = db.collection("shuoshuo");
        // info.created = SD.format(new Date(), "YYYY-MM-DD HH:mm:ss");
        info.created = new Date();
        collection.insertOne(info, (err, result) => {
            if (err) {
                cb(err, null);
                return;
            }
            info.created = SD.format(info.created, "YYYY-MM-DD HH:mm:ss");
            cb(null, {
                code: 200,
                result: result,
                data: info
            });
            client.close();
        });
    });
}