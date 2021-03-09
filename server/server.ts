import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
const {userRouter} = require('./routers/UserRouter');
const {exercisesRouter} = require('./routers/ExercisesRouter');
const userApiEndPoint = '/api/users/';
const exercisesApiEndPoint = '/api/exercises/';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(userApiEndPoint, userRouter);
app.use(exercisesApiEndPoint, exercisesRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

export default app;