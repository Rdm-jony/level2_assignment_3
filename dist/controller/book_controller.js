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
exports.bookRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../model/book_model");
exports.bookRoutes = express_1.default.Router();
exports.bookRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const body = req.body;
        const data = yield book_model_1.Book.create(body);
        res.status(201).json({ success: true, message: "Book created successfully", data });
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
exports.bookRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filter = req.query.filter;
        const sortBy = req.query.sortBy;
        const sort = req.query.sort;
        const limit = req.query.limit;
        const sortField = sort == "asc" ? 1 : -1;
        const data = yield book_model_1.Book.find(filter ? { genre: filter } : {}).sort({ [sortBy]: sortField }).limit(Number(limit !== null && limit !== void 0 ? limit : 4));
        res.status(200).json({ success: true, message: "Books retrieved successfully", data });
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
exports.bookRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const data = yield book_model_1.Book.findById(bookId);
        res.status(200).json({ success: true, message: "Books retrieved successfully", data });
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
exports.bookRoutes.patch("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const bookId = req.params.bookId;
        const body = req.body;
        const updateDoc = {
            $set: body
        };
        const data = yield book_model_1.Book.findByIdAndUpdate(bookId, updateDoc, { new: true });
        res.status(200).json({ success: true, message: "Book updated successfully", data });
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
exports.bookRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookId = req.params.bookId;
        const data = yield book_model_1.Book.deleteOne({ _id: bookId });
        if (data.deletedCount) {
            return res.status(200).json({ success: true, message: "Book deleted successfully", data: null });
        }
        res.status(200).json({ success: false, message: "Book not found" });
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
