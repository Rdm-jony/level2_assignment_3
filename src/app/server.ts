import mongoose from "mongoose";
import app from "./app";
let port=5000
main().catch(err => console.log(err));
async function main() {
 await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tbsccmb.mongodb.net/library_management_express?retryWrites=true&w=majority&appName=Cluster0`);  console.log("mongodb connect✅")
  app.listen(port,()=>{
    console.log("aggregate server running on",port)
  })

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}