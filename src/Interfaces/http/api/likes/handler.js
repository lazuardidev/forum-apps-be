const LikeCommentUseCase = require('../../../../Applications/use_case/LikeCommentUseCase');

class LikesCommentHandler {
  constructor(container) {
    this._container = container;
  }

  async putLikeCommentHandler(request, h) {
    const addOrRemoveLikeUseCase = this._container.getInstance(LikeCommentUseCase.name);
    await addOrRemoveLikeUseCase.execute(
      request.params.threadId,
      request.params.commentId,
      request.auth.credentials.id,
    );

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikesCommentHandler;
