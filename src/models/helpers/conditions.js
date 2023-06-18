const {Op} = require("sequelize");

const findUserCondition = (email, username) => {
    return {
        where: {
            [Op.or]: [
                {
                    email: {
                        [Op.eq]: email
                    },
                },
                {
                    username: {
                        [Op.eq]: username
                    }
                },
            ]
        }
    }
}

module.exports = {
    findUserCondition
};
