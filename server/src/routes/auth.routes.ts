import express from 'express';

import {
    checkAdminToken
} from "../controllers/auth.controller";

const router = express.Router();

router
    .route('/')
    .post(checkAdminToken)

export default router
