const connection = require('../database/connection');
const { getUserByEmail } = require('../database/sql');

const validateUserByBody = (req, res, next) => {
    const { userEmail } = req.body;
    connection.query(getUserByEmail(userEmail), (error, user) => {
        if (error) {
            console.log(`Error retrieving user with error: ${error}`);
            res.status(200).json({ error })
        } else {
            if (user.length == 0) {
                console.log(`No user with email address: ${userEmail}`);
                res.status(200).json({
                    error: {
                        message: `No user with email address: ${userEmail}`
                    }
                });
            } else {
                req.body.userId = user[0].id;
                next();
            }
        }
    });
}
const validateUserByParams = (req, res, next) => {
    const { userEmail } = req.params;
    connection.query(getUserByEmail(userEmail), (error, user) => {
        if (error) {
            console.log(`Error retrieving user with error: ${error}`);
            res.status(200).json({ error })
        } else {
            if (user.length == 0) {
                console.log(`No user with email address: ${userEmail}`);
                res.status(200).json({
                    error: {
                        message: `No user with email address: ${userEmail}`
                    }
                });
            } else {
                req.body.userId = user[0].id;
                next();
            }
        }
    });
}
const validateFriend = (req, res, next) => {
    const { friendEmail, userId } = req.body;
    connection.query(getUserByEmail(friendEmail), (error, user) => {
        if (error) {
            console.log(`Error retrieving friend with error: ${error}`);
            res.status(200).json({ error })
        } else {
            if (user.length == 0) {
                console.log(`No friend with email address: ${friendEmail}`);
                res.status(200).json({
                    error: {
                        message: `No friend with email address: ${friendEmail}`
                    }
                });
            } else {
                if (userId == user[0].id) {
                    console.log('You can not add yourself.');
                    return res.status(200).json({
                        error: {
                            message: 'You can not add yourself.'
                        }
                    });
                }

                req.body.friendId = user[0].id;
                next();
            }
        }
    });
}

export = {
    validateUserByBody,
    validateUserByParams,
    validateFriend
};
