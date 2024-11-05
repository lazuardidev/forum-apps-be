const AddedComment = require('../AddedComment');

describe('a AddedComment entities', () => {
  it('should create addedComment object correctly', () => {
    const payload = {
      id: 'comment-1',
      content: 'test content',
      owner: 'user-1',
    };

    const addedComment = new AddedComment(payload);

    expect(addedComment.id).toEqual(payload.id);
    expect(addedComment.content).toEqual(payload.content);
    expect(addedComment.owner).toEqual(payload.owner);
  });

  it('should throw error when payload did not contain needed property', () => {
    const payload = {
      id: 'comment-1',
      content: 'test content',
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      id: 1,
      content: 'test content',
      owner: true,
    };

    expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
});
