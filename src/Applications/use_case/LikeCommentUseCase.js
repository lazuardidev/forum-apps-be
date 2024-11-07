class LikeCommentUseCase {
  constructor({ likeCommentRepository, commentRepository, threadRepository }) {
    this._likeCommentRepository = likeCommentRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, credentialId) {
    await this._threadRepository.verifyThreadExist(threadId);
    await this._commentRepository.verifyCommentExist(threadId, commentId);
    const like = await this._likeCommentRepository.verifyLikeExist(
      threadId,
      commentId,
      credentialId,
    );
    if (like) {
      await this._likeCommentRepository.deleteLike(threadId, commentId, credentialId);
    } else {
      await this._likeCommentRepository.addLike(threadId, commentId, credentialId);
    }
  }
}

module.exports = LikeCommentUseCase;
