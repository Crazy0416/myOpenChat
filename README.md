# MyOpenChat

## 설명 

MyOpenChat은 node.js와 socket.io를 이용해 익명 오픈 채팅방을 간단하게 구현한 것이다.



## Dependency

- mongoDB (개발 환경: v3.6)
- npm socket.io, mongoose
- node.js



## Install

```bash
git clone https://github.com/Crazy0416/myOpenChat
cd myOpenChat
npm install
node bin/www
```

**※전제조건** : 

1. mongod가 활성화, myOpenChat 데이터베이스 자동 생성



## socket.io 주의할 점

**첫 번째.** bin/www

```javascript
...
const server = http.createServer(app);

// server는 io 선언 전에 미리 선언해야함!!
// 그렇지 않으면 chatRoom.html의 javascript 코드에서
// <script src="/socket.io/socket.io.js"/>와 var socket = io()가 디폴트로 설정 안됌
const io = require('socket.io')(server);
const ioHandler = require('../routes/socketIO')(io);

...
```



**두 번째.**

socket.io의 Room은 따로 설정해두지 않는 이상 컴퓨터의 메모리에 저장하기 때문에 scale out을 하는 경우 Room을 공유할 수 없다. => 따로 설정하기.

