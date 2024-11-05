const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyCommentExist function', () => {
    it('should throw NotFoundError when comment does not exist or invalid', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const threadId = 'thread-1';
      const commentId = 'comment-1';

      await expect(commentRepositoryPostgres.verifyCommentExist(threadId, commentId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment does exist or valid', async () => {
      const threadId = 'thread-4';
      const commentId = 'comment-3';
      const owner = 'user-1';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentExist(threadId, commentId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when the comment does not belong to the user', async () => {
      const commentId = 'comment-1';
      const threadId = 'thread-4';
      const credentialId = 'user-1';
      const anotherUser = 'user-2';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await UsersTableTestHelper.addUser({ id: anotherUser, username: 'johndoe' });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: anotherUser });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner(threadId, commentId, credentialId))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when the comment does belong to the user', async () => {
      const commentId = 'comment-1';
      const threadId = 'thread-4';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner: credentialId });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await expect(commentRepositoryPostgres.verifyCommentOwner(threadId, commentId, credentialId))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('addComment function', () => {
    it('should persist new comment and return added comment correctly', async () => {
      const threadId = 'thread-11';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'test' });
      const newComment = new NewComment({
        content: 'test content',
      });
      const fakeIdGenerator = () => '1';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      await commentRepositoryPostgres.addComment(threadId, newComment, credentialId);

      const comments = await CommentsTableTestHelper.findCommentsById('comment-1');
      expect(comments).toHaveLength(1);
      expect(comments[0].id).toEqual('comment-1');
      expect(comments[0].thread_id).toEqual(threadId);
      expect(comments[0].owner).toEqual(credentialId);
      expect(comments[0].content).toEqual('test content');
    });

    it('should return added comment correctly', async () => {
      const threadId = 'thread-11';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, title: 'test' });
      const newComment = new NewComment({
        content: 'test content',
      });
      const fakeIdGenerator = () => '1';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const addedComment = await commentRepositoryPostgres.addComment(
        threadId,
        newComment,
        credentialId,
      );

      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-1',
        content: 'test content',
        owner: 'user-1',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should set column is_delete to true from database', async () => {
      const commentRepository = new CommentRepositoryPostgres(pool);
      const threadId = 'thread-11';
      const commentId = 'comment-11';
      const owner = 'user-1';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await CommentsTableTestHelper.addComment({ id: commentId, threadId, owner });

      await commentRepository.deleteComment(threadId, commentId);

      const commentIsDeleted = await CommentsTableTestHelper.findDeletedCommentsById(commentId);
      expect(commentIsDeleted).toHaveLength(1);
      expect(commentIsDeleted[0].is_delete).toBe(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments based on thread id correctly', async () => {
      const owner = 'user-1';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await CommentsTableTestHelper.addComment({
        id: 'comment-1', threadId: 'thread-1', owner, date: '2024-11-03T10:24:06.873Z', content: 'test content', isDelete: false,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const comments = await commentRepositoryPostgres.getCommentsByThreadId('thread-1');

      expect(comments).toStrictEqual([{
        id: 'comment-1',
        username: 'dicoding',
        date: '2024-11-03T10:24:06.873Z',
        content: 'test content',
        is_delete: false,
      }]);
    });
  });
});
