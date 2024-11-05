const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    const useCasePayload = {
      content: 'test content',
    };

    const mockAddedReply = new AddedReply({
      id: 'reply-1',
      content: useCasePayload.content,
      owner: 'user-1',
    });

    const mockReplyRepository = new ReplyRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.verifyCommentExist = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(mockAddedReply));

    const getAddReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const credentialId = 'user-1';
    const threadId = 'thread-1';
    const commentId = 'comment-1';

    const addedReply = await getAddReplyUseCase.execute(
      threadId,
      commentId,
      useCasePayload,
      credentialId,
    );

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.verifyCommentExist).toBeCalledWith(threadId, commentId);
    expect(addedReply).toStrictEqual(new AddedReply({
      id: 'reply-1',
      content: useCasePayload.content,
      owner: 'user-1',
    }));
    expect(mockReplyRepository.addReply).toBeCalledWith(threadId, commentId, new NewReply({
      content: useCasePayload.content,
    }), credentialId);
  });
});
