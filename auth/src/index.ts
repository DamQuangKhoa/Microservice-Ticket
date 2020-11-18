import express from 'express';
import { json } from 'body-parser';
import 'express-async-errors'
import { currentUserRouter } from './routes/current-user';
import { signInRouter } from './routes/signin';
import { signOutRouter } from './routes/signout';
import { signUpRouter } from './routes/signup';
import { errorHandler } from './middlewaves/error-handler';
import { NotFoundError } from './errors/not-found-error';
const app = express();
app.use(json());

app.use(signUpRouter)
app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)

app.all('*', async () => {
  throw new NotFoundError()
})

app.use(errorHandler)


app.listen(3000, () => {
  console.log('Listening on port 3000!!!!!!');
});
