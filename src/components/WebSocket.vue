<script> 
const ws = new WebSocket('ws://localhost:8080');

ws.onopen = () => {
  console.log('✅ 已连接');
  ws.send('Hello server');

  // 模拟心跳回应（每 30 秒回复）
  setInterval(() => {
    ws.send('client still alive');
  }, 30000);
};

ws.onmessage = (e) => console.log('📨 收到消息：', e.data);

ws.onclose = () => console.warn('❌ 连接关闭');

ws.onerror = (e) => console.error('⚠️ 错误：', e);





</script>

<template>
<div> 测试webscoket</div>
    </template>