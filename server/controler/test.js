import {FocusSchema,Article} from '../model/createuser'

let myfn = (req, res) => {
    console.log(req.query)
    //添加
    let name = '周二飞'
    const focus = new FocusSchema({
        username:name,
        password: '123',
        age: 22,
        tel: '13248099856',
        sex: '女',
        city: '山西'
    })
    focus.save((err) => {
        if (err) throw err;
        console.log(name+'用户插入成功')
    })

    res.json(`
        {
            id:123123,
            name:zhouyifei
        }
    `)
    console.log('返回值为')
}




module.exports = {
    myfn
}