const LikesCommentTableTestHelper = require('../../../../tests/LikesCommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeCommentRepositoryPostgres = require('../LikeCommentRepositoryPostgres');

describe('LikeCommentRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesCommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyLikeExist function', () => {
    it('should return false when like does not exist', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const credentialId = 'user-1';

      const result = await likeCommentRepositoryPostgres.verifyLikeExist(
        threadId,
        commentId,
        credentialId,
      );

      expect(result).toBe(false);
    });

    it('should return true when like exists', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await LikesCommentTableTestHelper.addLike({ threadId, commentId, owner: credentialId });

      const result = await likeCommentRepositoryPostgres.verifyLikeExist(
        threadId,
        commentId,
        credentialId,
      );

      expect(result).toBe(true);
      const likes = await LikesCommentTableTestHelper.findLikesByCommentId(commentId);
      expect(likes).toHaveLength(1);
      expect(likes[0].thread_id).toEqual(threadId);
      expect(likes[0].comment_id).toEqual(commentId);
      expect(likes[0].owner).toEqual(credentialId);
    });
  });

  describe('addLike function', () => {
    it('should add like to database', async () => {
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      const fakeIdGenerator = () => '1';
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, fakeIdGenerator);

      await likeCommentRepositoryPostgres.addLike(threadId, commentId, credentialId);

      const likes = await LikesCommentTableTestHelper.findLikesByCommentId(commentId);
      expect(likes).toHaveLength(1);
      expect(likes[0].id).toEqual('like-1');
      expect(likes[0].thread_id).toEqual(threadId);
      expect(likes[0].comment_id).toEqual(commentId);
      expect(likes[0].owner).toEqual(credentialId);
    });
  });

  describe('deleteLike function', () => {
    it('should delete like from database', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await LikesCommentTableTestHelper.addLike({ threadId, commentId, owner: credentialId });

      await likeCommentRepositoryPostgres.deleteLike(threadId, commentId, credentialId);

      const likes = await LikesCommentTableTestHelper.findLikesByCommentId(commentId);
      expect(likes).toHaveLength(0);
    });
  });

  describe('getLikesByThreadId function', () => {
    it('should return likes based on thread id correctly', async () => {
      const likeCommentRepositoryPostgres = new LikeCommentRepositoryPostgres(pool, {});
      const threadId = 'thread-1';
      const commentId = 'comment-1';
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });
      await LikesCommentTableTestHelper.addLike({ threadId, commentId, owner: credentialId });

      const likes = await likeCommentRepositoryPostgres.getLikesByThreadId(threadId);

      expect(likes).toHaveLength(1);
      expect(likes[0].comment_id).toEqual(commentId);
      expect(likes[0].like_count).toEqual(1);
    });
  });
});
