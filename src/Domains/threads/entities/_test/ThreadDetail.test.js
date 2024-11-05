const ThreadDetail = require('../ThreadDetail');

describe('ThreadDetail entities', () => {
  it('should create threadDetail entities correctly', () => {
    const payload = {
      id: 'thread-1',
      title: 'test title',
      body: 'test body',
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
      comments: [],
    };

    const threadDetail = new ThreadDetail(payload);

    expect(threadDetail.id).toEqual(payload.id);
    expect(threadDetail.title).toEqual(payload.title);
    expect(threadDetail.body).toEqual(payload.body);
    expect(threadDetail.date).toEqual(payload.date);
    expect(threadDetail.username).toEqual(payload.username);
    expect(threadDetail.comments).toEqual(payload.comments);
  });

  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      title: 'test title',
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload not meet data type specification', () => {
    const payload = {
      id: 'thread-1',
      title: 123,
      body: true,
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
      comments: [],
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw error when payload comments is not an array', () => {
    const payload = {
      id: 'thread-1',
      title: 'test title',
      body: 'test body',
      date: '2024-11-03T10:24:06.873Z',
      username: 'dicoding',
      comments: 'comments',
    };

    expect(() => new ThreadDetail(payload)).toThrowError('THREAD_DETAIL.COMMENTS_NOT_ARRAY');
  });
});
