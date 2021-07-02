var test = require('../controler/test')

var express = require('express');
var router = express.Router();


// /* GET home page. */
// router.get('/',test.myfn);
router.get('/',test.myfn);

/* GET home page. */
router.post('/api/articles',async(req,res)=>{
    const article = await Article.create(req.body)
    res.send(article)
})

// router.get('/',function(req, res, next) {
//   test.myfn
//   res.render('index', { title: 'Express' });
// });
module.exports = router;
