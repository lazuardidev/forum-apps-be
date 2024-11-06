const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should add a like if it does not exist', async () => {
    const threadId = 'thread-1';
    const commentId = 'comment-1';
    const credentialId = 'user-1';

    const mockLikeCommentRepository = new LikeCommentRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockLikeCommentRepository.verifyLikeExist = jest.fn(() => Promise.resolve(false));
    mockLikeCommentRepository.addLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      likeCommentRepository: mockLikeCommentRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeCommentUseCase.execute(threadId, commentId, credentialId);

    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(threadId, commentId);
    expect(mockLikeCommentRepository.verifyLikeExist).toHaveBeenCalledWith(threadId, commentId, credentialId);
    expect(mockLikeCommentRepository.addLike).toHaveBeenCalledWith(threadId, commentId, credentialId);
  });

  it('should remove a like if it exists', async () => {
    const threadId = 'thread-1';
    const commentId = 'comment-1';
    const credentialId = 'user-1';

    const mockLikeCommentRepository = new LikeCommentRepository();
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockLikeCommentRepository.verifyLikeExist = jest.fn(() => Promise.resolve(true));
    mockLikeCommentRepository.deleteLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      likeCommentRepository: mockLikeCommentRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await likeCommentUseCase.execute(threadId, commentId, credentialId);

    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExist).toHaveBeenCalledWith(threadId, commentId);
    expect(mockLikeCommentRepository.verifyLikeExist).toHaveBeenCalledWith(threadId, commentId, credentialId);
    expect(mockLikeCommentRepository.deleteLike).toHaveBeenCalledWith(threadId, commentId, credentialId);
  });
});
