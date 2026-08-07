const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json());
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);
const { protect } = require('./middleware/auth.middleware');
const menuRoutes = require('./routes/menu.routes');
app.use('/api/menu', menuRoutes);


app.get('/', (req, res) => {
    res.send('Server is running');
});

app.get('/api/admin/test', protect ,(req, res) => {
    res.json({message: 'You are authenticated', user: req.user });
});

app.listen(3000, () => {
    console.log('server running on http://localhost:3000');
});