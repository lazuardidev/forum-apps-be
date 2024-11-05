const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyReply function', () => {
    it('should throw NotFoundError when reply does not exist or invalid', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const replyId = 'reply-1';

      await expect(replyRepositoryPostgres.verifyReplyExist(threadId, commentId, replyId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply does exist or valid', async () => {
      const threadId = 'thread-4';
      const commentId = 'comment-1';
      const replyId = 'reply-321';
      const owner = 'user-1';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await RepliesTableTestHelper.addReply({
        id: replyId, threadId, commentId, owner,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(replyRepositoryPostgres.verifyReplyExist(threadId, commentId, replyId))
        .resolves.not.toThrowError(NotFoundError);
      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(replyId);
      expect(replies[0].thread_id).toEqual(threadId);
      expect(replies[0].comment_id).toEqual(commentId);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when the reply does not belong to the user', async () => {
      const replyId = 'reply-1';
      const threadId = 'thread-4';
      const commentId = 'comment-1';
      const credentialId = 'user-1';
      const anotherUser = 'user-2';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: anotherUser, username: 'johndoe' });
      await RepliesTableTestHelper.addReply({
        id: replyId, threadId, commentId, owner: anotherUser,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyReplyOwner(threadId, commentId, replyId, credentialId),
      ).rejects.toThrowError(AuthorizationError);
      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(replyId);
      expect(replies[0].thread_id).toEqual(threadId);
      expect(replies[0].comment_id).toEqual(commentId);
      expect(replies[0].owner).toEqual('user-2');
    });

    it('should not throw AuthorizationError when the reply does belong to the user', async () => {
      const replyId = 'reply-1';
      const threadId = 'thread-4';
      const commentId = 'comment-1';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await RepliesTableTestHelper.addReply({
        id: replyId, threadId, commentId, owner: credentialId,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await expect(
        replyRepositoryPostgres.verifyReplyOwner(threadId, commentId, replyId, credentialId),
      ).resolves.not.toThrowError(AuthorizationError);
      const replies = await RepliesTableTestHelper.findRepliesById(replyId);
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual(replyId);
      expect(replies[0].thread_id).toEqual(threadId);
      expect(replies[0].comment_id).toEqual(commentId);
      expect(replies[0].owner).toEqual(credentialId);
    });
  });

  describe('addReply function', () => {
    it('should persist new reply and return added reply correctly', async () => {
      const threadId = 'thread-11';
      const commentId = 'comment-11';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'test' });
      await CommentsTableTestHelper.addComment({ id: commentId, content: 'testing' });
      const newReply = new NewReply({
        content: 'test content',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      await replyRepositoryPostgres.addReply(threadId, commentId, newReply, credentialId);

      const replies = await RepliesTableTestHelper.findRepliesById('reply-123');
      expect(replies).toHaveLength(1);
      expect(replies[0].id).toEqual('reply-123');
      expect(replies[0].thread_id).toEqual(threadId);
      expect(replies[0].comment_id).toEqual(commentId);
      expect(replies[0].owner).toEqual(credentialId);
      expect(replies[0].content).toEqual('test content');
    });

    it('should return added reply correctly', async () => {
      const threadId = 'thread-11';
      const commentId = 'comment-11';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'test' });
      await CommentsTableTestHelper.addComment({ id: commentId, content: 'testing' });
      const newReply = new NewReply({
        content: 'test content',
      });
      const fakeIdGenerator = () => '1';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const addedReply = await replyRepositoryPostgres.addReply(
        threadId,
        commentId,
        newReply,
        credentialId,
      );

      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-1',
        content: 'test content',
        owner: 'user-1',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should set column is_delete to true from database', async () => {
      const replyRepository = new ReplyRepositoryPostgres(pool);
      const threadId = 'thread-11';
      const commentId = 'comment-11';
      const replyId = 'reply-234';
      const owner = 'user-1';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await RepliesTableTestHelper.addReply({
        id: replyId, threadId, commentId, owner,
      });

      await replyRepository.deleteReply(threadId, commentId, replyId);

      const replyIsDeleted = await RepliesTableTestHelper.findDeletedRepliesById(replyId);
      expect(replyIsDeleted).toHaveLength(1);
      expect(replyIsDeleted[0].is_delete).toBe(true);
    });
  });

  describe('getRepliesByThreadId function', () => {
    it('should return replies based on thread id correctly', async () => {
      const owner = 'user-1';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await RepliesTableTestHelper.addReply({
        id: 'reply-1', threadId: 'thread-1', commentId: 'comment-1', content: 'test content', date: '2024-11-03T10:24:06.873Z', owner, isDelete: false,
      });
      const repliesRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const replies = await repliesRepositoryPostgres.getRepliesByThreadId('thread-1');

      expect(replies).toStrictEqual([{
        id: 'reply-1',
        content: 'test content',
        date: '2024-11-03T10:24:06.873Z',
        username: 'dicoding',
        is_delete: false,
        comment_id: 'comment-1',
      }]);
    });
  });
});
