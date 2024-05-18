import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import processController from './controller/process.controller.js'
import azureController from './controller/azure.controller.js'

// Create Express server
const app = express(); // New express instance
const port = 3000; // Port number

// Express configuration
app.use(cors()); // Enable CORS
app.use(helmet()); // Enable Helmet
app.use(morgan('dev')); // Enable Morgan
app.use(express.json()); // Enable JSON parsing

app.get('/', (req, res) => {
    res.send('Hello World!');
  }
);

app.use('/process', processController);
app.use('/azure', azureController);

// Start Express server
app.listen(port, () => {
  // Callback function when server is successfully started
  console.log(`Server started at http://localhost:${port}`);
});

// Export Express app
export default app;