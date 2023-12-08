const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const recordSchema = new Schema({
    Image: String,
    Description: String,
    DateTime: { type: Date, default: Date.now }
});

const MonitorRecords = mongoose.model('MonitorRecords', recordSchema, 'MonitorRecords');

module.exports = MonitorRecords;
