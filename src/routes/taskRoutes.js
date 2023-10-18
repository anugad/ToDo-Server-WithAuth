const express = require('express');
const router = express.Router();
const db = require('../models/taskModel');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/tasks')


// admin only
router.post('/', [authMiddleware, adminMiddleware], createTask);

// both admin and user
router.get('/', [authMiddleware], getTasks);

// admin only
router.put('/:id', [authMiddleware, adminMiddleware], updateTask);

// admin only
router.delete('/:id', [authMiddleware, adminMiddleware], deleteTask);

module.exports = router;
