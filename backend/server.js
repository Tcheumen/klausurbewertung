require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');

// Routen importieren
const dataRoutes = require('./routes/dataRoutes');
const thresholdRoutes = require('./routes/thresholdRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const exportRoutes = require('./routes/exportRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:3000', 'https://mon-site.com'], // Ajout de localhost:4200
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use('/exports', express.static(path.join(__dirname, 'exports')));

// Routes API
app.use('/api/data', dataRoutes);
app.use('/api/data', thresholdRoutes);
app.use('/api/data', moduleRoutes);
app.use('/api/export', exportRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal error has occurred!' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
