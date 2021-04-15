const connection = require('../database/connection');
const { getFriendshipByMetaData } = require('../database/sql');

const validateAddingFriendLegality = (req, res, next) => {
    const { friendId, userId } = req.body;

    connection.query(getFriendshipByMetaData(userId, friendId), (error, friendship) => {
        if (error) {
            console.log(`Error retrieving friendship with error: ${error}`);
            return res.status(200).json({ error })
        } else {

            if (friendship && friendship.length == 1 && friendship[0].number > 0) {
                return res.status(200).json({
                    error: {
                        message: `Friendship already exists.`
                    }
                });
            } else {
                next();
            }
        }
    });
};

export = {
    validateAddingFriendLegality
};