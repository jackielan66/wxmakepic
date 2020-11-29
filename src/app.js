const request = require('request');
const cheerio = require('cheerio')
var path = require("path");
var express = require('express');
var app = express();

let url = 
`https://mp.weixin.qq.com/s?__biz=MzU1NzAyMTcwMg==&mid=2247527645&idx=1&sn=2c3cbede882c8cf6d72493190dc3658e&chksm=fc3e03b4cb498aa2db025fdc944cb95e3198918c15f017a9cb285a78e201f1b9efb1cafe47c5`

app.engine('html', require('express-art-template'));
app.set('view options', {
    debug: process.env.NODE_ENV !== 'production',
});
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'art');


// 
let isTrimArray = true; // 数组是否去头尾 

let index = -1;

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
            if(index > -1){
                returnArr = [returnArr[index]]
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


