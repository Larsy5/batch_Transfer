var express = require('express')
var app = express()
var cors = require('cors')
app.use(cors());

const redis = require('redis');
const client = redis.createClient( 6379, '88.99.99.37');

async function connectRedis() {
    client.connect().then(() => {
        console.log('----------------Redis连接成功---------------------');
    });
}

async function quitRedis() {
    client.quit().then(() => {
        console.log("----------------执行完成,退出Redis连接-------------");
    });
}

// 生成一个新的许可证
async function addNewCod(addTime) {
    var uuid = guid();
    console.log(uuid);
    sadd(uuid, "true", addTime);
    return uuid;
}

// 生成唯一值uuid
function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 向redis添加进许可证
async function sadd(key, value, addTime) {
    var ttl = await client.ttl(key);
    return client.setEx(key, ttl + addTime, value);
}

app.get('/isPermit/:key', function (req, res) {
    client.ttl(req.params.key).then(val => {
        res.send(JSON.stringify(val));
    })
})

app.get('/getPermit/:date', function (req, res) {
    var addTime;
    if (req.params.data == 'year') {
        addTime = 365 * 24 * 60 * 60;
    } else if (req.params.date == 'month') {
        addTime = 30 * 24 * 60 * 60;
    } else {
        res.send("参数错误");
        return;
    }
    addNewCod(addTime).then(val => {
        res.send(val);
    })
})

app.get('/addTime/:permit/:date', function (req, res) {
    var addTime;
    if (req.params.date == 'year') {
        addTime = 365 * 24 * 60 * 60;
    } else if (req.params.date == 'month') {
        addTime = 30 * 24 * 60 * 60;
    } else {
        res.send("参数错误");
        return;
    }
    sadd(req.params.permit, 'true', addTime).then(val => {
        res.send(val);
    })
})

app.listen('8081',()=>{
    connectRedis();
    console.log("runing");
})
