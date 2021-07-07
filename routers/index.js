const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const session = require('./session');
const request = require('request');

router.use(session);

const USER = process.env.RPC_USER;
const PASS = process.env.RPC_PASSWORD;
const PORT = 9636; // RPCport
const ID_STRING = "TimoCoin";
const headers = {
  "content-type": "text/plain;"
};

router.use(session);

router.get('/', (req,res) => {
    res.render('index', {
        title: ejs.render('title'),
        logined: req.session.logined,
        userId: req.session.userId,
    });
});


/* getblockcount */
router.post('/getblockcount', (req, res) => {
    const blockcountString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"getblockcount","params":[]}`;
    const blockcountOptions = {
        url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
        method: "POST",
        headers: headers,
        body: blockcountString
    };
    
    blockcountCallback = (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const data = JSON.parse(body);
            res.send({height: data.result});
        }
    };
    request(blockcountOptions, blockcountCallback);
});


/* listtransactions */
router.post('/listtransactions', (req, res) => {
    let time = [];
    let account = [];
    let to = [];
    let txid = [];

    const listString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"listtransactions","params":[]}`;
    const listOptions = {
        url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
        method: "POST",
        headers: headers,
        body: listString
    };

    listCallback = async (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const listData = JSON.parse(body);

            for(let i = 0; i < listData.result.length; i++) {
                time.push(listData.result[i].time);
                account.push(listData.result[i].account);
                to.push(listData.result[i].address);
                txid.push(listData.result[i].txid);
            }

            res.send({
                length: listData.result.length,
                time: time,
                account: account,
                to: to,
                txid: txid,
            });
        }
        else console.log("=======> listtransactions 에러");
    };
    request(listOptions, listCallback);
});


/* getaccountaddress ==> transactions에서 account(from)의 계좌 주소 찾기 */
router.post('/getaccountaddress', (req, res) => {
    const getaddrString = `{"jsonrpc":"1.0","id":"${ID_STRING}","method":"getaccountaddress","params":["${req.body.account}"]}`;
    const getaddrOptions = {
        url: `http://${USER}:${PASS}@127.0.0.1:${PORT}/`,
        method: "POST",
        headers: headers,
        body: getaddrString
    };

    getaddrCallback = (error, response, body) => {
        if (!error && response.statusCode == 200) {
            const getaddrData = JSON.parse(body);
            res.send(getaddrData.result);
        }
        else console.log("=======> getaddr 에러");
    };
    request(getaddrOptions, getaddrCallback);
});


module.exports = router;