const bodyParser = require("body-parser")
const express=require("express")
const app=express()
const path=require("path")
const bp=require("body-parser")
const hbs=require("express-handlebars")
const mongodb=require("mongodb");
const ObjectId=mongodb.ObjectId

const data=require("./mongodb")

app.engine("hbs",hbs.engine({layoutsDir:"views/",defaultLayout:"main",extname:"hbs"}))
app.set("view engine","hbs")
app.set("views","views")
app.use(bp.urlencoded())


app.get("/",async (req,res)=>{
     
    let databse=await data.getdatabase();
    let collection=databse.collection("list")
    let cursor=collection.find({})
    let details=await cursor.toArray();

    let msg=""

    let edit_id,edit_book;

    if(req.query.edit_id){
        
        edit_id=req.query.edit_id;
        edit_book=await collection.findOne(new ObjectId(edit_id))
    }

    if(req.query.delete_id){

      await collection.deleteOne({_id:new ObjectId(req.query.delete_id)})
      return res.redirect("/?status=3")
    }

     
    switch (req.query.status) {
        case "1":
            
            msg="instated Sucessfull"
            break;
    
            case "2":
            
            msg="Update Sucessfull"
            break;

            case "3":
            
            msg="Delete Sucessfull"
            break;



        default:
            break;
    }
    
    res.render("main",{msg,details,edit_book,edit_id})


})

app.post("/submit",async (req,res)=>{

   let database=await data.getdatabase();
   let collection=database.collection("list");
   let list={Name:req.body.Name,Age:req.body.Age,Email:req.body.Email}
   await collection.insertOne(list);

   return res.redirect("/?status=1")


})

app.post("/update/:edit_id",async (req,res)=>{

    let database=await data.getdatabase();
    let collection=database.collection("list");
    let list={Name:req.body.Name,Age:req.body.Age,Email:req.body.Email}
    let edit_id=req.params.edit_id;
    await collection.updateOne({_id:new ObjectId(edit_id)},{$set:list});
 
    return res.redirect("/?status=2")
 
 
 })


app.listen(3000,()=>{console.log("Server is Running");})