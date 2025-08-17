import createHttpError from "http-errors";
import { isValidObjectId } from "mongoose";

export default function isValidId (req, res, next) {
    if (!isValidObjectId(req.params.contactId)) {
        throw createHttpError.BadRequest('Bad request');
    }
    next();
}