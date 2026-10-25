import 'dotenv/config';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { DOCUMENTARIES, DUOS, PROTAGONISTS } from './src/data/mockData';
import { EXPLORER_CATEGORIES, EXPLORER_CATALOG } from './src/data/explorerTopicsData';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// Parse CLI arguments (--port 3000 --host 0.0.0.0) passed by AI Studio runner
const args = process.argv.slice(2);
function resolvePort(): number {
  const portIdx = args.indexOf('--port');
  if (portIdx !== -1 && args[portIdx + 1]) {
    const parsed = parseInt(args[portIdx + 1], 10);
    if (!isNaN(parsed) && parsed !== 8080) return parsed;
  }
  // Port 8080 is reserved for nginx reverse proxy in AI Studio.
  // The app dev server must always listen on port 3000.
  if (process.env.PORT && process.env.PORT !== '8080') {
    const parsed = parseInt(process.env.PORT, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return 3000;
}

function resolveHost(): string {
  const hostIdx = args.indexOf('--host');
  if (hostIdx !== -1 && args[hostIdx + 1]) {
    return args[hostIdx + 1];
  }
  return process.env.HOST || '0.0.0.0';
}

const PORT = resolvePort();
const HOST = resolveHost();
const isProd = process.env.NODE_ENV === 'production';

// In-memory data store for live collaboration and state
const inMemoryPledges: any[] = [];
const inMemoryMessages: any[] = [];
const inMemoryThreads: any[] = [];
const inMemoryUsers: Map<string, any> = new Map([
  ['qoctales@gmail.com', {
    id: 'usr-admin-romeo',
    email: 'qoctales@gmail.com',
    name: 'Romeo Nonvide',
    firstName: 'Romeo',
    lastName: 'Nonvide',
    role: 'ADMIN',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: 'Fondateur & Directeur éditorial de YonyWood.',
    territory: 'Cotonou & Paris',
    country: 'Bénin',
    messagePermission: 'all',
    pushNewMessage: true,
    messagePreview: true,
    language: 'fr',
    sharesCount: 125,
    createdAt: '2026-01-15'
  }]
]);

// Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const connectedUsers = new Map<string, string>();

io.on('connection', (socket) => {
  socket.on('authenticate', (token: string) => {
    connectedUsers.set(token, socket.id);
    socket.emit('authenticated', { token });
  });

  socket.on('join_thread', (threadId: string) => {
    socket.join(`thread:${threadId}`);
  });

  socket.on('leave_thread', (threadId: string) => {
    socket.leave(`thread:${threadId}`);
  });

  socket.on('typing', (data: { threadId: string; isTyping: boolean; userId?: string }) => {
    socket.to(`thread:${data.threadId}`).emit('user_typing', data);
  });

  socket.on('message', (msg: any) => {
    if (msg?.threadId) {
      socket.to(`thread:${msg.threadId}`).emit('message', msg);
    }
  });

  socket.on('disconnect', () => {
    for (const [userId, sId] of connectedUsers.entries()) {
      if (sId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// =============================================
// API ROUTES
// =============================================

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Yonywood API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Series
app.get('/api/series', (_req: Request, res: Response) => {
  res.json(DOCUMENTARIES);
});

app.get('/api/series/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const doc = DOCUMENTARIES.find((d) => d.id === id || d.slug === id);
  if (!doc) {
    res.status(404).json({ error: 'Série non trouvée' });
    return;
  }
  const seriesProtagonists = PROTAGONISTS.filter((p) => p.documentaryId === doc.id);
  const seriesDuos = DUOS.filter((d) => d.documentaryId === doc.id);
  res.json({
    ...doc,
    protagonists: seriesProtagonists,
    duos: seriesDuos,
  });
});

// Duos
app.get('/api/duos', (req: Request, res: Response) => {
  const { series } = req.query;
  let result = DUOS;
  if (series && typeof series === 'string') {
    const filter = series.split(',').map((s) => s.trim()).filter(Boolean);
    if (filter.length > 0) {
      result = DUOS.filter((d) => filter.includes(d.documentaryId));
    }
  }
  res.json(result);
});

app.get('/api/duos/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const duo = DUOS.find((d) => d.id === id || d.slug === id);
  if (!duo) {
    res.status(404).json({ error: 'Duo non trouvé' });
    return;
  }
  res.json(duo);
});

// Explorer (Astrolabe)
app.get('/api/explorer/categories', (_req: Request, res: Response) => {
  res.json(EXPLORER_CATEGORIES);
});

// Redirection permanente /memoires -> /sagesses
app.get('/memoires', (_req: Request, res: Response) => {
  res.redirect(301, '/sagesses');
});

app.get('/api/explorer/topics/:category', (req: Request, res: Response) => {
  let { category } = req.params;
  if (category === 'memoires') {
    category = 'sagesses';
  }
  const topics = (EXPLORER_CATALOG as Record<string, any>)[category] || [];
  res.json(topics);
});

// Coproduction
app.post('/api/coproduction/pledge', (req: Request, res: Response) => {
  const { seriesId, sharesCount, amount } = req.body;
  const pledge = {
    id: `pledge-${Date.now()}`,
    seriesId,
    sharesCount: Number(sharesCount) || 1,
    amount: Number(amount) || 10,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  };
  inMemoryPledges.push(pledge);
  res.status(201).json({ message: 'Coproduction confirmée avec succès', pledge });
});

app.get('/api/coproduction/portfolio', (_req: Request, res: Response) => {
  const totalShares = inMemoryPledges.reduce((sum, p) => sum + p.sharesCount, 0);
  const totalAmount = inMemoryPledges.reduce((sum, p) => sum + p.amount, 0);
  res.json({
    pledges: inMemoryPledges,
    summary: {
      totalShares,
      totalAmount,
      seriesCount: new Set(inMemoryPledges.map((p) => p.seriesId)).size,
    },
  });
});

app.get('/api/coproduction/simulation', (req: Request, res: Response) => {
  const { seriesId, sharesCount = '10' } = req.query;
  const shares = parseInt(sharesCount as string, 10) || 10;
  const PRICE_PER_SHARE = 10;
  const investedAmount = shares * PRICE_PER_SHARE;

  const scenarios = [
    {
      label: 'Scénario conservateur',
      viewerCount: 100000,
      revenuePerViewer: 0.05,
      projectedRevenue: 5000,
      yourShare: (shares / 1000) * 5000,
      roi: (((shares / 1000) * 5000 - investedAmount) / investedAmount) * 100,
    },
    {
      label: 'Scénario modéré',
      viewerCount: 500000,
      revenuePerViewer: 0.08,
      projectedRevenue: 40000,
      yourShare: (shares / 1000) * 40000,
      roi: (((shares / 1000) * 40000 - investedAmount) / investedAmount) * 100,
    },
    {
      label: 'Scénario optimiste',
      viewerCount: 2000000,
      revenuePerViewer: 0.12,
      projectedRevenue: 240000,
      yourShare: (shares / 1000) * 240000,
      roi: (((shares / 1000) * 240000 - investedAmount) / investedAmount) * 100,
    },
  ];

  const series = DOCUMENTARIES.find((d) => d.id === seriesId);

  res.json({
    sharesCount: shares,
    pricePerShare: PRICE_PER_SHARE,
    investedAmount,
    series: series ? { id: series.id, title: series.title } : null,
    scenarios,
  });
});

// Messaging
const handleGetThreads = (_req: Request, res: Response) => {
  res.json(inMemoryThreads);
};
const handleGetInvitations = (_req: Request, res: Response) => {
  res.json([]);
};
const handlePostMessage = (req: Request, res: Response) => {
  const { id } = req.params;
  const { text } = req.body;
  const message = {
    id: `msg-${Date.now()}`,
    threadId: id,
    content: text,
    createdAt: new Date().toISOString(),
  };
  inMemoryMessages.push(message);
  io.to(`thread:${id}`).emit('message', message);
  res.status(201).json(message);
};

app.get(['/api/messaging/threads', '/api/messages/threads'], handleGetThreads);
app.get(['/api/messaging/invitations', '/api/messages/invitations'], handleGetInvitations);
app.post(['/api/messaging/threads/:id/messages', '/api/messages/threads/:id/messages'], handlePostMessage);

app.post(['/api/messaging/invitations/:id/accept', '/api/messages/invitations/:id/accept'], (req: Request, res: Response) => {
  res.json({ success: true, invitationId: req.params.id, status: 'accepted' });
});

app.post(['/api/messaging/invitations/:id/decline', '/api/messages/invitations/:id/decline'], (req: Request, res: Response) => {
  res.json({ success: true, invitationId: req.params.id, status: 'declined' });
});

// Authentication & User preferences
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, firstName, lastName } = req.body || {};
  if (!email) {
    res.status(400).json({ error: 'Email requis' });
    return;
  }
  const cleanEmail = email.trim().toLowerCase();
  const existing = inMemoryUsers.get(cleanEmail);
  if (existing) {
    res.json({
      message: 'Compte existant',
      token: `demo-token-${existing.id}`,
      user: existing,
    });
    return;
  }
  const newUser = {
    id: `usr-${Date.now()}`,
    email: cleanEmail,
    name: `${firstName || ''} ${lastName || ''}`.trim() || cleanEmail.split('@')[0],
    firstName: firstName || cleanEmail.split('@')[0],
    lastName: lastName || '',
    role: cleanEmail === 'qoctales@gmail.com' ? 'ADMIN' : 'USER',
    sharesCount: 10,
    messagePermission: 'all',
    pushNewMessage: true,
    messagePreview: true,
    language: 'fr',
    createdAt: new Date().toISOString().split('T')[0],
  };
  inMemoryUsers.set(cleanEmail, newUser);
  res.status(201).json({
    message: 'Compte créé avec succès',
    token: `demo-token-${newUser.id}`,
    user: newUser,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body || {};
  if (!email) {
    res.status(400).json({ error: 'Email requis' });
    return;
  }
  const cleanEmail = email.trim().toLowerCase();
  let user = inMemoryUsers.get(cleanEmail);
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      email: cleanEmail,
      name: cleanEmail.split('@')[0],
      firstName: cleanEmail.split('@')[0],
      role: cleanEmail === 'qoctales@gmail.com' ? 'ADMIN' : 'USER',
      sharesCount: 10,
      createdAt: new Date().toISOString().split('T')[0],
    };
    inMemoryUsers.set(cleanEmail, user);
  }
  res.json({
    message: 'Connexion réussie',
    token: `demo-token-${user.id}`,
    user,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.json(inMemoryUsers.get('qoctales@gmail.com') || null);
    return;
  }
  for (const user of inMemoryUsers.values()) {
    if (authHeader.includes(user.id)) {
      res.json(user);
      return;
    }
  }
  res.json(inMemoryUsers.get('qoctales@gmail.com') || null);
});

app.put('/api/auth/preferences', (req: Request, res: Response) => {
  res.json({ success: true, preferences: req.body });
});

// Vite & Static Server
async function startServer() {
  if (!isProd) {
    app.use(express.static(path.resolve(__dirname, 'public'), { maxAge: '1h' }));
    app.use('/src/assets', express.static(path.resolve(__dirname, 'src/assets'), { maxAge: '1h' }));

    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        ws: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      if (req.originalUrl.startsWith('/api') || req.originalUrl.startsWith('/socket.io')) {
        return next();
      }
      if (req.originalUrl.match(/\.(jpg|jpeg|png|gif|svg|webp|avif|ico|mp4|webm|woff|woff2|ttf|eot)$/i)) {
        res.status(404).end();
        return;
      }
      try {
        const url = req.originalUrl;
        const template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const html = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  httpServer.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Exiting cleanly.`);
    } else {
      console.error('HTTP Server error:', err);
    }
    process.exit(1);
  });

  httpServer.listen(PORT, HOST, () => {
    console.log(`🚀 YonyWood server running at http://${HOST}:${PORT}`);
  });
}

process.on('SIGTERM', () => {
  httpServer.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  httpServer.close(() => process.exit(0));
});

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
