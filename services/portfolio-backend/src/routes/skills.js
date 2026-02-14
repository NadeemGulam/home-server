const express = require('express');
const {skills} = require('../data/skills');
const router = express.Router();

router.get('/skills', (req, res)=>{
    res.json(skills);
});

module.exports = router;