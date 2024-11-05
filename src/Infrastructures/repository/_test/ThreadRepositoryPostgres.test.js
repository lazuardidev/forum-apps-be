const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyThreadExist function', () => {
    it('should throw NotFoundError when thread does not exist or invalid', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const threadId = 'thread-1';

      await expect(threadRepositoryPostgres.verifyThreadExist(threadId))
        .rejects
        .toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread does exist or valid', async () => {
      const threadId = 'thread-11';
      const owner = 'user-1';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: threadId, owner });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      await expect(threadRepositoryPostgres.verifyThreadExist(threadId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('addThread function', () => {
    it('should persist new thread and return added thread correctly', async () => {
      const newThread = new NewThread({
        title: 'test title',
        body: 'test body',
      });
      const fakeIdGenerator = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });

      await threadRepositoryPostgres.addThread(newThread, credentialId);

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-1');
      expect(threads).toHaveLength(1);
      expect(threads[0].id).toEqual('thread-1');
      expect(threads[0].owner).toEqual(credentialId);
      expect(threads[0].title).toEqual('test title');
      expect(threads[0].body).toEqual('test body');
    });

    it('should return added thread correctly', async () => {
      const newThread = new NewThread({
        title: 'test title',
        body: 'test body',
      });
      const fakeIdGenerator = () => '1';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);
      const credentialId = 'user-1';
      await UsersTableTestHelper.addUser({ id: credentialId, username: 'dicoding' });

      const addedThread = await threadRepositoryPostgres.addThread(newThread, credentialId);

      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-1',
        title: 'test title',
        owner: 'user-1',
      }));
    });
  });

  describe('getThreadById function', () => {
    it('should return thread detail based on thread id correctly', async () => {
      const owner = 'user-1';
      await UsersTableTestHelper.addUser({ id: owner, username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-1', title: 'test title', body: 'test body', date: '2024-11-03T10:24:06.873Z', owner,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const threadDetail = await threadRepositoryPostgres.getThreadById('thread-1');

      expect(threadDetail).toStrictEqual({
        id: 'thread-1',
        title: 'test title',
        body: 'test body',
        date: '2024-11-03T10:24:06.873Z',
        username: 'dicoding',
      });
    });
  });
});
