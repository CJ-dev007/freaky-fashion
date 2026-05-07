const express = require('express');
const router = express.Router();
const { isAdmin } = require('../../middleware/auth'); 
const db = require('../../data/db');

router.get('/', isAdmin, (req, res) => {
    res.render('admin/index', { title: 'Admin Dashboard' });
});


module.exports = router;