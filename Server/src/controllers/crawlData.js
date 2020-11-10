const rp = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
 
const URL = `https://www.24h.com.vn`;
 
const options = {
  uri: URL,
  transform: function (body) {
    //Khi lấy dữ liệu từ trang thành công nó sẽ tự động parse DOM
    return cheerio.load(body);
  },
};
 
let crawler =async (req,res)=> {
  try {
    // Lấy dữ liệu từ trang crawl đã được parseDOM
    var $ = await rp(options);
  } catch (error) {
    return error;
  }
   let article=$("main > section");
   let listArticle=[];
   for(let i=0;i<article.length;i++){
        let dataToPush={};
        let item=$(article[i]);
        let url=item.find("article > header > a").attr('href');
        dataToPush.url=url;
        let title=item.find("article > header > a").text();
        dataToPush.title=title;
        
        let urlImg=item.find("article > span.imgFlt > a > img").data('original');
        dataToPush.urlImg=urlImg;
        let descrip=item.find('article > span.nwsSpSpc').text();
        dataToPush.des=descrip;
        if(url && title && urlImg && descrip  ){
          listArticle.push(dataToPush);
        }
       
   }
   return res.send({
     listArticle:listArticle
   })
   
 
}
export default crawler;