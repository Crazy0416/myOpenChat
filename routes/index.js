const express = require('express');
const router = express.Router();
const path = require('path');
const roomModel = require('../models/room');

// 메인 화면
router.get("/", function(req, res) {
    roomModel.find({}, (err, rooms) => {
        if(err) {
            console.error("ERR mongoose", err);
            res.status(500).send();
        } else {
            console.log("rooms: ", rooms);
            res.render("roomView", {titles: rooms});
        }
    });
});

// 채팅 방 만들기 위해 new 버튼 눌렀을 때
router.get('/new', function(req, res){
    res.render('createRoom');
});

// 채팅 방 만들기 버튼 눌렀을 때
router.post('/titles', function(req,res){
    let r_title = req.body.title;
    roomModel.create({
        title: r_title,
        createOn: Date.now()
    }, (err, room) => {
        if(err) console.log("ERR: ", err);
        console.log("create room: ", room);

        res.redirect('/titles/'+room._id);
    });
});

// 각 채팅 방
router.get('/titles/:id', function(req,res){
    res.sendFile(path.join(__dirname, '../public/chatRoom.html'));
});

module.exports = router;
