const routes = (handler) => ([
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (request, h) => handler.putLikeCommentHandler(request, h),
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
