const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/auth'); 
// const db = require('../../data/db');
// Behövs inte här, app.js skyddar hela /admin globalt

router.get('/', (req, res) => {
    res.render('admin/index', { title: 'Admin Dashboard' });
});


module.exports = router;