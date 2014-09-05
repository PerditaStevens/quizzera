
var moment = require('moment');
var _ = require('lodash');

module.exports.useDummyData = true;

function randomUser(){
    //var randId = Math.ceil(Math.random()*module.exports.users.length);
    //return randId;
    return _.sample(_.range(1, module.exports.users.length+1));
}

function randomQuestion(){
    return _.sample(_.range(1, module.exports.questions.length+1));
}

function randomQuiz(){
    return _.sample(_.range(1, module.exports.quizzes.length+1));
}

module.exports.users = [
    {
        "email": "chew.baka@gmail.com",
        "username": 'chewbaka',
        "thumbnailUrl": '/images/user/1.png',
    },
    {
        "email": "p.sterker@gmail.com",
        "username": 'Targoran',
        "gender": 'male',
        "firstName": 'Philipp',
        "lastName": 'Sterker',
        "community": 'Hochschule ReihnMain',
    },
    {
        "email": "a.sterker@gmail.com",
        "username": 'alina',
        "gender": 'female',
        "firstName": 'Alina',
        "lastName": 'Sterker',
        "community": 'Hochschule ReihnMain',
        "thumbnailUrl": '/images/user/3.png'
    },
    {
        "email": "w.sterker@gmail.com",
        "username": 'Wolfgang',
        "gender": 'male',
        "firstName": 'Wolfgang',
        "lastName": 'Sterker',
        'isTeacher': true,
        "community": 'Bettinaschule',
    },
    {
        "email": "petra.supparitsch@web.de",
        "username": 'Petra',
        "gender": 'female',
        "firstName": 'Petra',
        "lastName": 'Supparitsch',
        //"thumbnailUrl": '/images/user/5.png'
    },
    {
        "email": "t.sterker@gmail.com",
        "username": 'tsterker',
        "thumbnailUrl": '/images/user/6.png',
        "gender": 'male',
        "firstName": 'Tim',
        "lastName": 'Sterker',
        "community": 'University of Edinburgh',
    },
    {
        "email": "nele.bohn@gmail.com",
        "username": 'Leli',
        "gender": 'female',
        "firstName": 'Nele',
        "lastName": 'Sterker',
        "community": 'University of Edinburgh',
        "thumbnailUrl": '/images/user/7.png',
    },
    {
        "email": "nele.bohn@live.de",
        "username": 'Nelekind',
        "gender": 'female',
        "firstName": 'Nele',
        "lastName": 'Bohn',
        "community": 'University of Edinburgh',
        "thumbnailUrl": '/images/user/8.png',
    },
    {
        "email": "hans@gmail.com",
        "username": 'derHans',
        "firstName": 'Hans',
        "thumbnailUrl": '/images/user/9.png'
    },
    {
        "email": "peter@gmail.com",
        "username": 'pedör',
        "gender": 'male',
        "firstName": 'Peter',
        "thumbnailUrl": '/images/user/10.png'
    },
    {
        "email": "gabi@gmail.com",
        "username": 'laGabi',
        "firstName": 'Gabi',
        "thumbnailUrl": '/images/user/11.png'
    },
    {
        "email": "rolf@gmail.com",
        "username": 'ultimateRolf',
        "firstName": 'Rolf',
        "thumbnailUrl": '/images/user/12.png'
    },
    {
        "email": "langername@gmail.com",
        //"username": 'MrICantDecideOnANameWhatsoever',
        "username": 'Mr. Pink',
        "gender": 'male',
        "thumbnailUrl": '/images/user/13.png'
    },
];

