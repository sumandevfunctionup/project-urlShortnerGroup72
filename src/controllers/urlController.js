const urlModel= require("../models/urlModel")
const shortId= require("shortid")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
  }
  const baseUrl="http://localhost:3000"
const urlShort= async function (req,res){

try{
    const longUrl=req.body.longUrl
    //checking body is empty or not
    if(!isValid(longUrl)) return res.status(400).send({status:false,msg:"no data in body,please enter some data."})

//checking url in proper formet or not by regex
if (! /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm.test(longUrl.trim())) {
    return res.status(400).send({ status: false, message: "This is not a valid Url"})

}
//generate urlCode
const urlCode= shortId.generate(longUrl)
console.log(urlCode)
//checking urlCode is uniqe or not
const existCode=await urlModel.findOne({longUrl})
if(existCode) return res.status(400).send({status:false,msg:"url code is already exist"})

//create a database 
const data= {
    urlCode:urlCode,
    shortUrl:baseUrl+"/"+urlCode,
    longUrl:longUrl}


//create short url
 const createShortUrl=  await urlModel.create(data)
 return res.status(201).send({status:true,msg:"doc created succesfully",data:data})



}
catch(error)
{
    console.log("error",error.message)
    res.status(500).send({status:false,msg:error.message})

}
}
module.exports.urlShort = urlShort


// const getUrl = async (req, res) => {

//     try {
//       const urlCode = req.params.urlCode;
//       const urlDocument = await urlModel.findOne({ urlCode: urlCode })
//       if (!urlDocument) {
//         res.status(404).send({ status: true, msg: "url Document not Found" })
//       }
//       const longUrl = urlDocument.longUrl
//       return res.redirect(longUrl)
  
//     } catch (error) {
//       return res.status(500).send({ status: false, message: error.message })
//     }
  
//   }
const getUrl = async function(req,res){
    try{
        const urlCode=req.params.urlCode
        if(!isValid(urlCode))return res.status(400).send({status:false,msg:"please enter urlCode."})
        
        const url=await urlModel.findOne({urlCode:urlCode})
       console.log(url)
       if(!url)return res.status(400).send({status:false,msg:"invalid urlCode,please enter a valid one."})
        if(url){
            const newVar=url.longUrl
            return res.status(302).redirect(newVar)
        }
       
          
       }catch(err){
           return res.status(500).send({status:true,message:err.message})
       }
}
  module.exports.getUrl=getUrl