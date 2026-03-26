const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const userRoutes = require('./routes/userRoutes');
const therapistRoutes = require('./routes/therapistRoutes');
const sleepRoutes = require('./routes/sleepRoutes');
const todoRoutes = require('./routes/todoRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const friendRoutes = require('./routes/friendRoutes');

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes ✅ (ALL routes must be here)
app.use('/api/users', userRoutes);
app.use('/api/therapists', therapistRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/friends', friendRoutes);

app.use('/api/appointments', require('./routes/appointmentRoutes'));

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Middleware
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});