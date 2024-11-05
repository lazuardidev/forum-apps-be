const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');

describe('GetThreadByIdUseCase', () => {
  it('should orchestrating the get thread by id action correctly', async () => {
    const mockThreadDetail = {
      id: 'thread-1',
      title: 'test title',
      body: 'test body',
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
    };
    const mockComments = {
      id: 'comment-1',
      username: 'dicoding',
      date: '2024-11-03T10:24:06.873Z',
      content: 'test content',
      is_delete: false,
    };
    const mockReplies = {
      id: 'reply-1',
      content: 'test content',
      date: '2024-11-03T10:24:06.873Z',
      username: 'johndoe',
      is_delete: false,
      comment_id: 'comment-1',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve([mockComments]));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve([mockReplies]));
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const threadId = 'thread-1';

    const getThreadById = await getThreadByIdUseCase.execute(threadId);

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(threadId);
    expect(getThreadById).toStrictEqual(new ThreadDetail({
      id: 'thread-1',
      title: 'test title',
      body: 'test body',
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-1',
          username: 'dicoding',
          date: '2024-11-03T10:24:06.873Z',
          replies: [
            {
              id: 'reply-1',
              content: 'test content',
              date: '2024-11-03T10:24:06.873Z',
              username: 'johndoe',
            },
          ],
          content: 'test content',
        },
      ],
    }));
  });

  it('should modify content if comment is marked as deleted', () => {
    const deletedComment = {
      id: 'comment-1',
      username: 'dicoding',
      date: '2024-11-03T10:24:06.873Z',
      content: 'test content',
      is_delete: true,
    };

    const useCase = new GetThreadByIdUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    const mappedComment = useCase._mapComment(deletedComment);

    expect(mappedComment.content).toBe('**komentar telah dihapus**');
  });

  it('should modify content if reply is marked as deleted', () => {
    const deletedReply = {
      id: 'reply-1',
      content: 'test content',
      date: '2024-11-03T10:24:06.873Z',
      username: 'johndoe',
      is_delete: true,
    };

    const useCase = new GetThreadByIdUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    const mappedReply = useCase._mapReply(deletedReply);

    expect(mappedReply.content).toBe('**balasan telah dihapus**');
  });

  it('should return an empty array for comments with no replies', async () => {
    const mockComment = {
      id: 'comment-1',
      username: 'dicoding',
      date: '2024-11-03T10:24:06.873Z',
      content: 'test content',
      is_delete: false,
    };

    const mockThreadDetail = {
      id: 'thread-1',
      title: 'test title',
      body: 'test body',
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.verifyThreadExist = jest.fn().mockResolvedValue();
    mockCommentRepository.getCommentsByThreadId = jest.fn().mockResolvedValue([mockComment]);
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockResolvedValue([]);
    mockThreadRepository.getThreadById = jest.fn().mockResolvedValue(mockThreadDetail);

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const getThreadById = await getThreadByIdUseCase.execute('thread-1');

    expect(getThreadById.comments[0].replies).toEqual([]);
  });
});
