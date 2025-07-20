//index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Importing Swagger UI for API documentation
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';


//dot env configuration
dotenv.config();

//initialize express app
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//connect to mongodb
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
connectDB();

//--------------------------------Routes-----------------------------------
//define routes
app.use('/api/auth', authRoutes);
app.use('/api/habit', habitRoutes);
app.use('/api/user', userRoutes);

// api docs
const swaggerDocument = YAML.load('./openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//handle invalid routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});



//start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});