var qz1User = randomUser();
module.exports.quizzes = [
    {
        title: 'Computer Animation',
        description: 'This is a collection of computer animation related questions that I used for revising for the exam.',
        author: qz1User,
        tags: ['computer-animation'],
        questions: [9, 10, 11, 12, 13, 14, 15, 16, 17, {
            author: qz1User,
            questionType: 'MULTIPLE_CHOICE',
            title: 'OMG LOL IT WORKZZ',
            description: 'This was created on the fly!!',
            tags: ['OMGZ', 'LORLZ', 'ROFLERZZ'],
            answer: {
                options: [
                    'yes',
                    'no',
                    'maybe'
                ],
                correctOption: 2
            }
        }]
    },
    {
        title: 'Machine Learning',
        description: 'A collection of questions regarding general machine learning stuff.',
        author: randomUser(),
        tags: ['machine-learning'],
        questions: [1, 11]
    },
    {
        title: 'Motion Capture',
        description: 'Some motion capture questions.',
        author: randomUser(),
        tags: ['computer-graphics', 'computer-animation'],
        questions: [8, 13, 15]
    },
    {
        title: 'Misc',
        description: 'Some mixed questions I liked.',
        author: randomUser(),
        tags: ['misc'],
        questions: [9, 11, 13]
    },
    {
        title: 'Physics',
        description: 'Physics and related questions.',
        author: randomUser(),
        tags: ['physics', 'misc'],
        questions: [1, 4, 5]
    },
    {
        title: 'Random',
        description: 'Random questions I liked.',
        author: randomUser(),
        tags: ['computer-graphics', 'misc', 'physics', 'machine-learning'],
        questions: [1, 4, 8, 9, 11]
    }
];


module.exports.questionStats = [
    {
        votes: 299792
    },
    {
        votes: 110
    },
    {
        votes: 13
    },
    {
        votes: 107
    },
];

