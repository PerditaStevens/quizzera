
var actions = {
    VOTE_UP: require('./actions/VOTE_UP'),
    VOTE_DOWN: require('./actions/VOTE_DOWN'),
    FLAG: require('./actions/FLAG'),
    CREATE_QUESTION: require('./actions/CREATE_QUESTION'),
    CREATE_QUIZ: require('./actions/CREATE_QUIZ'),
    ADD_TAG: require('./actions/ADD_TAG'),
    ANSWER_QUESTION: require('./actions/ANSWER_QUESTION'),
    START_QUIZ: require('./actions/START_QUIZ'),
    COMPLETE_QUIZ: require('./actions/COMPLETE_QUIZ')
};

var configs = require('./ActionsConfig');

// cache action instances
var cache = {};

module.exports = {
    getAction: function(type){
        var action = cache[type],
            config = configs[type];

        if(action){
            return cache[type];
        } else {
            action = actions[type];
            if(!action){
                throw new Error('No such action found: '+type);
            }
            if(!config){
                throw new Error('No configuration found for action type '+type);
            }

            cache[type] = new action(config);
            return  cache[type];
        }
    }
};
