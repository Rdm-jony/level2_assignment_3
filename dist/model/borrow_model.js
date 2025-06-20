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
exports.Borrow = void 0;
const mongoose_1 = require("mongoose");
const book_model_1 = require("./book_model");
const borrowShema = new mongoose_1.Schema({
    book: { type: mongoose_1.Schema.Types.ObjectId, ref: "Book", required: [true, "book_id is required"] },
    quantity: { type: Number, min: [1, "select at least 1 quantity"], required: [true, "quantity is required"] },
    dueDate: { type: Date, required: [true, "dueDate is required"] }
}, {
    versionKey: false,
    timestamps: true
});
borrowShema.method("updateAvailableBook", function (bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield book_model_1.Book.findByIdAndUpdate(bookId, { $set: { available: false } });
    });
});
borrowShema.pre("deleteOne", function (next) {
    console.log(this.getFilter());
});
exports.Borrow = (0, mongoose_1.model)("Borrow", borrowShema);
