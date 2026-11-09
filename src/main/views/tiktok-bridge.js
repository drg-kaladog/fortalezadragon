// Puente TikTok Live -> Guerra de Fortalezas
// Uso:  npm i tiktok-live-connector@1 ws   ·   node tiktok-bridge.js   (por defecto usa @fcsurquito)
// Luego, en el panel del juego (TikTok Live) pulsa "Conectar" (ws://localhost:8765).
const { WebcastPushConnection } = require('tiktok-live-connector');
const { WebSocketServer } = require('ws');
const user = process.argv[2] || '@fcsurquito';
const wss = new WebSocketServer({ port: 8765 });
const send = (o) => wss.clients.forEach((c) => c.readyState === 1 && c.send(JSON.stringify(o)));
const tt = new WebcastPushConnection(user.replace('@', ''));
tt.connect().then(() => console.log('Conectado al Live de', user)).catch((e) => console.error('No se pudo conectar:', e));
tt.on('chat', (d) => send({ type: 'chat', user: d.nickname || d.uniqueId, text: d.comment }));
tt.on('gift', (d) => {
  // Los regalos en racha (giftType 1) se cuentan solo al terminar la racha
  if (d.giftType === 1 && !d.repeatEnd) return;
  send({ type: 'gift', user: d.nickname || d.uniqueId, gift: d.giftName, count: d.repeatCount || 1 });
});
console.log('Puente escuchando en ws://localhost:8765');
