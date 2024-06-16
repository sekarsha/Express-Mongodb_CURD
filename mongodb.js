const mongodb=require("mongodb");
const MongoClient=mongodb.MongoClient;

let database;

async function getdatabase (){

    const client=await MongoClient.connect("mongodb://localhost:27017/")
    database =client.db("Todo");

    if(!database){
     
        console.log("Database Not Connected");
    }

    return database;
}


module.exports={
    getdatabase
}