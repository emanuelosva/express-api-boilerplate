const status = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  preconditionFailed: 412,
  serverError: 500,
}

const mapCodeToMessage = {
  200: 'ok',
  201: 'created',
  400: 'bad request',
  401: 'unauthorized',
  403: 'action forbidden',
  404: 'not found',
  409: 'conflict with preexisting data',
  412: 'precondition failed',
  500: 'server error',
}

module.exports = {
  status,
  mapCodeToMessage,
}
