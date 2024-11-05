const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');

describe('DeleteReplyUseCase', () => {
  it('should orchestrating the delete reply action correctly', async () => {
    const credentialId = 'user-1';
    const threadId = 'thread-1';
    const commentId = 'comment-1';
    const replyId = 'reply-1';

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(threadId, commentId, replyId, credentialId);

    expect(mockThreadRepository.verifyThreadExist)
      .toHaveBeenCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExist)
      .toHaveBeenCalledWith(threadId, commentId);
    expect(mockReplyRepository.verifyReplyExist)
      .toHaveBeenCalledWith(threadId, commentId, replyId);
    expect(mockReplyRepository.verifyReplyOwner)
      .toHaveBeenCalledWith(threadId, commentId, replyId, credentialId);
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(threadId, commentId, replyId);
  });
});
