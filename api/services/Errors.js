var util = require('util');
var createError = require('create-error');







//================================================================================ 
//============================  Base Errors ====================================== 
//================================================================================ 

var ActionError = createError('ActionError', {
    message: 'Oops, something went wrong while handling the action.'
});

var ValidationError = createError('ValidationError', {
    message: 'Validation failed.'
});

var QueryError = createError('QueryError', {
    name: 'QueryError',
    message: 'Query failed.'
});

//================================================================================ 
//==================  To-be-replaced Errors ====================================== 
//               (replaced by errors in module.exports)
//================================================================================ 

var ActionNotFoundError = createError(ActionError, 'ActionNotFoundError', {
    message: 'Action was not found.'
});

var ActionValidationError = createError(ActionError, 'ActionValidationError', {
    message: 'Validation(s) of action failed.'
});

var ActionExecutionError = createError(ActionError, 'ActionExecutionError', {
    message: 'Oops, something went wrong while executing the action.'
});


module.exports = {
    //ValidationError : ValidationError,
    ActionNotFoundError  : ActionNotFoundError,
    ActionValidationError : ActionValidationError,
    ActionExecutionError : ActionExecutionError,


    QueryError: QueryError,

    ParameterError: createError('ParameterError', {
        name: 'ParameterError',
        message: 'Invalid parameters.'
    }),


    Action: {
        notFound: createError(ActionError, 'ActionNotFoundError', {
            name: 'ActionNotFoundError',
            message: 'Oops, something went wrong while handling the action.'
        }),
        notImplemented: createError(ActionError, 'ActionNotImplementedError', {
            name: 'ActionNotImplementedError',
            message: 'Action is not yet implemented.'
        }),
    },
    Query: {
        invalidParameter: createError(QueryError, 'InvalidParameterError', {
            name: 'InvalidParameterError',
            message: 'Invalid parameter was supplied.'
        }),

    }
};
