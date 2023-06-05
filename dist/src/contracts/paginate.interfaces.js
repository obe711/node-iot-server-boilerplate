"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEmptyQueryResult = void 0;
const createEmptyQueryResult = () => ({
    results: [],
    page: 0,
    limit: 0,
    totalPages: 0,
    totalResults: 0,
});
exports.createEmptyQueryResult = createEmptyQueryResult;
