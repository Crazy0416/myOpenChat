const mongoClient = require('mongoose');

const memberSchema = new mongoClient.Schema({
    title: String,
    createOn: Date
});

module.exports = mongoClient.model('room', memberSchema);