
module.exports = {
    'COMPLETE_QUIZ': {
        conditions: {
            'ACTION_IS_UNIQUE': { }
        },
        rewards: {
            actor: 0,
            targetOwner: +2,
        }
    },

    'START_QUIZ': {
        conditions: {
            'ACTION_IS_UNIQUE': { }
        },
        rewards: {
            actor: 0,
            targetOwner: +1,
        }
    },

    'VOTE_UP': {
        conditions: {
            'ACTOR_NOT_OWNS_TARGET': { },
            'ACTION_IS_UNIQUE': { },
            'ACTOR_HAS_ENOUGH_REPUTATION': {
                reputation: 10
            }
        },
        rewards: {
            //actor: 10,
            //target: 10,
            targetOwner: +10,
        }
    },

    'VOTE_DOWN': {
        conditions: {
            'ACTOR_NOT_OWNS_TARGET': {
            },
            'ACTION_IS_UNIQUE': {
            },
            'ACTOR_HAS_ENOUGH_REPUTATION': {
                reputation: 5
            } 
        },
        rewards: {
            actor: -5,
            targetOwner: -5,
        }
    },

    'FLAG': {
        conditions: {
            'ACTION_IS_UNIQUE': {
            },
            'ACTOR_HAS_ENOUGH_REPUTATION': {
                reputation: 5
            }
        },
        rewards: {
            actor: -10,
            targetOwner: -2,
        }
    },

    'CREATE_QUESTION': {
        // TODO: no target exists!
        // (OR question to create is target and allows further validations,
        //     e.g. min 2 options in multuple choice)
        conditions: { },
        rewards: {
            actor: +10,
            targetOwner: 0
        }
    },

    'CREATE_QUIZ': {
        // TODO: no target exists!
        // (OR question to create is target and allows further validations,
        //     e.g. min 2 options in multuple choice)
        conditions: { },
        rewards: {
            actor: +10,
            targetOwner: 0
        }
    },

    'ADD_QUESTION_TO_QUIZ': {
        // TODO: how to handle exactly?
        //       > what is target??? (i guess must be quiz, because user must OWN it)
        //       > also remember that user must own quiz!!
        conditions: {
            //'QUIZ_DOES_NOT_YET_HAVE_QUESTION'
            'ACTOR_OWNS_TARGET': {
            }
        },
        rewards: {
            actor: 0,
            targetOwner: 0
        }
    },

    'ADD_TAG': {
        conditions: {
            // TODO: no target exists!?
            'ACTOR_HAS_ENOUGH_REPUTATION': {
                silent: false,
                reputation: 10
            }
        },
        rewards: {
            actor: 1,
            targetOwner: 0,
        }
    },

    'ANSWER_QUESTION': {
        conditions: {
            // TODO: what about re-answering questions?
            //       > one possibility is that answering a question again will simply not be logged,
            //         as only the first time answering a question is the "achievement"
            //         of answering "yet another question"
            //       > for # of questons answered very useful!!
            'ACTION_IS_UNIQUE': {
            }, 
            'ACTOR_HAS_ENOUGH_RECENT_REPUTATION': {
                duration: {
                    unit: 'weeks',
                    value: 4
                },
                reputation: 10
            }
        }
    },

    'VIEW_QUESTION': {},

    'VIEW_QUIZ': {},

    'VIEW_USER': {},

};
