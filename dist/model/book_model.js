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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const borrow_model_1 = require("./borrow_model");
const bookShema = new mongoose_1.Schema({
    title: { type: String, required: [true, "Book title is required"], trim: true },
    author: { type: String, required: [true, "author is required"], trim: true },
    genre: { type: String, enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"], required: true, default: "FICTION" },
    isbn: { type: String, unique: [true, "isbn must be unique"], required: [true, "isbn is required"] },
    description: { type: String },
    copies: { type: Number, required: [true, "Book copies is required"], min: [0, "copies must be a non negative number"] },
    available: { type: Boolean, default: true }
}, {
    versionKey: false,
    timestamps: true
});
bookShema.pre("deleteOne", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield borrow_model_1.Borrow.deleteMany({
            book: this.getFilter()._id
        });
        next();
    });
});
exports.Book = (0, mongoose_1.model)("Book", bookShema);
