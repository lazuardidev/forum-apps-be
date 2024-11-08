const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'forumapi_jwt',
      plugins: {
        'hapi-rate-limitor': {
          max: 90,
          duration: 60000,
        },
      },
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    options: {
      plugins: {
        'hapi-rate-limitor': {
          max: 90,
          duration: 60000,
        },
      },
    },
    handler: (request, h) => handler.getThreadByIdHandler(request, h),
  },
]);

module.exports = routes;
