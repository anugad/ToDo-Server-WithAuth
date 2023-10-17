const express = require('express');
const router = express.Router();
const db = require('../models/taskModel');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');


// admin only
router.post('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {

    const newTask = req.body.task;
    db.createTask(newTask, (err, result) => {
      if (err) {
        console.error('Error adding task: ' + err);
        res.status(500).json({ success: false, message: 'Error adding task' });
      } else {
        res.status(200).json({ success: true, message: 'Task added successfully' });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// both admin and user
router.get('/', authMiddleware, async (req, res) => {
  try {
    db.getTasks((err, results) => {
      if (err) {
        console.error('Error fetching tasks: ' + err);
        res.json({ success: false, message: 'Error fetching tasks' });
      } else {
        res.json({ tasks: results });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Update a task only admin
router.put('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {

    const taskId = req.params.id;
    const updatedTaskText = req.body.task;

    db.updateTask(taskId, updatedTaskText, (err, result) => {
      if (err) {
        console.error('Error updating task: ' + err);
        res.json({ success: false, message: 'Error updating task' });
      } else {
        res.json({ success: true, message: 'Task updated successfully' });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// admin only
router.delete('/:id', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
 
    const taskId = req.params.id;

    db.deleteTask(taskId, (err, result) => {
      if (err) {
        console.error('Error deleting task: ' + err);
        res.json({ success: false, message: 'Error deleting task' });
      } else {
        res.json({ success: true, message: 'Task deleted successfully' });
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
