const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should create newThread object correctly', () => {
    const payload = {
      title: 'test title',
      body: 'test body',
    };

    const newThread = new NewThread(payload);

    expect(newThread.title).toEqual(payload.title);
    expect(newThread.body).toEqual(payload.body);
  });

  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      title: 'test title',
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      title: 'test title',
      body: 123,
    };

    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
