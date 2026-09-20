const STORAGE_KEY = 'wms-warehouse-system-v1';

const defaultState = {
  orderData: [
    { orderId: 'ORD-20983', customer: '张先生', area: '北美仓', status: '拣货中', amount: 1236 },
    { orderId: 'ORD-20984', customer: '李女士', area: '欧洲仓', status: '缺货', amount: 860 },
    { orderId: 'ORD-20985', customer: '王先生', area: '东南亚仓', status: '待发货', amount: 640 },
    { orderId: 'ORD-20986', customer: '陈老师', area: '国内仓', status: '复核完成', amount: 1520 },
    { orderId: 'ORD-20987', customer: '赵女士', area: '北美仓', status: '包装中', amount: 980 },
    { orderId: 'ORD-20988', customer: '周经理', area: '欧洲仓', status: '已出库', amount: 1320 },
    { orderId: 'ORD-20989', customer: '吴博士', area: '国内仓', status: '待拣货', amount: 710 }
  ],
  inventoryData: [
    { sku: 'SKU-1001', name: '热卖纸箱A', location: 'A-01-03', available: 120, locked: 18, status: '正常' },
    { sku: 'SKU-1012', name: '不锈钢托盘', location: 'B-02-11', available: 48, locked: 8, status: '低库存' },
    { sku: 'SKU-1048', name: '包装气泡膜', location: 'C-04-07', available: 220, locked: 35, status: '正常' },
    { sku: 'SKU-2009', name: '一次性防护服', location: 'A-03-01', available: 26, locked: 10, status: '低库存' },
    { sku: 'SKU-2980', name: '快递标签纸', location: 'D-01-02', available: 410, locked: 40, status: '正常' },
    { sku: 'SKU-3108', name: '分拣箱', location: 'B-05-03', available: 90, locked: 15, status: '正常' }
  ],
  pickingData: [
    { taskId: 'PICK-1001', orderId: 'ORD-20983', picker: '张三', location: 'A-01-03', qty: 12, status: '拣货中' },
    { taskId: 'PICK-1002', orderId: 'ORD-20987', picker: '李四', location: 'B-02-11', qty: 8, status: '待拣货' },
    { taskId: 'PICK-1003', orderId: 'ORD-20984', picker: '王五', location: 'C-04-07', qty: 5, status: '异常' },
    { taskId: 'PICK-1004', orderId: 'ORD-20985', picker: '赵六', location: 'D-01-02', qty: 15, status: '已完成' }
  ],
  dispatchData: [
    { outboundId: 'OUT-2011', orderId: 'ORD-20986', carrier: '顺丰', tracking: 'SF123456789', status: '已发货' },
    { outboundId: 'OUT-2012', orderId: 'ORD-20985', carrier: 'DHL', tracking: 'DHL778812', status: '运输中' },
    { outboundId: 'OUT-2013', orderId: 'ORD-20983', carrier: '中通', tracking: 'ZT991204', status: '待派送' },
    { outboundId: 'OUT-2014', orderId: 'ORD-20987', carrier: 'EMS', tracking: 'EMS100873', status: '已出库' }
  ],
  replenishmentRecords: [
    { id: 'RPL-1001', sku: 'SKU-1012', qty: 30, priority: '高', reason: 'A区热销SKU预警', status: '待审核', createdAt: '2026-09-19 08:20' },
    { id: 'RPL-1002', sku: 'SKU-2009', qty: 40, priority: '中', reason: '低库存补货', status: '已批准', createdAt: '2026-09-19 09:46' }
  ]
};

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
  '待审核': 'warn',
  '已批准': 'ok',
  '已执行': 'ok'
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return deepClone(defaultState);

    const parsed = JSON.parse(saved);
    return {
      ...deepClone(defaultState),
      ...parsed,
      orderData: Array.isArray(parsed.orderData) ? parsed.orderData : deepClone(defaultState.orderData),
      inventoryData: Array.isArray(parsed.inventoryData) ? parsed.inventoryData : deepClone(defaultState.inventoryData),
      pickingData: Array.isArray(parsed.pickingData) ? parsed.pickingData : deepClone(defaultState.pickingData),
      dispatchData: Array.isArray(parsed.dispatchData) ? parsed.dispatchData : deepClone(defaultState.dispatchData),
      replenishmentRecords: Array.isArray(parsed.replenishmentRecords) ? parsed.replenishmentRecords : deepClone(defaultState.replenishmentRecords)
    };
  } catch (error) {
    return deepClone(defaultState);
  }
}

const appState = loadState();
const { orderData, inventoryData, pickingData, dispatchData, replenishmentRecords } = appState;

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

