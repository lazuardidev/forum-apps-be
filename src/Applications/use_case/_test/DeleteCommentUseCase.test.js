const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const credentialId = 'user-1';
    const threadId = 'thread-1';
    const commentId = 'comment-1';

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
    mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(threadId, commentId, credentialId);

    expect(mockThreadRepository.verifyThreadExist)
      .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExist)
      .toHaveBeenCalledWith(threadId, commentId);
    expect(mockCommentRepository.verifyCommentOwner)
      .toHaveBeenCalledWith(threadId, commentId, credentialId);
    expect(mockCommentRepository.deleteComment)
      .toHaveBeenCalledWith(threadId, commentId);
  });
});
