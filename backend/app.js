/**
 * Ponto de entrada da API — AcolheMulher
 *
 * Endpoints de auth (Pessoa B):
 *   POST /api/login
 *   POST /api/logout
 *   GET  /api/me
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api', authRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`AcolheMulher API rodando na porta ${PORT}`);
  });
}
