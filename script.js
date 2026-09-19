const orderData = [
  { orderId: 'ORD-20983', customer: '张先生', area: '北美仓', status: '拣货中', amount: 1236 },
  { orderId: 'ORD-20984', customer: '李女士', area: '欧洲仓', status: '缺货', amount: 860 },
  { orderId: 'ORD-20985', customer: '王先生', area: '东南亚仓', status: '待发货', amount: 640 },
  { orderId: 'ORD-20986', customer: '陈老师', area: '国内仓', status: '复核完成', amount: 1520 },
  { orderId: 'ORD-20987', customer: '赵女士', area: '北美仓', status: '包装中', amount: 980 },
  { orderId: 'ORD-20988', customer: '周经理', area: '欧洲仓', status: '已出库', amount: 1320 },
  { orderId: 'ORD-20989', customer: '吴博士', area: '国内仓', status: '待拣货', amount: 710 }
];

const inventoryData = [
  { sku: 'SKU-1001', name: '热卖纸箱A', location: 'A-01-03', available: 120, locked: 18, status: '正常' },
  { sku: 'SKU-1012', name: '不锈钢托盘', location: 'B-02-11', available: 48, locked: 8, status: '低库存' },
  { sku: 'SKU-1048', name: '包装气泡膜', location: 'C-04-07', available: 220, locked: 35, status: '正常' },
  { sku: 'SKU-2009', name: '一次性防护服', location: 'A-03-01', available: 26, locked: 10, status: '低库存' },
  { sku: 'SKU-2980', name: '快递标签纸', location: 'D-01-02', available: 410, locked: 40, status: '正常' },
  { sku: 'SKU-3108', name: '分拣箱', location: 'B-05-03', available: 90, locked: 15, status: '正常' }
];

const pickingData = [
  { taskId: 'PICK-1001', orderId: 'ORD-20983', picker: '张三', location: 'A-01-03', qty: 12, status: '拣货中' },
  { taskId: 'PICK-1002', orderId: 'ORD-20987', picker: '李四', location: 'B-02-11', qty: 8, status: '待拣货' },
  { taskId: 'PICK-1003', orderId: 'ORD-20984', picker: '王五', location: 'C-04-07', qty: 5, status: '异常' },
  { taskId: 'PICK-1004', orderId: 'ORD-20985', picker: '赵六', location: 'D-01-02', qty: 15, status: '已完成' }
];

const dispatchData = [
  { outboundId: 'OUT-2011', orderId: 'ORD-20986', carrier: '顺丰', tracking: 'SF123456789', status: '已发货' },
  { outboundId: 'OUT-2012', orderId: 'ORD-20985', carrier: 'DHL', tracking: 'DHL778812', status: '运输中' },
  { outboundId: 'OUT-2013', orderId: 'ORD-20983', carrier: '中通', tracking: 'ZT991204', status: '待派送' },
  { outboundId: 'OUT-2014', orderId: 'ORD-20987', carrier: 'EMS', tracking: 'EMS100873', status: '已出库' }
];

const statusClassMap = {
  '拣货中': 'high',
  '缺货': 'warn',
  '待发货': 'warn',
  '复核完成': 'ok',
  '包装中': 'high',
  '已出库': 'ok',
  '待拣货': 'warn',
  '已完成': 'ok',
  '异常': 'high',
  '已发货': 'ok',
  '运输中': 'warn',
  '待派送': 'warn',
  '正常': 'ok',
  '低库存': 'warn',
};

function renderOrders() {
  const tbody = document.getElementById('orderTableBody');
  tbody.innerHTML = orderData.map(order => `
    <tr>
      <td>${order.orderId}</td>
      <td>${order.customer}</td>
      <td>${order.area}</td>
      <td><span class="status ${statusClassMap[order.status] || 'ok'}">${order.status}</span></td>
      <td>¥${order.amount.toLocaleString()}</td>
      <td>
        <button class="btn ghost small">详情</button>
        <button class="btn primary small">处理</button>
      </td>
    </tr>
  `).join('');
}

function renderInventory() {
  const tbody = document.getElementById('inventoryTableBody');
  tbody.innerHTML = inventoryData.map(item => `
    <tr>
      <td>${item.sku}</td>
      <td>${item.name}</td>
      <td>${item.location}</td>
      <td>${item.available}</td>
      <td>${item.locked}</td>
      <td><span class="status ${statusClassMap[item.status] || 'ok'}">${item.status}</span></td>
    </tr>
  `).join('');
}

function renderPicking() {
  const tbody = document.getElementById('pickingTableBody');
  tbody.innerHTML = pickingData.map(task => `
    <tr>
      <td>${task.taskId}</td>
      <td>${task.orderId}</td>
      <td>${task.picker}</td>
      <td>${task.location}</td>
      <td>${task.qty}</td>
      <td><span class="status ${statusClassMap[task.status] || 'ok'}">${task.status}</span></td>
    </tr>
  `).join('');
}

function renderDispatch() {
  const tbody = document.getElementById('dispatchTableBody');
  tbody.innerHTML = dispatchData.map(item => `
    <tr>
      <td>${item.outboundId}</td>
      <td>${item.orderId}</td>
      <td>${item.carrier}</td>
      <td>${item.tracking}</td>
      <td><span class="status ${statusClassMap[item.status] || 'ok'}">${item.status}</span></td>
    </tr>
  `).join('');
}

function switchPage(targetId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  document.getElementById(targetId).classList.add('active');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchPage(btn.dataset.target));
});

renderOrders();
renderInventory();
renderPicking();
renderDispatch();

