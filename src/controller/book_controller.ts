import express, { json, Request, Response } from "express"
import { Book } from "../model/book_model"

export const bookRoutes = express.Router()

bookRoutes.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body
        const data = await Book.create(body)
        res.status(201).json({ success: true, message: "Book created successfully", data })
    } catch (error: any) {
        console.log(error);
        const isDuplicateKey = error.code === 11000 || error?.cause?.code === 11000;;
        res.status(isDuplicateKey ? 409 : 500).json({
            success: false,
            message: error.name || "InternalServerError",
            error: {
                name: error.name || "Error",
                errors: isDuplicateKey ? error.errorResponse ?? error.cause.errorResponse :
                    error.errors || "Something went wrong"

            }
        });
    }

})

bookRoutes.get("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const filter = req.query.filter as string
        const sortBy = req.query.sortBy as string
        const sort = req.query.sort as string
        const limit = req.query.limit as string
        const sortField = sort == "asc" ? 1 : -1
        const data = await Book.find(filter ? { genre: filter } : {}).sort({ [sortBy]: sortField }).limit(Number(limit ?? 10))
        res.status(200).json({ success: true, message: "Books retrieved successfully", data })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false, message: error.name, error: {
                name: error.name,
                errors: error.errors
            }
        })
    }
})

bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId
        const data = await Book.findById(bookId)
        res.status(200).json({ success: true, message: "Books retrieved successfully", data })

    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false, message: error.name, error: {
                name: error.name,
                errors: error.errors
            }
        })
    }
})

bookRoutes.put("/:bookId", async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId
        const body = req.body
        const updateDoc = {
            $set: body
        }
        const data = await Book.findByIdAndUpdate(bookId, updateDoc, { new: true })
        res.status(200).json({ success: true, message: "Book updated successfully", data })
    } catch (error: any) {
        console.log(error);
        const isDuplicateKey = error.code === 11000 || error?.cause?.code === 11000;;
        res.status(isDuplicateKey ? 409 : 500).json({
            success: false,
            message: error.name || "InternalServerError",
            error: {
                name: error.name || "Error",
                errors: isDuplicateKey ? error.errorResponse ?? error.cause.errorResponse :
                    error.errors || "Something went wrong"

            }
        });
    }
})

bookRoutes.delete("/:bookId", async (req: Request, res: Response): Promise<any> => {
    try {
        const bookId = req.params.bookId
        const data = await Book.deleteOne({ _id: bookId })
        if (data.deletedCount) {
            return res.status(200).json({ success: true, message: "Book deleted successfully", data: null })
        }
        res.status(200).json({ success: false, message: "Book not found" })

    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false, message: error.name, error: {
                name: error.name,
                errors: error.errors
            }
        })
    }
})