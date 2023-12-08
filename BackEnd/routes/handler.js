const express = require('express');
const router = express.Router();
const Schemas = require('../models/Schemas.js');

router.post('/addRecord', async (req, res) => {
    const record = { Image: req.body.imageData, Description: '' };
    const newRecord = new Schemas.MonitorRecords(record);

    try {
        await newRecord.save((err, newRecordResults) => {
            if (err) {
                res.end('Error Saving.');
            } else {
                console.log('Created!');
                res.end('Created!');
            }
        });
    } catch (err) {
        console.log(err);
        res.end();
    }
});

router.get('/getRecord', async (req, res) => {
    const monitorRecords = Schemas.MonitorRecords;

    try {
        const records = await monitorRecords.find({})
            .sort({ DateTime: -1 })
            .exec();
        if (records.length > 0) {
            res.json(records);
        } else {
            res.end();
        }
    } catch (err) {
        console.error('Error retrieving records:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deleteRecord/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Schemas.MonitorRecords.findByIdAndDelete(id);
        res.json({ message: 'Record deleted.' });
    } catch (err) {
        console.error('Error deleting record:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/editRecord/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { description } = req.body;
        await Schemas.MonitorRecords.findByIdAndUpdate(id, { Description: description });
        res.end('Record updated.');
    } catch (err) {
        console.error('Error updating record:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/deleteAll', async (req, res) => {
    try {
        await Schemas.MonitorRecords.deleteMany({});
        res.send('All documents deleted.');
    } catch (err) {
        console.error('Error deleting documents:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;