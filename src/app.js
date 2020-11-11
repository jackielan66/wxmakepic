const request = require('request');
const cheerio = require('cheerio')
var path = require("path");
var express = require('express');
var app = express();

let url = 
`https://mp.weixin.qq.com/s?__biz=MzIyMzcwMzU4Ng==&mid=2247507837&idx=5&sn=42c8b3a3ea0718587359f26da1180b18&chksm=e818b830df6f312679e30527ad7760e651bae09bec9c95e0b88c6d8d043dd0296a0f3325990c`

app.engine('html', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
});
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'art');


// 
let isTrimArray = false; // 数组是否去头尾 

app.use('/', (req, wrapres, next) => {
    let returnArr = [];
    
    request(url, async (err, res, body) => {
        if (!err && res.statusCode == 200) {
            $ = cheerio.load(body, { decodeEntities: false });
            // console.log($('#activity-name').text(),"$")
            let imagesList = $('#js_content').find('img');
            $(imagesList).each(function (index, item) {
                let src = $(item).data('src');
                returnArr.push(src)
            })
            if(isTrimArray){
                returnArr.shift();
                returnArr.pop()
            }
            // console.log(chunk(returnArr,3),"$")
            wrapres.render('template.html', {
                data:chunk(returnArr,3)
            });
    
        } else {
            console.log('采集错误  err:' + err)
        }
    
    })

    
})

app.listen(10000);

function chunk(arr=[],size=1){
    var result = [];
    var l = arr.length;
    var s = Math.ceil(l/size);
    for(var i=0;i<s;i++){
        result[i] = arr.slice(size*i,size*(i+1))
    }
    return result
}


