import express from 'express'
import jwt from 'jsonwebtoken'
import { currentUser } from '../middlewaves/current-user';
import { requireAuth } from '../middlewaves/require-auth';


const router = express.Router();

router.get('/api/users/current-user', currentUser, requireAuth, (req, res) => {
    res.send({currentUser: req.currentUser || null })
})

export {router as currentUserRouter};