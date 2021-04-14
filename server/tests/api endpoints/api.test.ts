import 'mocha';
import 'chai';
import { expect } from 'chai';
import mysql from 'mysql';
const testConfig = require('../testDatabaseConfig');
import ExerciseRepository from '../../repository/ExerciseRepository';
import app from '../../server';
import request = require('supertest');
const { generateToken } = require('../../auth/tokenAuth');
const token = generateToken({ userEmail: "pesjak.matej@gmail.com" });

describe('api/users/user', function () {
    let mysqlTestConnection;
    let exerciseRepository;
    before(async function () {
        mysqlTestConnection = mysql.createPool({
            user: testConfig.user,
            database: testConfig.database,
            password: testConfig.password,
            host: testConfig.host,
            port: testConfig.port,
            multipleStatements: true
        });

        exerciseRepository = new ExerciseRepository(mysqlTestConnection);
    })

    describe('GET', async function () {
        it('authorized - /api/users/user/getUser', async function () {
            // Arrange
            const today: Date = new Date();
            const year: number = today.getFullYear();

            // Act
            let response = await request(app).get("/api/users/user/getUser").set('Authorization', `Bearer ${token}`);
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(200);
            expect(responseBody.email).to.equal('pesjak.matej@gmail.com');
            expect(responseBody.exercises).not.to.equal(null);
            expect(responseBody.exercises[0].exerciseName).to.equal("bench_press");
            expect(responseBody.exercises[1].exerciseName).to.equal("deadlift");
            expect(responseBody.exercises[0].years.length).to.equal(1);
            expect(responseBody.exercises[1].years.length).to.equal(1);
            expect(responseBody.exercises[1].years[0].yearNumber).to.equal(year);
            expect(responseBody.exercises[0].years[0].yearNumber).to.equal(year);
            expect(responseBody.exercises[0].years[0].months.length).to.equal(1);
            expect(responseBody.exercises[1].years[0].months.length).to.equal(1);
            expect(responseBody.exercises[0].years[0].months[0].options.dataPoints.length).to.equal(1);
            expect(responseBody.exercises[1].years[0].months[0].options.dataPoints.length).to.equal(1);
        });
        it('no token - /api/users/user/getUser', async function () {
            // Act
            let response = await request(app).get("/api/users/user/getUser");
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
        it('wrong token - /api/users/user/getUser', async function () {
            // Act
            let response = await request(app).get("/api/users/user/getUser").set('Authorization', `Bearer asd${token}`);
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
    });
    describe('POST', async function () {
        it('/api/users/user/register', async function () {
            // Act
            const response = await request(app).post("/api/users/user/register").send({ "userEmail": "test@gmail.com", "password": "passwordpassword", "repassword": "passwordpassword" });
            const user = await exerciseRepository.customQuery(`select * from users where email = 'test@gmail.com'`);

            // Assert
            expect(response.status).to.equal(202);
            expect(user).not.to.equal(null);
            expect(user.length).to.equal(1);
            expect(user[0].email).to.equal('test@gmail.com');
        });
    });
    describe('POST', async function () {
        it('should login with correct credentials /api/users/user/login', async function () {
            // Act
            const response = await request(app).post("/api/users/user/login").send({ "userEmail": "test@gmail.com", "password": "passwordpassword" });

            // Assert
            expect(response.status).to.equal(200);
            expect(response.body.token).not.to.equal(null);
            expect(response.body.match).to.equal(true);
        });
        it('should alert when wrong credentials /api/users/user/login', async function () {
            // Act
            const response = await request(app).post("/api/users/user/login").send({ "userEmail": "test@gmail.com", "password": "passwordpassword1" });

            // Assert
            expect(response.status).to.equal(200);
            expect(response.body.error.message).to.equal('Password do not match with this email.');
        });
    });
    describe('POST', function () {
        it('authorized - /api/users/user/postExerciseProgress', async function () {
            // Arrange
            const today: Date = new Date();
            const year: number = today.getFullYear();

            // Act
            const postResponse = await request(app).post("/api/users/user/postExerciseProgress").set('Authorization', `Bearer ${token}`).send({
                "exerciseName": "deadlift", "sets": 4, "weight": "200", "reps": 10, "weightUnit": "lbs"
            });

            let response = await request(app).get("/api/users/user/getUser").set('Authorization', `Bearer ${token}`);
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(postResponse.status).to.equal(202);
            expect(responseBody.email).to.equal('pesjak.matej@gmail.com');
            expect(responseBody.exercises).not.to.equal(null);
            expect(responseBody.exercises[0].exerciseName).to.equal("bench_press");
            expect(responseBody.exercises[1].exerciseName).to.equal("deadlift");
            expect(responseBody.exercises[0].years.length).to.equal(1);
            expect(responseBody.exercises[1].years.length).to.equal(1);
            expect(responseBody.exercises[1].years[0].yearNumber).to.equal(year);
            expect(responseBody.exercises[0].years[0].yearNumber).to.equal(year);
            expect(responseBody.exercises[0].years[0].months.length).to.equal(1);
            expect(responseBody.exercises[1].years[0].months.length).to.equal(1);
            expect(responseBody.exercises[1].years[0].months.length).to.equal(1);
            expect(responseBody.exercises[0].years[0].months[0].options.dataPoints.length).to.equal(1);
            expect(responseBody.exercises[1].years[0].months[0].options.dataPoints.length).to.equal(2);
        });
        it('non existing exercise - /api/users/user/postExerciseProgress', async function () {
            // Act
            let response = await request(app).post("/api/users/user/postExerciseProgress").set('Authorization', `Bearer ${token}`).send({
                "exerciseName": "nonExistingOne", "sets": 4, "weight": "200", "reps": 10, "weightUnit": "123"
            });
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(202);
            expect(responseBody.affectedRows).to.equal(1);
        });
        it('wrong token - /api/users/user/postExerciseProgress', async function () {
            // Act
            let response = await request(app).post("/api/users/user/postExerciseProgress").set('Authorization', `Bearer asd${token}`);
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(200);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
        it('no token - /api/users/user/postExerciseProgress', async function () {
            // Act
            let response = await request(app).post("/api/users/user/postExerciseProgress");
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(200);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
    });
    describe('PUT', function () {
        it('authorized - /api/users/user/update/exerciseProgress', async function () {
            // Arrange
            const exerciseProgress = await exerciseRepository.customQuery('select * from exercise_progress');
            const exerciseProgressId = exerciseProgress[exerciseProgress.length - 1].id;

            // Act
            let response = await request(app).put("/api/users/user/update/exerciseProgress").set('Authorization', `Bearer ${token}`).send({
                "sets": 666, "weight": 666, "reps": 666, "weightUnit": "kg", "exerciseProgressId": exerciseProgressId
            });
            const exerciseCheck = await exerciseRepository.customQuery(`select * from exercise_progress where id = ${exerciseProgressId}`);

            // Assert
            expect(exerciseCheck).not.to.equal(null);
            expect(response.status).to.equal(202);
            expect(exerciseCheck.length).to.equal(1);
            expect(exerciseCheck[0].sets).to.equal(666);
            expect(exerciseCheck[0].weight).to.equal(666);
            expect(exerciseCheck[0].reps).to.equal(666);
            expect(exerciseCheck[0].weight_unit).to.equal('kg');
        });
        it('no token - /api/users/user/update/exerciseProgress', async function () {
            // Act
            let response = await request(app).put("/api/users/user/update/exerciseProgress");
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
        it('wrong token - /api/users/user/update/exerciseProgress', async function () {
            // Act
            let response = await request(app).put("/api/users/user/update/exerciseProgress").set('Authorization', `Bearer asd${token}`).send({ "exerciseName": "newExerciseTest" });
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
    });
    describe('DELETE', async function () {
        it('authorized - /api/users/user/delete/exerciseProgress', async function () {
            // Act
            const exerciseProgress = await exerciseRepository.customQuery('select * from exercise_progress');
            const exerciseProgressId = exerciseProgress[0].id;
            let response = await request(app).delete("/api/users/user/delete/exerciseProgress").set('Authorization', `Bearer ${token}`).send({ "exerciseProgressId": exerciseProgressId });
            const exerciseProgressCheck = await exerciseRepository.customQuery(`select * from exercise_progress where id = ${exerciseProgressId}`);

            // Assert
            expect(response.status).to.equal(202);
            expect(exerciseProgressCheck).not.to.equal(null);
            expect(exerciseProgressCheck.length).to.equal(0);
        });
        it('no token - /api/users/user/delete/exerciseProgress', async function () {
            // Act
            let response = await request(app).delete("/api/users/user/delete/exerciseProgress");
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
        it('wrong token - /api/users/user/delete/exerciseProgress', async function () {
            // Act
            let response = await request(app).delete("/api/users/user/delete/exerciseProgress").set('Authorization', `Bearer asd${token}`)
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(200);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
    });
});

describe('api/exercises', function () {
    this.timeout(20000);
    let mysqlTestConnection;
    let exerciseRepository;
    before(function () {
        mysqlTestConnection = mysql.createPool({
            user: testConfig.user,
            database: testConfig.database,
            password: testConfig.password,
            host: testConfig.host,
            port: testConfig.port,
            multipleStatements: true
        });
        exerciseRepository = new ExerciseRepository(mysqlTestConnection);
    })
    describe('POST', function () {
        it('insertExercise', async function () {
            // Arrange
            await exerciseRepository.insertExercise("newExercise", true);

            // Act
            const exercise = await exerciseRepository.customQuery("select * from exercises where name = 'newExercise'");

            // Assert
            expect(exercise).not.to.equal(null);
            expect(exercise.length).to.equal(1);
            expect(exercise[0].name).to.equal('newExercise');
            expect(exercise[0].is_custom_exercise).to.equal(1);
        });
    });
    describe('GET', function () {
        it('getExercisesNames - api/exercises/getExercises/', async function () {
            // Act
            let exercises = await request(app).get("/api/exercises/getExercises/");
            let exercisesBody = exercises.body;

            // Assert
            expect(exercisesBody).not.to.equal(null);
            expect(exercises.status).to.equal(200);
            expect(exercisesBody.length).to.equal(4);
            expect(exercisesBody[0].name).to.equal('bench_press');
            expect(exercisesBody[0].isCustomExercise).to.equal(false);
            expect(exercisesBody[1].name).to.equal('deadlift');
            expect(exercisesBody[1].isCustomExercise).to.equal(false);
            expect(exercisesBody[2].name).to.equal('nonExistingOne');
            expect(exercisesBody[2].isCustomExercise).to.equal(true);
            expect(exercisesBody[3].name).to.equal('newExercise');
            expect(exercisesBody[3].isCustomExercise).to.equal(true);
        });
    });
    describe('POST', function () {
        it('insertCustomUserExercise - when authorized - url: /api/exercises/create/newExercise', async function () {
            // Act

            let response = await request(app).post("/api/exercises/create/newExercise").set('Authorization', `Bearer ${token}`).send({ "exerciseName": "newExerciseTest" });
            let responseBody = response.body;
            const result = await exerciseRepository.customQuery(`
            select * from users_exercises ue 
            where ue.user_id = (
                select id from users where email = 'pesjak.matej@gmail.com') 
                and ue.exercise_id = (
                    select id from exercises e2 where name = 'newExerciseTest'
                )`);
            const userId = await exerciseRepository.customQuery(`select id from users where email = 'pesjak.matej@gmail.com'`);
            const exerciseId = await exerciseRepository.customQuery(`select id from exercises where name = 'newExerciseTest'`);

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).to.equal(undefined);
            expect(responseBody.affectedRows).to.equal(1);
            expect(responseBody.insertId).not.to.equal(null);
            expect(response).not.to.equal(null);
            expect(response.status).to.equal(202);
            expect(result).not.to.equal(null);
            expect(result.length).to.equal(1);
            expect(result[0].user_id).to.equal(userId[0].id);
            expect(result[0].exercise_id).to.equal(exerciseId[0].id);
        });
        it('insertCustomUserExercise - when wrong token - url: /api/exercises/create/newExercise', async function () {
            // Act
            let response = await request(app).post("/api/exercises/create/newExercise").set('Authorization', `Bearer sdffsfd`);
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(200);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
        it('insertCustomUserExercise - when no token - url: /api/exercises/create/newExercise', async function () {
            // Act
            let response = await request(app).post("/api/exercises/create/newExercise").send({ "exerciseName": "newExerciseTest" });
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
    });
});


describe('api/users/friends', function () {
    let mysqlTestConnection;
    let exerciseRepository;
    before(async function () {
        mysqlTestConnection = mysql.createPool({
            user: testConfig.user,
            database: testConfig.database,
            password: testConfig.password,
            host: testConfig.host,
            port: testConfig.port,
            multipleStatements: true
        });

        exerciseRepository = new ExerciseRepository(mysqlTestConnection);
    })

    describe('POST', async function () {
        it('should add friendship - /api/users/friends/add', async function () {
            // Act
            let response = await request(app).post("/api/users/friends/add").set('Authorization', `Bearer ${token}`).send({ friendEmail: 'test@gmail.com' });
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(202);
            expect(responseBody.message).to.equal('Friendship inserted.');
        });
        it('no token - /api/users/friends/add', async function () {
            // Act
            let response = await request(app).post("/api/users/friends/add");
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
        it('wrong token - /api/users/friends/add', async function () {
            // Act
            let response = await request(app).post("/api/users/friends/add").set('Authorization', `Bearer asd${token}`);
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
    });
    describe('DELETE', async function () {
        it('should delete friendship - /api/users/friends/delete', async function () {
            // Act
            let response = await request(app).delete("/api/users/friends/delete").set('Authorization', `Bearer ${token}`).send({ friendEmail: 'katja.zalokar@gmail.com' });
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(200);
            expect(responseBody.message).to.equal('Friendship deleted.');
        });
        it('no token - /api/users/friends/delete', async function () {
            // Act
            let response = await request(app).delete("/api/users/friends/delete");
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
        it('wrong token - /api/users/friends/delete', async function () {
            // Act
            let response = await request(app).delete("/api/users/friends/delete").set('Authorization', `Bearer asd${token}`);
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
    });
    describe('PUT', async function () {
        it('should delete friendship - /api/users/friends/confirmation', async function () {
            // Act
            let response = await request(app).put("/api/users/friends/confirmation").set('Authorization', `Bearer ${token}`).send({ friendshipId: 2 });
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(200);
            expect(responseBody.message).to.equal('Friendship confirmed.');
        });
        it('no token - /api/users/friends/confirmation', async function () {
            // Act
            let response = await request(app).put("/api/users/friends/confirmation");
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
        it('wrong token - /api/users/friends/confirmation', async function () {
            // Act
            let response = await request(app).put("/api/users/friends/confirmation").set('Authorization', `Bearer asd${token}`);
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
    });
    describe('GET', async function () {
        it('authorized - /api/users/friends', async function () {
            // Act
            let response = await request(app).get("/api/users/friends").set('Authorization', `Bearer ${token}`);
            let responseBody = response.body;

            // Assert
            expect(responseBody).not.to.equal(null);
            expect(response.status).to.equal(200);
            expect(responseBody.friends.length).to.equal(1);
            expect(responseBody.friends[0].friendId).to.equal(3);
            expect(responseBody.friends[0].confirmed).to.equal(true);
            expect(responseBody.friends[0].email).to.equal('test@gmail.com');
        });
        it('no token - /api/users/friends', async function () {
            // Act
            let response = await request(app).get("/api/users/friends");
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.message).not.to.equal(null);
            expect(responseBody.error.message).to.equal("No token specified.");
        });
        it('wrong token - /api/users/friends', async function () {
            // Act
            let response = await request(app).get("/api/users/friends").set('Authorization', `Bearer asd${token}`);
            let responseBody = response.body;

            // Assert
            expect(response.status).to.equal(200);
            expect(responseBody).not.to.equal(null);
            expect(responseBody.error).not.to.equal(null);
            expect(responseBody.error.name).to.equal("JsonWebTokenError");
        });
    });
});