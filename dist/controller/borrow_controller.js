"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../model/book_model");
const borrow_model_1 = require("../model/borrow_model");
exports.borrowRoutes = express_1.default.Router();
exports.borrowRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { book, quantity, dueDate } = req.body;
        const findBook = yield book_model_1.Book.findById(book);
        if (!findBook) {
            return res.status(404).json({ success: false, message: "Book not found" });
        }
        if (!findBook.available || findBook.copies == 0) {
            return res.status(409).json({ success: false, message: "Book is not available" });
        }
        if (findBook.copies < quantity) {
            return res.status(409).json({ success: false, message: `Available copies ${findBook.copies}` });
        }
        const data = new borrow_model_1.Borrow({ book, quantity, dueDate });
        yield data.save();
        findBook.copies -= data.quantity;
        if (findBook.copies == 0) {
            yield data.updateAvailableBook(findBook._id);
        }
        yield findBook.save();
        res.status(201).json({ success: true, message: `Book borrowed successfully`, data });
    }
    catch (error) {
        console.log(error);
        const isDuplicateKey = error.code === 11000 || ((_a = error === null || error === void 0 ? void 0 : error.cause) === null || _a === void 0 ? void 0 : _a.code) === 11000;
        ;
        res.status(isDuplicateKey ? 409 : 500).json({
            success: false,
            message: error.name || "InternalServerError",
            error: {
                name: error.name || "Error",
                errors: isDuplicateKey ? (_b = error.errorResponse) !== null && _b !== void 0 ? _b : error.cause.errorResponse :
                    error.errors || "Something went wrong"
            }
        });
    }
}));
exports.borrowRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield borrow_model_1.Borrow.aggregate([
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
        ]);
        res.json({ success: true, message: "Borrowed books summary retrieved successfully", data });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false, message: error.name, error: {
                name: error.name,
                errors: error.errors
            }
        });
    }
}));
