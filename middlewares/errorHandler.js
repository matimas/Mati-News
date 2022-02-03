exports.errorHandler = (error, req, res, next) => {
    const { dataErrors, message, statusCode } = error;
    res.status(statusCode).send({ message, dataErrors })
}