// 引入 ws 模块，WebSocket Server 实现
const WebSocket = require('ws');

// 创建 WebSocket 服务器，监听端口 8080
const wss = new WebSocket.Server({ port: 8080 }, () => {
  console.log('✅ WebSocket 服务已启动，监听端口 8080');
});

// 心跳间隔（毫秒）
const HEARTBEAT_INTERVAL = 30000; // 30 秒

// 检查客户端是否存活（服务端定时检查每个连接）
function heartbeat() {
  this.isAlive = true;
}

// 启动服务后，监听客户端连接
wss.on('connection', (ws, req) => {
  const ip = req.socket.remoteAddress;
  console.log(`📥 客户端连接：${ip}`);

  // 初始标记为存活
  ws.isAlive = true;

  // 客户端回应“心跳 pong”时，更新存活状态
  ws.on('pong', heartbeat);

  // 处理收到的消息
  ws.on('message', (message) => {
    console.log(`📨 来自客户端消息: ${message}`);

    // 示例：原样返回（回显机制）
    ws.send(`🪐 你发送的是：${message}`);
  });

  // 处理客户端断开
  ws.on('close', () => {
    console.log(`❌ 客户端断开连接：${ip}`);
  });

  // 处理异常
  ws.on('error', (err) => {
    console.error(`⚠️ 客户端异常：${err.message}`);
  });
});

// 每隔 HEARTBEAT_INTERVAL 执行一次检查所有连接的存活状态
const interval = setInterval(() => {
  wss.clients.forEach((ws) => {
    if (ws.isAlive === false) {
      console.warn('🚫 未收到心跳，关闭连接');
      return ws.terminate(); // 强制关闭连接
    }

    ws.isAlive = false; // 标记为未响应
    ws.ping(); // 发送 ping，等待客户端回应 pong
  });
}, HEARTBEAT_INTERVAL);

// 当服务器关闭时清除定时器
wss.on('close', () => {
  clearInterval(interval);
});
