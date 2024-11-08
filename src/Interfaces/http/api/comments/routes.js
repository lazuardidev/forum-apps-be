const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postCommentHandler(request, h),
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
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request, h) => handler.deleteCommentHandler(request, h),
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
]);

module.exports = routes;
