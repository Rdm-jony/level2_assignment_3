import express from "express"
import dotenv from "dotenv"
import { bookRoutes } from "../controller/book_controller"
import { borrowRoutes } from "../controller/borrow_controller"

dotenv.config()
const app=express()
app.use(express.json())

app.use("/api/books",bookRoutes)
app.use("/api/borrow",borrowRoutes)

export default app;