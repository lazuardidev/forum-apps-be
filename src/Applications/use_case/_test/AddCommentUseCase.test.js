const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    const useCasePayload = {
      content: 'test content',
    };

    const mockAddedComment = new AddedComment({
      id: 'comment-1',
      content: useCasePayload.content,
      owner: 'user-1',
    });

    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment));

    const getAddCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const credentialId = 'user-1';
    const threadId = 'thread-1';

    const addedComment = await getAddCommentUseCase.execute(threadId, useCasePayload, credentialId);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
    expect(addedComment).toStrictEqual(new AddedComment({
      id: 'comment-1',
      content: useCasePayload.content,
      owner: 'user-1',
    }));
    expect(mockCommentRepository.addComment).toBeCalledWith(threadId, new NewComment({
      content: useCasePayload.content,
    }), credentialId);
  });
});