module.exports.questions = [
    {
// 1
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Speed of light',
        description: 'What is approximately the speed of light?',
        tags: ['physics', 'physics', 'interesting'],
        answer: {
            options: [
                '53 m/s',           // terminal velocity of a skydiver
                '340.29 m/s',       // speed of sound
                '299 792 458 m/s'   // speed of light
            ],
            correctOption: 2
        }
    },
    {
// 2
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'K-nearest-neighbours',
        description: 'The k-nearest-neighbours algorithm is ...',
        tags: ['machine-learning', 'kNN'],
        answer: {
            options: [
                'unsupervised',
                'supervised'
            ],
            correctOption: 0
        }
    },
    {
// 3
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Capital of Spain',
        description: 'What is the capital of Spain?',
        tags: ['geography'],
        answer: {
            options: [
                'Barcelona',
                'Madrid',
                'Valencia'
            ],
            correctOption: 1
        }
    },
    {
// 4
        author: randomUser(),
        questionType: 'TRUE_OR_FALSE',
        title: 'Speed of light',
        description: 'The speed of light is the same in air as it is in water.',
        tags: ['physics', 'interesting', 'misconceptions'],
        answer: {
            isTrue: false
        }
    },
    {
// 5
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Density of water',
        description: 'What is the density of water?',
        tags: ['physics'],
        answer: {
            options: [
                '1,0.00 g/cm³',
                '1,00.00 g/cm³',
                '1,000.00 g/cm³'
            ],
            correctOption: 2
        }
    },
    {
// 6
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Joint-representation by "gimbal joint"',
        description: 'WHen representing a shoulder joint by a gimbal joint (todo: add image), what issue can arise?',
        tags: ['computer animation', 'mechanical joints'],
        answer: {
            options: [
                'Too many degrees of freedom',
                'Gimbal lock'
            ],
            correctOption: 1
        }
    },
    {
// 7
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Gimbal Lock',
        description: 'What does it mean when a gimbal joint is in a "gimbal lock"?',
        tags: ['computer-animation', 'mechanical-joints'],
        answer: {
            options: [
                'Two rotational axes are pointing in the same direction',
                'The joint needs to be lubricated, as it cannot move properly anymore'
            ],
            correctOption: 0
        }
    },
    {
// 8
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Motion Capture (MOCAP)',
        description: 'You want to synthesize an animation where a person manipulates an object with his hands. You are particularly interested in capturing the movement of the hands. What would be the most appropriate motion capturing technique?',
        tags: ['computer-animation', 'motion-capture'],
        answer: {
            options: [
                'Optical',
                'Magnetic',
                'Mechanical'
            ],
            correctOption: 1
        }
    },
    {
// 9
        author: randomUser(),
        questionType: 'TRUE_OR_FALSE',
        title: 'Skeleton representation',
        description: 'In your computer game you want to represent the skeleton of a human. Is it best to represent it as a hierarchical structure?',
        tags: ['computer-animation'],
        answer: {
            isTrue: true
        }
    },
    {
// 10
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Interpolation',
        description: 'You want to make a 3D object move from one point to another. But instead of moving it in a straight line, you want it to take a curved path. Which interpolation method should you use?',
        tags: ['computer-animation', 'motion-capture'],
        answer: {
            options: [
                'Linear Interpolation',
                'Spherical interpolation'
            ],
            correctOption: 1
        }
    },
    {
// 11
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Flocking Model',
        description: 'The four forces of a simple swarm flocking model can be abbreviated with "SACO". What do the letters stand for?',
        tags: ['physics', 'computer-animation', 'motion-capture'],
        answer: {
            options: [
                'Separation, Alignment, Cohersion, Obstacle Avoidance',
                'Shoes, Are, Comfortable, Objects',
                'Survival Skill, Abilities, Concentration, Observations'
            ],
            correctOption: 0
        }
    },
    {
// 12
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Animating rigged models',
        description: 'After your model of a person is rigged to a skeleton, you realize the elbow is collapsing when the elbow is beng (todo: include image). Why does this happen?',
        tags: ['computer-animation', 'motion-capture'],
        answer: {
            options: [
                'The person is now muscular enough',
                'The rigger did a bad job',
                'Linear blending was used'
            ],
            correctOption: 2
        }
    },
    {
// 13
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Motion Capture',
        description: 'Which motion capture (MOCAP) method is most vulnerable to sensor occlusion?',
        tags: ['computer-animation', 'motion-capture'],
        answer: {
            options: [
                'Mechanical',
                'Optical',
                'Magnetic',
                'Inertial'
            ],
            correctOption: 1
        }
    },
    {
// 14
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Hair Animation',
        description: 'How can hair simulated effectively?',
        tags: ['computer-animation', 'motion-capture', 'computer-graphics'],
        answer: {
            options: [
                'Particle System with springs and weights',
                'Bezier Curves',
                'Triangle Mesh'
            ],
            correctOption: 0
        }
    },
    {
// 15
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Motion Capture Volume',
        description: 'Which technique has a bigger motion capture volume?',
        tags: ['computer-animation', 'motion-capture'],
        answer: {
            options: [
                'Magnetic MOCAP',
                'Optical MOCAP',
                'Mechanical MOCAP'
            ],
            correctOption: 2
        }
    },
    {
// 16
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Animation Editing',
        description: 'In a wrestling scene, one figther grabs the head of its opponent. But after reviewing the footage, the producer decides that the man should instead grab the shoulders of his opponent. Which technique can be used to make this adjustment?',
        tags: ['computer-animation', 'motion-capture'],
        answer: {
            options: [
                'Motion Warping',
                'Expression Cloning ',
                'Motion Replacement'
            ],
            correctOption: 1
        }
    },
    {
// 17
        author: randomUser(),
        questionType: 'MULTIPLE_CHOICE',
        title: 'Skeleton Animation',
        description: 'You have a 3D model of a person rigged onto a skeleton model and now want to animate it via keyframe animation. For this purpose you want to implement a feature that allows you to grab a joint of the person and move it to where you want it to end up in the current keyframe. While you move the joint, the whole skeleton should move accordingly.',
        tags: ['computer-animation', 'motion-capture'],
        answer: {
            options: [
                'Forward Kinematics',
                'Inverse Kinematics'
            ],
            correctOption: 1
        }
    },
    {
// 18
        author: randomUser(),
        questionType: 'TRUE_OR_FALSE',
        title: 'True or False',
        description: 'You are currently reading the description of a question. Is this question a true-or-false question?',
        tags: ['conundrum', 'trick question'],
        answer: {
            isTrue: true
        }
    },
];


