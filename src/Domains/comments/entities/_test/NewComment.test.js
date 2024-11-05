const NewComment = require('../NewComment');

describe('a NewComment entities', () => {
  it('should create newComment object correctly', () => {
    const payload = {
      content: 'test content',
    };

    const newComment = new NewComment(payload);

    expect(newComment.content).toEqual(payload.content);
  });

  it('should throw error when payload did not contain needed property', () => {
    const payload = {};

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: 123,
    };

    expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
