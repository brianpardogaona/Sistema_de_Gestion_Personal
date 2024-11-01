exports.success = function(req, res, message, status){
    const statusCode = status || 200;
    const okMessage = message || '';

    res.status(statusCode).send({
        error: false,
        status: statusCode,
        body: okMessage
    });
}

exports.error = function(req, res, message, status){
    const statusCode = status || 500;
    const errorMessage = message || '';

    res.status(statusCode).send({
        error: true,
        status: statusCode,
        body: errorMessage
    });
}