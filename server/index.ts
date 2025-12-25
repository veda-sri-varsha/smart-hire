import express from 'express';
import cors from 'cors';
import userRoutes from './routes/user.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Backend is alive ✅');
});

// mount users router
app.use('/users', userRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});

