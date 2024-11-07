const LikeCommentRepository = require('../LikeCommentRepository');

describe('Like repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    const likeCommentRepository = new LikeCommentRepository();

    await expect(likeCommentRepository.addLike('', '', '')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.verifyLikeExist('', '', '')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.deleteLike('', '', '')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeCommentRepository.getLikesByThreadId('')).rejects.toThrowError('LIKE_COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
