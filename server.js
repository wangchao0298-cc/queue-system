const express = require('express')
const cors = require('cors')
const path = require('path')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())
// 静态资源 public图片
app.use(express.static(path.join(__dirname, 'public')))
// 托管html页面
app.use(express.static(__dirname))

// ⚠️ 内存数组：服务重启/重新发布，数据全部清空（重点！）
let queueList = [
  { id:1, code:2, tableNo:"双人位B202", tip:"", time:"12:30", phone:"138****1111", status:1 },
  { id:2, code:3, tableNo:"四人位A05", tip:"", time:"12:35", phone:"138****2222", status:1 }
]

// 获取列表
app.get('/api/queue', (req, res)=>{
  res.json({code:200, data:queueList})
})

// 新增
app.post('/api/queue/add', (req, res)=>{
  const item = req.body
  item.id = Date.now()
  queueList.push(item)
  res.json({code:200, msg:"新增成功", data:item})
})

// 编辑
app.post('/api/queue/edit', (req, res)=>{
  const {id, code, tableNo, tip, time, phone, status} = req.body
  const idx = queueList.findIndex(x=>x.id == id)
  if(idx === -1) return res.json({code:400, msg:"找不到这条记录"})
  queueList[idx] = {id, code, tableNo, tip, time, phone, status}
  res.json({code:200, msg:"编辑保存成功"})
})

// 设置失效
app.post('/api/queue/invalid', (req, res)=>{
  const {id} = req.body
  const idx = queueList.findIndex(x=>x.id == id)
  if(idx === -1) return res.json({code:400, msg:"找不到记录"})
  queueList[idx].status = 0
  res.json({code:200, msg:"已设为失效"})
})

// 删除
app.post('/api/queue/del', (req, res)=>{
  const {id} = req.body
  queueList = queueList.filter(x=>x.id != id)
  res.json({code:200, msg:"删除成功"})
})

app.listen(port, ()=>{
  console.log(`服务启动，端口${port}`)
})
