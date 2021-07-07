const http = require('http'); // http 서비스
const express = require('express'); // express로 프로젝트 제작 express-generator 사용안함
const bodyParser = require('body-parser'); // 데이터 변환
const path = require('path'); // 패치하기
const ejs = require('ejs'); // ejs 사용
const dotenv = require("dotenv"); // 환경변수 .env사용
dotenv.config(); //  dotenv 적용

// express 연결
const app = express();
const server = http.createServer(app);

// bodyParser 데이터 안깨지기 위한 설정
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

const indexRouter = require('./routers/index');
const signupRouter = require('./routers/signup');
const signinRouter = require('./routers/signin');
const sendfromRouter = require('./routers/sendfrom');
const transactionRouter = require('./routers/gettransaction');

app.use('/', indexRouter);
app.use('/signup', signupRouter);
app.use('/signin', signinRouter);
app.use('/sendfrom', sendfromRouter);
app.use('/gettransaction', transactionRouter);

// 호스트와 포트 설정
const hostname = '127.0.0.1'; // 로컬 호스트
const port = 3001; // node.js 포트 설정


// ejs 설정 및 디렉토리 경로 설정
app.set('view engine', 'ejs'); // ejs 모듈 사용
app.set('views', './views'); // views 폴더 설정
app.use(express.static(path.join(__dirname, 'routes'))); // routes 폴더 설정
app.use(express.static(path.join(__dirname, 'public'))); // public 폴더 설정


// 서버 연결 상태 확인
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
