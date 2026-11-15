export function errorHandler(error, request, response, next) {
  if (response.headersSent) {
    return next(error)
  }

  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500
  const message =
    statusCode === 500 ? 'An unexpected server error occurred.' : error.message

  if (statusCode === 500) {
    console.error('Request failed:', error.message)
  }

  response.status(statusCode).json({
    success: false,
    data: null,
    message,
  })
}