function getStatusClass(status) {
  return statusClassMap[status] || 'ok';
}

function renderOrders() {
  const tbody = document.getElementById('orderTableBody');
  if (!tbody) return;

  tbody.innerHTML = orderData.map(order => `
    <tr>
      <td>${order.orderId}</td>
      <td>${order.customer}</td>
      <td>${order.area}</td>
      <td><span class="status ${getStatusClass(order.status)}">${order.status}</span></td>
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
  if (!tbody) return;

  tbody.innerHTML = inventoryData.map(item => `
    <tr>
      <td>${item.sku}</td>
      <td>${item.name}</td>
      <td>${item.location}</td>
      <td>${item.available}</td>
      <td>${item.locked}</td>
      <td><span class="status ${getStatusClass(item.status)}">${item.status}</span></td>
    </tr>
  `).join('');
}

function renderPicking() {
  const tbody = document.getElementById('pickingTableBody');
  if (!tbody) return;

  tbody.innerHTML = pickingData.map(task => `
    <tr>
      <td>${task.taskId}</td>
      <td>${task.orderId}</td>
      <td>${task.picker}</td>
      <td>${task.location}</td>
      <td>${task.qty}</td>
      <td><span class="status ${getStatusClass(task.status)}">${task.status}</span></td>
    </tr>
  `).join('');
}

function renderDispatch() {
  const tbody = document.getElementById('dispatchTableBody');
  if (!tbody) return;

  tbody.innerHTML = dispatchData.map(item => `
    <tr>
      <td>${item.outboundId}</td>
      <td>${item.orderId}</td>
      <td>${item.carrier}</td>
      <td>${item.tracking}</td>
      <td><span class="status ${getStatusClass(item.status)}">${item.status}</span></td>
    </tr>
  `).join('');
}

function renderReplenishment() {
  const tbody = document.getElementById('replenishmentTableBody');
  if (!tbody) return;

  tbody.innerHTML = replenishmentRecords.length
    ? replenishmentRecords.map(record => `
      <tr>
        <td>${record.id}</td>
        <td>${record.sku}</td>
        <td>${record.qty}</td>
        <td>${record.priority}</td>
        <td><span class="status ${getStatusClass(record.status)}">${record.status}</span></td>
        <td>${record.createdAt}</td>
      </tr>
    `).join('')
    : `<tr><td colspan="6" class="empty-state">暂无补货申请记录</td></tr>`;
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timeoutId);
  showToast.timeoutId = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function openModal(title, bodyHtml, confirmLabel, onConfirm) {
  const modal = document.getElementById('actionModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalConfirm = document.getElementById('modalConfirm');

  modalTitle.textContent = title;
  modalBody.innerHTML = bodyHtml;
  modalConfirm.textContent = confirmLabel;
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');

  const closeHandlers = document.querySelectorAll('[data-close="modal"]');
  closeHandlers.forEach(el => {
    el.onclick = () => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    };
  });

  modalConfirm.onclick = () => {
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (typeof onConfirm === 'function') onConfirm();
  };
}

function switchPage(targetId) {
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
  const targetPage = document.getElementById(targetId);
  if (targetPage) targetPage.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
}

function generateTrackingNo() {
  return `WAY${Date.now().toString().slice(-8)}`;
}

function applyReplenishment() {
  const bodyHtml = `
    <form class="modal-form">
      <div class="field-row">
        <label for="replenishSku">SKU</label>
        <select id="replenishSku">
          ${inventoryData.map(item => `<option value="${item.sku}">${item.sku} - ${item.name}</option>`).join('')}
        </select>
      </div>
      <div class="field-row">
        <label for="replenishQty">补货数量</label>
        <input id="replenishQty" type="number" min="10" value="30" />
      </div>
      <div class="field-row">
        <label for="replenishPriority">优先级</label>
        <select id="replenishPriority">
          <option value="高">高</option>
          <option value="中" selected>中</option>
          <option value="低">低</option>
        </select>
      </div>
      <div class="field-row">
        <label for="replenishReason">补货原因</label>
        <input id="replenishReason" type="text" value="库存低于安全水位" />
      </div>
    </form>
  `;

  openModal('补货申请', bodyHtml, '提交申请', () => {
    const sku = document.getElementById('replenishSku').value;
    const qty = Number(document.getElementById('replenishQty').value);
    const priority = document.getElementById('replenishPriority').value;
    const reason = document.getElementById('replenishReason').value || '库存低于安全水位';

    if (!sku || !qty || qty <= 0) {
      showToast('请输入合法补货数量');
      return;
    }

    const item = inventoryData.find(entry => entry.sku === sku);
    if (!item) {
      showToast('未找到对应 SKU');
      return;
    }

    item.available += qty;
    item.status = item.available >= 50 ? '正常' : '低库存';
    item.locked = Math.max(0, item.locked - 5);

    replenishmentRecords.unshift({
      id: `RPL-${Date.now().toString().slice(-6)}`,
      sku,
      qty,
      priority,
      reason,
      status: '待审核',
      createdAt: new Date().toLocaleString('zh-CN', { hour12: false })
    });

    saveState();
    renderInventory();
    renderReplenishment();
    showToast(`已提交补货申请：${sku} +${qty}`);
  });
}

function generateWaybill() {
  const activeDispatches = dispatchData.filter(item => item.status !== '已出库');
  if (!activeDispatches.length) {
    showToast('当前没有可生成面单的出库单');
    return;
  }

  const bodyHtml = `
    <form class="modal-form">
      <div class="field-row">
        <label for="waybillOutbound">出库单</label>
        <select id="waybillOutbound">
          ${activeDispatches.map(item => `<option value="${item.outboundId}">${item.outboundId} - ${item.orderId}</option>`).join('')}
        </select>
      </div>
      <div class="field-row">
        <label for="waybillCarrier">承运商</label>
        <select id="waybillCarrier">
          <option value="顺丰">顺丰</option>
          <option value="DHL">DHL</option>
          <option value="中通">中通</option>
          <option value="EMS">EMS</option>
          <option value="京东物流">京东物流</option>
        </select>
      </div>
      <div class="field-row">
        <label for="waybillReceiver">收件人</label>
        <input id="waybillReceiver" type="text" value="张先生" />
      </div>
    </form>
  `;

  openModal('生成面单', bodyHtml, '生成面单', () => {
    const outboundId = document.getElementById('waybillOutbound').value;
    const carrier = document.getElementById('waybillCarrier').value;
    const receiver = document.getElementById('waybillReceiver').value || '收件人';
    const record = dispatchData.find(item => item.outboundId === outboundId);

    if (!record) {
      showToast('未找到对应出库单');
      return;
    }

    record.carrier = carrier;
    record.tracking = generateTrackingNo();
    record.status = '待派送';

    const order = orderData.find(item => item.orderId === record.orderId);
    if (order) {
      order.status = '待发货';
    }

    const picking = pickingData.find(item => item.orderId === record.orderId);
    if (picking) {
      picking.status = '已完成';
    }

    saveState();
    renderDispatch();
    renderOrders();
    renderPicking();
    showToast(`已生成面单：${record.tracking}（${receiver}）`);
  });
}

function confirmOutbound() {
  const pending = dispatchData.filter(item => item.status !== '已出库');
  if (!pending.length) {
    showToast('当前没有可确认出库的单据');
    return;
  }

  const target = pending[0];
  const bodyHtml = `
    <div class="confirm-box">
      <p><strong>出库单：</strong> ${target.outboundId}</p>
      <p><strong>订单号：</strong> ${target.orderId}</p>
      <p><strong>承运商：</strong> ${target.carrier}</p>
      <p><strong>物流单号：</strong> ${target.tracking}</p>
      <p>确认后，订单状态将更新为“已出库”，并同步扣减对应库存。</p>
    </div>
  `;

  openModal('确认出库', bodyHtml, '确认出库', () => {
    target.status = '已出库';

    const order = orderData.find(item => item.orderId === target.orderId);
    if (order) {
      order.status = '已出库';
    }

    const picking = pickingData.find(item => item.orderId === target.orderId);
    if (picking) {
      picking.status = '已完成';
    }

    inventoryData.forEach(item => {
      if (['A-01-03', 'B-02-11', 'C-04-07', 'D-01-02', 'A-03-01'].includes(item.location)) {
        item.available = Math.max(0, item.available - 10);
        item.status = item.available < 50 ? '低库存' : '正常';
      }
    });

    saveState();
    renderDispatch();
    renderOrders();
    renderInventory();
    renderPicking();
    showToast(`已确认出库：${target.outboundId}`);
  });
}

function bindActions() {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchPage(btn.dataset.target));
  });

  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', (event) => {
      const action = event.currentTarget.dataset.action;
      if (action === 'apply-replenishment') submitReplenishment();
      if (action === 'generate-waybill') generateWaybill();
      if (action === 'confirm-outbound') confirmOutbound();
    });
  });
}

function submitReplenishment() {
  applyReplenishment();
}

function init() {
  bindActions();
  renderOrders();
  renderInventory();
  renderPicking();
  renderDispatch();
  renderReplenishment();
}

init();
