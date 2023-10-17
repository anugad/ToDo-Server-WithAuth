const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Require the authentication middleware
const authMiddleware = require('./src/middleware/authMiddleware');

// Require the JWT secret key from the secrets.js file
const { jwtSecret } = require('./src/config/secrets');

// Routes
const taskRoutes = require('./src/routes/taskRoutes');
const signupRoutes = require('./src/routes/signup');
const signinRoutes = require('./src/routes/signin');

app.use('/api/signup', signupRoutes);
app.use('/api/signin', signinRoutes);

// Apply the auth middleware to protect the task routes
app.use('/api/tasks', authMiddleware, taskRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
