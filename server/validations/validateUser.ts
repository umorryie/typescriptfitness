const connection = require('../database/connection');
const {getUserByEmail} = require('../database/sql');

const validateUserByBody = (req, res, next) => {
    const {userEmail} = req.body;
    connection.query(getUserByEmail(userEmail), (error, user) => {
        if (error) {
            console.log(`Error retrieving user with error: ${error}`);
            res.status(404).json({error})
        } else {
            if (user.length == 0) {
                console.log(`No user with email address: ${userEmail}`);
                res.status(404).json(`No user with email address: ${userEmail}`);
            } else {
                req.body.userId = user[0].id;
                next();
            }
        }
    });
}
const validateUserByParams = (req, res, next) => {
    const {userEmail} = req.params;
    connection.query(getUserByEmail(userEmail), (error, user) => {
        if (error) {
            console.log(`Error retrieving user with error: ${error}`);
            res.status(404).json({error})
        } else {
            if (user.length == 0) {
                console.log(`No user with email address: ${userEmail}`);
                res.status(404).json(`No user with email address: ${userEmail}`);
            } else {
                req.body.userId = user[0].id;
                next();
            }
        }
    });
}

export = {
    validateUserByBody,
    validateUserByParams
};
