"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const auth_route_1 = __importDefault(require("./auth.route"));
const messages_route_1 = __importDefault(require("./messages.route"));
const user_route_1 = __importDefault(require("./user.route"));
const arcjet_middleware_1 = __importDefault(require("../middleware/arcjet.middleware"));
const router = (0, express_1.Router)();
const ROOT = process.cwd();
router.use(arcjet_middleware_1.default);
router.use('/auth', auth_route_1.default);
router.use('/users', user_route_1.default);
router.use('/messages', messages_route_1.default);
// keep LAST: SPA fallback
router.get('*', (_req, res) => {
    res.sendFile(path_1.default.resolve(ROOT, 'frontend/dist/index.html'));
});
exports.default = router;
