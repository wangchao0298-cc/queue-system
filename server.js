const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// waitNum剩余桌数，waitText预估文字，status就餐状态
let queueList = [
  { id: 1, code: '1', no: '双人位B101', waitNum:10, waitText:'预计大于20分钟', takeTime: '12:30', phone: '138****1111（线上取号）', enabled: true, status:1 },
  { id: 2, code: '2', no: '双人位B202', waitNum:257, waitText:'预计大于30分钟', takeTime: '13:02', phone: '151****8960（线上取号）', enabled: true, status:1 },
  { id: 3, code: '3', no: '四人位A05', waitNum:5, waitText:'预计10分钟', takeTime: '13:10', phone: '139****2222（线上取号）', enabled: true, status:1 }
];
const ADMIN_PASS = "dev7777777";

app.get('/api/query', (req, res) => {
  const code = req.query.code?.trim();
  const item = queueList.find(x => x.code === code && x.enabled === true);
  if (!item) {
    return res.json({ ok: false, msg: "验证码无效或已失效" });
  }
  res.json({ ok: true, data: item });
});

app.post('/api/admin/login', (req, res) => {
  const pwd = req.body.pwd;
  if (pwd === ADMIN_PASS) {
    return res.json({ ok: true });
  }
  res.json({ ok: false, msg: "密码错误" });
});

app.get('/api/list', (req, res) => {
  res.json(queueList);
});

app.post('/api/save', (req, res) => {
  const body = req.body;
  if (!body.code) return res.json({ ok: false, msg: "验证码不能为空" });
  if (body.id) {
    const idx = queueList.findIndex(x => x.id == body.id);
    if (idx === -1) return res.json({ ok: false, msg: "找不到这条记录" });
    queueList[idx] = { 
      ...queueList[idx], 
      code:body.code, 
      no:body.no, 
      waitNum: Number(body.waitNum),
      waitText: body.waitText,
      takeTime:body.takeTime, 
      phone:body.phone,
      status: Number(body.status)
    };
  } else {
    const newId = queueList.length ? Math.max(...queueList.map(i => i.id)) + 1 : 1;
    queueList.push({ 
      id: newId, 
      enabled: true, 
      code:body.code, 
      no:body.no, 
      waitNum: Number(body.waitNum),
      waitText: body.waitText,
      takeTime:body.takeTime, 
      phone:body.phone,
      status: Number(body.status)
    });
  }
  res.json({ ok: true });
});

app.post('/api/del', (req, res) => {
  const { id } = req.body;
  queueList = queueList.filter(x => x.id !== id);
  res.json({ ok: true });
});

app.post('/api/toggle', (req, res) => {
  const { id } = req.body;
  const item = queueList.find(x => x.id == id);
  if (!item) return res.json({ ok: false });
  item.enabled = !item.enabled;
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`服务启动，端口 ${port}`);
});
