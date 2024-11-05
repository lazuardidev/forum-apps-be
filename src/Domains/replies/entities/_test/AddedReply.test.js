const AddedReply = require('../AddedReply');

describe('a AddedReply entities', () => {
  it('should create addedReply object correctly', () => {
    const payload = {
      id: 'reply-1',
      content: 'test content',
      owner: 'user-1',
    };

    const addedReply = new AddedReply(payload);

    expect(addedReply.id).toEqual(payload.id);
    expect(addedReply.content).toEqual(payload.content);
    expect(addedReply.owner).toEqual(payload.owner);
  });

  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'reply-1',
      content: 'test content',
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 123,
      content: 'test content',
      owner: true,
    };

    expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
