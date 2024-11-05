const AddedThread = require('../AddedThread');

describe('a AddedThread entities', () => {
  it('should create addedThread object correctly', () => {
    const payload = {
      id: 'thread-1',
      title: 'testing',
      owner: 'user-1',
    };

    const addedThread = new AddedThread(payload);

    expect(addedThread.id).toEqual(payload.id);
    expect(addedThread.title).toEqual(payload.title);
    expect(addedThread.owner).toEqual(payload.owner);
  });

  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'thread-1',
      title: 'test title',
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      title: 'testing',
      owner: true,
    };

    expect(() => new AddedThread(payload)).toThrowError('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
