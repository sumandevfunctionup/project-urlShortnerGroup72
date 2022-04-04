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
if (!(/(:?^((https|http|HTTP|HTTPS){1}:\/\/)(([w]{3})[\.]{1})?([a-zA-Z0-9]{1,}[\.])[\w]*((\/){1}([\w@?^=%&amp;~+#-_.]+))*)$/.test(longUrl))) {
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
        const url=await urlModel.findOne({urlCode:urlCode})
       console.log(url.longUrl)
        if(url){
            return res.status(302).send({status:true,link:url.longUrl})
        }
        else{
            return res.status(404).send({status:false, message:"No such URL FOUND"})
        }  
       }catch(err){
           return res.status(500).send({status:true,message:err.message})
       }
}
  module.exports.getUrl=getUrl