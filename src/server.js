const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');

// dotenv : .env 파일을 읽어 process.env 생성
dotenv.config();
// 최상위 경로가 아닐 경우
// dotenv.config({ path: '/config/.env' })
const app = express();
const PORT = process.env.PORT || 8000;
const router = require('./routes');
const userRouter = require('./routes/user');

app.set('port', PORT);

// ************* Logger Middleware 적용 ************* 
// [HTTP Method] [URL] [HTTP Status] [Response Rate] - [Response Byte]
// morgan 기본 제공 옵션값
// - combined : :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"
// - common : :remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]
// - dev : :method :url :status :response-time ms - :res[content-length]
// - short : :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms
// - tiny : :method :url :status :res[content-length] - :response-time ms
// if(process.env.PROFILE == 'PROD') {
//     app.use(logger('combined'));
// } else {
//     app.use(logger('dev'));
// }
app.use((req, res, next) => {
    if(process.env.NODE_ENV == 'PROD') {
        app.use(logger('combined'));
    } else {
        app.use(logger('dev'));
    }
    next();
});

// ************* Static Files Supply Middleware 적용 ************* 
app.use('/', express.static(path.join(__dirname, 'public')));
console.log('__dirname: {}', __dirname)

// ************* Body-Parser Middleware 적용 ************* 
// json 데이터를 req.body에 저장
app.use(express.json());
// extended가 false = node의 querystring 모듈 사용
// extended가 true = qs 모듈 사용
// form 데이터를 req.body에 저장
app.use(express.urlencoded({ extended: false }));

// ************* Cookie-Parser Middleware ************* 
app.use(cookieParser(process.env.COOKIE_SECRET));
// 요청에서 온 쿠키를 확인 = req.cookies / 서명된 쿠키 = req.signedCookies
// 응답으로 쿠키 적용 = res.cookie(key, value[, {options}])
// 쿠키 제거 = res.clearCookie(key, value[, {options}]) > 생성된 쿠키의 key, value, option 일치

// ************* Express-Session Middleware ************* 
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'song'
}));

// 업로드 경로 체크
try {
    fs.readdirSync('uploads');
} catch(err) {
    console.error('uploads 디렉토리가 없습니다. \n uploads 디렉토리를 생성합니다.');
    fs.mkdirSync('uploads');
}

// Multer Middleware 생성
const uploader = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }
});

app.use('/', router);
app.use('/user', userRouter);

// app.get('/upload', (req, res) => {
//     res.sendFile(path.join(__dirname, '/../public/multipart.html'));
// });

// app.post('/upload', uploader.fields([{ name: 'file1' }, { name: 'file2' }]), (req, res) => {
//     console.log('files: ', req.files, ', body: ', req.body);
//     res.send('success..!');
// });

// 일치하는 라우터가 없을 때 404 처리.
// 없어도 express가 404 처리.
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 를 찾을 수 없습니다.`);
    error.status = 404;
    next(error);
});

// Error Middleware
app.use((err, req, res, next) => {
    console.error('Error: ', err);
    res.status(err.status || 500);

    if(err.status == 404) {
        res.sendFile(path.join(__dirname, '/../public/pages/404.html'));
    } else {
        res.send('sorry.');
    }
})

app.listen(app.get('port'), () => {
    console.log(`${PORT}에 연결되었습니다.`);
});