// #####################################################################################
// #########################    USER ACTIONS   #########################################
// #####################################################################################
// 

var actionRecords = {
    'CREATE_QUESTION': [],
    "CREATE_QUIZ": [],
    'VOTES': [],

    'VOTE_UP': [],
    'VOTE_DOWN': [],
    'FLAG': [],
    'ADD_TAG': [],
    //"ANSWER_QUESTION",
};

var numUsers = module.exports.users.length;
var numQuestions = module.exports.questions.length;
var numQuizzes = module.exports.quizzes.length;
var userIdRange = _.range(1,numUsers+1);
var questionIdRange = _.range(1,numQuestions+1);
var quizIdRange = _.range(1,numQuizzes+1);
var dayRange = _.range(32);

var activityCount = 100;

// create questions
_.each(module.exports.questions, function(question){
    var record = {
        actionType: 'CREATE_QUESTION',
        //actor: _.sample(userIdRange),
        actor: question.author,
        targetType: 'Question',
        data: {
            question: question
        }
    };
    actionRecords['CREATE_QUESTION'].push(record);
    //actionRecords['CREATE_QUESTION'].push(record);
    //actionRecords['CREATE_QUESTION'].push(record);
    //actionRecords['CREATE_QUESTION'].push(record);
});

// create questions
_.each(module.exports.quizzes, function(quiz){
    var record = {
        actionType: 'CREATE_QUIZ',
        actor: quiz.author,
        targetType: 'Quiz',
        data: {
            quiz: quiz
        }
    };
    actionRecords['CREATE_QUIZ'].push(record);
});

// create questions
_.each(_.range(100), function(i){
    var targetType = _.sample(['Quiz', 'Question']);
    var targetId = (targetType === 'Quiz')? randomQuiz() : randomQuestion();

    var record = {
        actionType: _.sample(['VOTE_UP', 'VOTE_UP', 'VOTE_UP', 'VOTE_UP', 'VOTE_DOWN']),
        actor: randomUser(),
        target: targetId,
        targetType: targetType
    };
    if(record)
    actionRecords['VOTES'].push(record);
});

var actionTypes = [
    // NOTE: repetitions for more probability
    "VOTE_UP",
    "VOTE_UP",
    "VOTE_UP",
    "VOTE_UP",
    "VOTE_UP",

    "VOTE_DOWN",
    //"FLAG_SPAM",
    //"FLAG_OFFENSIVE",
    //"FLAG_FAULTY",
    //"CREATE_QUESTION",
    //"CREATE_QUIZ",
    //"ADD_TAG",
    //"ANSWER_QUESTION",
    //"COMPLETE_QUIZ",
    //"VIEW_QUESTION",
    //"VIEW_QUIZ",
    //"VIEW_USER"
];

while(--activityCount > 0){
    var record = {
        actionType: _.sample(actionTypes),
        actor: _.sample(userIdRange),
        //targetOwner = module.exports.questions[target-1].author;
    };

    if(_.contains(['CREATE_QUESTION', 'CREATE_QUIZ'], record.actionType)){
        record.target = undefined;
    }

    if(_.contains(['ANSWER_QUESTION', 'CREATE_QUESTION'], record.actionType)){
        record.targetType = 'Question';
    } else {
        record.targetType = _.sample(['Question', 'Quiz']);
    }

    record.target = (record.targetType === 'Question')
        ? _.sample(questionIdRange)
        : _.sample(quizIdRange);

    actionRecords[record.actionType].push(record);
}



module.exports.actionRecords = actionRecords;
