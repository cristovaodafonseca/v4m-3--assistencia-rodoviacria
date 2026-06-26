const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const supabase = require('./supabase');

const app = express();
const PORT = 3000;
const JWT_SECRET = 'v4m-secret-key-2025';

// ========== MIDDLEWARE ==========
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
  fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ========== AUTH MIDDLEWARE ==========
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
}

// ========== AUTH ROUTES ==========
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !password) {
    return res.status(400).json({ error: 'Nome, telefone e palavra-passe são obrigatórios' });
  }

  const { data: existing } = await supabase.from('users').select('id').eq('phone', phone).single();
  if (existing) {
    return res.status(400).json({ error: 'Este número de telefone já está registado' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const { data, error } = await supabase.from('users').insert({
    name, phone, email: email || null, password: hashedPassword
  }).select('id, name, phone, email, plan, plan_expiry').single();

  if (error) return res.status(500).json({ error: 'Erro ao criar conta' });

  const token = jwt.sign({ userId: data.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, user: data });
});

app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    return res.status(400).json({ error: 'Telefone e palavra-passe são obrigatórios' });
  }

  const { data: user } = await supabase.from('users').select('*').eq('phone', phone).single();
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({
    token,
    user: { id: user.id, name: user.name, phone: user.phone, email: user.email, plan: user.plan, plan_expiry: user.plan_expiry }
  });
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const { data: user } = await supabase.from('users')
    .select('id, name, phone, email, plan, plan_expiry, created_at')
    .eq('id', req.userId).single();
  if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });
  res.json(user);
});

// ========== USER ROUTES ==========
app.put('/api/user/profile', authMiddleware, async (req, res) => {
  const { name, email } = req.body;
  const updates = {};
  if (name) updates.name = name;
  if (email !== undefined) updates.email = email;

  await supabase.from('users').update(updates).eq('id', req.userId);
  const { data: user } = await supabase.from('users')
    .select('id, name, phone, email, plan, plan_expiry').eq('id', req.userId).single();
  res.json(user);
});

app.put('/api/user/password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { data: user } = await supabase.from('users').select('password').eq('id', req.userId).single();

  if (!bcrypt.compareSync(currentPassword, user.password)) {
    return res.status(400).json({ error: 'Palavra-passe atual incorreta' });
  }

  const hashed = bcrypt.hashSync(newPassword, 10);
  await supabase.from('users').update({ password: hashed }).eq('id', req.userId);
  res.json({ message: 'Palavra-passe atualizada com sucesso' });
});

// ========== ASSISTANCE ROUTES ==========
app.post('/api/assistance', upload.single('photo'), async (req, res) => {
  const { user_id, guest_name, guest_phone, location_lat, location_lng, location_address, problem_type, description } = req.body;
  const photo = req.file ? req.file.filename : null;

  const { data, error } = await supabase.from('assistance_requests').insert({
    user_id: user_id || null,
    guest_name: guest_name || null,
    guest_phone: guest_phone || null,
    location_lat: location_lat ? parseFloat(location_lat) : null,
    location_lng: location_lng ? parseFloat(location_lng) : null,
    location_address: location_address || null,
    problem_type,
    description: description || null,
    photo
  }).select('id').single();

  if (error) return res.status(500).json({ error: 'Erro ao criar pedido' });

  if (user_id) {
    await supabase.from('notifications').insert({
      user_id,
      title: 'Pedido Recebido',
      message: 'O seu pedido de assistência foi recebido. Aguarde pela nossa equipa.'
    });
  }

  res.json({ id: data.id, message: 'Pedido de assistência criado com sucesso' });
});

app.get('/api/assistance', authMiddleware, async (req, res) => {
  const { data } = await supabase.from('assistance_requests')
    .select('*').eq('user_id', req.userId).order('created_at', { ascending: false });
  res.json(data || []);
});

app.get('/api/assistance/:id', authMiddleware, async (req, res) => {
  const { data } = await supabase.from('assistance_requests')
    .select('*').eq('id', req.params.id).eq('user_id', req.userId).single();
  if (!data) return res.status(404).json({ error: 'Pedido não encontrado' });
  res.json(data);
});

app.put('/api/assistance/:id/cancel', authMiddleware, async (req, res) => {
  await supabase.from('assistance_requests')
    .update({ status: 'cancelled', updated_at: new Date().toISOString() })
    .eq('id', req.params.id).eq('user_id', req.userId).eq('status', 'pending');
  res.json({ message: 'Pedido cancelado' });
});



// ========== NOTIFICATIONS ROUTES ==========
app.get('/api/notifications', authMiddleware, async (req, res) => {
  const { data } = await supabase.from('notifications')
    .select('*').eq('user_id', req.userId)
    .order('created_at', { ascending: false }).limit(20);
  res.json(data || []);
});

app.put('/api/notifications/:id/read', authMiddleware, async (req, res) => {
  await supabase.from('notifications').update({ read: 1 })
    .eq('id', req.params.id).eq('user_id', req.userId);
  res.json({ message: 'Notificação lida' });
});

app.put('/api/notifications/read-all', authMiddleware, async (req, res) => {
  await supabase.from('notifications').update({ read: 1 }).eq('user_id', req.userId);
  res.json({ message: 'Todas as notificações marcadas como lidas' });
});

// ========== STATIC PAGES ==========
const publicPages = ['sobre', 'servicos', 'cobertura', 'planos', 'faq', 'contactos'];
const authPages = ['dashboard', 'solicitar', 'historico', 'plano', 'perfil'];

publicPages.forEach(page => {
  app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, `${page}.html`)));
  app.get(`/${page}.html`, (req, res) => res.sendFile(path.join(__dirname, `${page}.html`)));
});

authPages.forEach(page => {
  app.get(`/${page}`, (req, res) => res.sendFile(path.join(__dirname, `app/${page}.html`)));
  app.get(`/${page}.html`, (req, res) => res.sendFile(path.join(__dirname, `app/${page}.html`)));
});

app.get('/entrar', (req, res) => res.sendFile(path.join(__dirname, 'app/entrar.html')));
app.get('/registrar', (req, res) => res.sendFile(path.join(__dirname, 'app/registrar.html')));
app.get('/pedido-rapido', (req, res) => res.sendFile(path.join(__dirname, 'app/pedido-rapido.html')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// 404
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Rota não encontrada' });
  }
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`\n  V4M Platform running at:`);
  console.log(`  Local:   http://localhost:${PORT}`);
  console.log(`  API:     http://localhost:${PORT}/api`);
  console.log(`  Press Ctrl+C to stop\n`);
});
