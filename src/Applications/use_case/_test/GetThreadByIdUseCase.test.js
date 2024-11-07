const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const LikeCommentRepository = require('../../../Domains/likes/LikeCommentRepository');
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

    const mockComments = [
      {
        id: 'comment-1',
        username: 'dicoding',
        date: '2024-11-03T10:24:06.873Z',
        content: 'test content',
        is_delete: false,
      },
    ];

    const mockReplies = [
      {
        id: 'reply-1',
        content: 'test content',
        date: '2024-11-03T10:24:06.873Z',
        username: 'johndoe',
        is_delete: false,
        comment_id: 'comment-1',
      },
    ];

    const mockLikeCounts = [
      {
        comment_id: 'comment-1',
        like_count: 2,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn(() => Promise.resolve());
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(mockReplies));
    mockLikeCommentRepository.getLikesByThreadId = jest.fn(() => Promise.resolve(mockLikeCounts));
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    const getThreadDetail = await getThreadByIdUseCase.execute('thread-1');

    expect(mockThreadRepository.verifyThreadExist).toBeCalledWith('thread-1');
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-1');
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith('thread-1');
    expect(mockLikeCommentRepository.getLikesByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-1');
    expect(getThreadDetail).toStrictEqual(new ThreadDetail({
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
          likeCount: 2,
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

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    const mappedComment = getThreadByIdUseCase._mapComment(deletedComment);

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

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: {},
      commentRepository: {},
      replyRepository: {},
    });

    const mappedReply = getThreadByIdUseCase._mapReply(deletedReply);

    expect(mappedReply.content).toBe('**balasan telah dihapus**');
  });

  it('should return an empty array for comments with no replies', async () => {
    const mockThreadDetail = {
      id: 'thread-1',
      title: 'test title',
      body: 'test body',
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'dicoding',
        date: '2024-11-03T10:24:06.873Z',
        content: 'test content',
        is_delete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn().mockResolvedValue();
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockResolvedValue([]);
    mockLikeCommentRepository.getLikesByThreadId = jest.fn().mockResolvedValue([]);
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    const getThreadDetail = await getThreadByIdUseCase.execute('thread-1');

    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith('thread-1');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockLikeCommentRepository.getLikesByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-1');
    expect(getThreadDetail.comments[0].replies).toStrictEqual([]);
  });

  it('should map likeCount for each comment', async () => {
    const mockThreadDetail = {
      id: 'thread-1',
      title: 'test title',
      body: 'test body',
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'dicoding',
        date: '2024-11-03T10:24:06.873Z',
        content: 'test content',
        is_delete: false,
      },
      {
        id: 'comment-11',
        username: 'johndoe',
        date: '2024-11-03T10:24:06.873Z',
        content: 'another test content',
        is_delete: false,
      },
    ];

    const mockLikeCounts = [
      {
        comment_id: 'comment-1',
        like_count: 2,
      },
      {
        comment_id: 'comment-11',
        like_count: 5,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn().mockResolvedValue();
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockResolvedValue([]);
    mockLikeCommentRepository.getLikesByThreadId = jest.fn(() => Promise.resolve(mockLikeCounts));
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    const getThreadDetail = await getThreadByIdUseCase.execute('thread-1');

    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith('thread-1');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockLikeCommentRepository.getLikesByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-1');
    expect(getThreadDetail.comments[0].likeCount).toBe(2);
    expect(getThreadDetail.comments[1].likeCount).toBe(5);
  });

  it('should return 0 likeCount for comments that has not been liked yet', async () => {
    const mockThreadDetail = {
      id: 'thread-1',
      title: 'test title',
      body: 'test body',
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
    };

    const mockComments = [
      {
        id: 'comment-1',
        username: 'dicoding',
        date: '2024-11-03T10:24:06.873Z',
        content: 'test content',
        is_delete: false,
      },
    ];

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();
    const mockLikeCommentRepository = new LikeCommentRepository();

    mockThreadRepository.verifyThreadExist = jest.fn().mockResolvedValue();
    mockCommentRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(mockComments));
    mockReplyRepository.getRepliesByThreadId = jest.fn().mockResolvedValue([]);
    mockLikeCommentRepository.getLikesByThreadId = jest.fn().mockResolvedValue([]);
    mockThreadRepository.getThreadById = jest.fn(() => Promise.resolve(mockThreadDetail));

    const getThreadByIdUseCase = new GetThreadByIdUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
      likeCommentRepository: mockLikeCommentRepository,
    });

    const getThreadDetail = await getThreadByIdUseCase.execute('thread-1');

    expect(mockThreadRepository.verifyThreadExist).toHaveBeenCalledWith('thread-1');
    expect(mockCommentRepository.getCommentsByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockReplyRepository.getRepliesByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockLikeCommentRepository.getLikesByThreadId).toHaveBeenCalledWith('thread-1');
    expect(mockThreadRepository.getThreadById).toHaveBeenCalledWith('thread-1');
    expect(getThreadDetail.comments[0].likeCount).toBe(0);
  });
});
