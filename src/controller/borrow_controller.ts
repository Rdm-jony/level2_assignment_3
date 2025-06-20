import express, { Request, Response } from "express"
import { Book } from "../model/book_model"
import { Borrow } from "../model/borrow_model"

export const borrowRoutes = express.Router()

borrowRoutes.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const { book, quantity, dueDate } = req.body
        const findBook = await Book.findById(book)
        if (!findBook) {
            return res.status(404).json({ success: false, message: "Book not found" })
        }

        if (!findBook.available || findBook.copies == 0) {
            return res.status(409).json({ success: false, message: "Book is not available" })

        }

        if (findBook.copies < quantity) {
            return res.status(409).json({ success: false, message: `Available copies ${findBook.copies}` })
        }


        const data = new Borrow({ book, quantity, dueDate })

        await data.save()

        findBook.copies -= data.quantity
        if (findBook.copies == 0) {
            await data.updateAvailableBook(findBook._id)

        }
        await findBook.save()
        res.status(201).json({ success: true, message: `Book borrowed successfully`, data })


    } catch (error: any) {
        console.log(error)
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

borrowRoutes.get("/", async (req: Request, res: Response) => {
    try {
        const data = await Borrow.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $group: {
                    _id: {
                        title: "$book.title",
                        isbn: "$book.isbn"
                    }, totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$_id.title",
                        isbn: "$_id.isbn"
                    },
                    totalQuantity: 1
                }
            }


        ])

        res.json({ success: true, message: "Borrowed books summary retrieved successfully", data })
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