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
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const plugins_1 = require("./plugins");
const roles_1 = require("../config/roles");
const authTypes_1 = __importDefault(require("../config/authTypes"));
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator_1.default.isEmail(value)) {
                throw new Error('Invalid email');
            }
        },
    },
    password: {
        type: String,
        trim: true,
        minlength: 8,
        validate(value) {
            if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                throw new Error('Password must contain at least one letter and one number');
            }
        },
        private: true, // used by the toJSON plugin
    },
    authType: {
        type: String,
        required: true,
        enum: authTypes_1.default,
        private: true,
    },
    role: {
        type: String,
        enum: roles_1.roles,
        default: 'user',
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(plugins_1.toJSON);
userSchema.plugin(plugins_1.paginate);
/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
userSchema.static('searchableFields', function searchableFields() {
    return ['firstName', 'lastName', 'email'];
});
/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static('isEmailTaken', function isEmailTaken(email, excludeUserId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this.findOne({ email, _id: { $ne: excludeUserId } });
        return !!user;
    });
});
/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', function isPasswordMatch(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        return bcryptjs_1.default.compare(password, user.password);
    });
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.password) {
            if (user.isModified('password')) {
                user.password = yield bcryptjs_1.default.hash(user.password, 8);
            }
        }
        next();
    });
});
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
