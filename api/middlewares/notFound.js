export function notFound(request, response) {
  response.status(404).json({
    success: false,
    data: null,
    message: 'The requested resource was not found.',
  })
}
