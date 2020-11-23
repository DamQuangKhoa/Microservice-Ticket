import express, {Request, Response} from 'express'
import jwt from 'jsonwebtoken'
import { body} from 'express-validator';
import { BadRequestError } from '../errors/bad-request-error';
import { vallidateRequest } from '../middlewaves/validate-request';
import { User } from '../models/user';
import { Password } from '../services/password';
const router = express.Router();

router.post('/api/users/sign-in',[
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
], vallidateRequest, async (req: Request , res: Response) => {
    const { email, password } = req.body
    const existingUser = await User.findOne(({email}));
    if(!existingUser){
        throw new BadRequestError('Invalid Credentials')
    }
    const passwordMatch = await Password.compare(existingUser.password, password)
    if(!passwordMatch){
        throw new BadRequestError('Invalid Credentials')
    }
     // Generate JWT Token
    const userJWT = jwt.sign({
        id: existingUser.id,
        email: existingUser.email
    }, process.env.JWT_KEY! )
    // Store it on session object
    req.session = {
        jwt: userJWT
    }

    res.status(201).send(existingUser)
})

export {router as signInRouter};