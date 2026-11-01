const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static('./'));

let list = [
    {id:1,code:"1001",no:"A01",tip:"待叫号，预计等待大于30分钟",takeTime:"11:20",phone:"138****1234",status:1,enabled:true}
];

// 登录
app.post('/api/admin/login', (req,res)=>{
    const {pwd} = req.body;
    if(pwd === 'dev7777'){
        return res.json({ok:true});
    }
    return res.json({ok:false});
});
// 获取列表
app.get('/api/list', (req,res)=>{
    res.json(list);
});
// 保存
app.post('/api/save', (req,res)=>{
    const {id,code,no,tip,takeTime,phone,status} = req.body;
    if(id){
        const item = list.find(x=>x.id == id);
        if(item){
            item.code = code;
            item.no = no;
            item.tip = tip;
            item.takeTime = takeTime;
            item.phone = phone;
            item.status = status;
            return res.json({ok:true});
        }
    }else{
        const newId = list.length > 0 ? Math.max(...list.map(i=>i.id)) + 1 : 1;
        list.push({id:newId,code,no,tip,takeTime,phone,status,enabled:true});
        return res.json({ok:true});
    }
    return res.json({ok:false,msg:"找不到数据"});
});
// 启用禁用
app.post('/api/toggle', (req,res)=>{
    const {id} = req.body;
    const item = list.find(x=>x.id == id);
    if(item){
        item.enabled = !item.enabled;
        return res.json({ok:true});
    }
    return res.json({ok:false});
});
// 删除
app.post('/api/del', (req,res)=>{
    const {id} = req.body;
    list = list.filter(x=>x.id != id);
    return res.json({ok:true});
});

app.listen(port,()=>{
    console.log(`服务启动：http://127.0.0.1:${port}`);
})
