import express, {Request, Response} from 'express'
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { vallidateRequest } from '../middlewaves/validate-request';

const router = express.Router();

router.post('/api/users/sign-in',[
    body('email')
    .isEmail()
    .withMessage('Email must be valid'),
    body('password')
    .trim()
    .notEmpty()
    .withMessage('You must supply a password')
], vallidateRequest, (req: Request , res: Response) => {
    const { email, password } = req.body
    res.send('Hi There')
})

export {router as signInRouter};