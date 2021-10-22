// let img = 'http://wx1.sinaimg.cn/bmiddle/006Mi9iRgy1guvl9zthjkj60ig0igq3h02.jpg';
/**
* TODO
*  批量下载图片到本地文件夹，再由本地文件夹通过第三方上传微信服务器
* 
**/

var fs = require('fs')
const stream = require('stream');
const path = require('path')
const axios = require('axios').default;
const cheerio = require('cheerio');

var img_src = 'http://wx1.sinaimg.cn/bmiddle/006Mi9iRgy1guvl9zthjkj60ig0igq3h02.jpg';


var img_filename = 'mu1.jpg';


const host = 'http://www.biaoqing001.com/'

axios({
    url: host,
    method: 'get',
}).then(response => {
    var $ = cheerio.load(response.data, { decodeEntities: false });
    var $bqlListDom = $('.bqb-list')
    let imgStateList = []
    $bqlListDom.each((i, ele) => {
        // console.log(t,'t')
        var title = $(ele).find('.panel-heading').eq(0).text()
        var $li = $(ele).find('.home-article-wrap li');
        $li.each((idx, element) => {
            imgStateList.push($(element).find('img').attr('src'))
        })
        downLoadImgToLocal(imgStateList, title)
        console.log(title, 'title')
        console.log(imgStateList, 'imgStateList')
        console.log(i, 'i')

    })
})


function downLoadImgToLocal(imgUrlList = [], dirName) {
    const rootDirName = 'dist'
    if (fs.existsSync(rootDirName)) {
        fs.rmSync(rootDirName, { recursive: true, force: true });
        // fs.mkdirSync(rootDirName)
    } else {
        // fs.mkdirSync(rootDirName)
    }
    fs.mkdirSync(rootDirName + '/' + dirName, { recursive: true });

    imgUrlList.forEach(imgUrl => {
        fetchAndSaveImgToLocal(imgUrl, rootDirName + '/' + dirName)
    })

}

function fetchAndSaveImgToLocal(imgUrl='', dirName) {
    axios({
        method: 'get',
        url: imgUrl,
        responseType: 'stream'
    }).then(response => {
        // console.log(response, 'response')
        const fileName = imgUrl.slice(-25).replace('/','').replace(':','')
        // response.data.pipe(fs.createWriteStream(fileName))
        // console.log(response.data,'responsedata')
        response.data.pipe(fs.createWriteStream(dirName+  "/" + fileName))
        // console.log(res,'res')
        // let data = res.data;
        // fs.writeFileSync(__dirname+ '/' + img_filename,data,{
        //     encoding:'utf-8'
        // })
        // fs.writeFileSync(__dirname+ '/text.txt' ,data,{
        //     encoding:'utf-8'
        // })

        // fs.createWriteStream()
    })
}

// axios({
//     method: 'get',
//     url: img_src,
//     responseType: 'stream'
// }).then(response => {
//     console.log(response,'response')

//     // console.log(response.data,'responsedata')
//     response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
//     // console.log(res,'res')
//     // let data = res.data;
//     // fs.writeFileSync(__dirname+ '/' + img_filename,data,{
//     //     encoding:'utf-8'
//     // })
//     // fs.writeFileSync(__dirname+ '/text.txt' ,data,{
//     //     encoding:'utf-8'
//     // })

//     // fs.createWriteStream()
// })

// axios.get(img_src).pipe(fs.createWriteStream('./'+ img_filename));     //通过流的方式，把图片写到本地/image目录下，并用新闻的标题和图片的标题作为图片的名称。
// const lib =  fs.createReadStream(__dirname+ '/' + img_filename);
// // console.log(lib,'lib')

// fs.createWriteStream('./test.file')
