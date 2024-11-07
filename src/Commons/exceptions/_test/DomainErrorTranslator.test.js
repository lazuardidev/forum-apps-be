const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate various errors correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Cannot create new user because required property is missing.'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Can\'t create new user because data type doesn\'t match.'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('Cannot create new user because username characters exceed limit.'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Must submit username and password.'));
    expect(DomainErrorTranslator.translate(new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Username and password must be string.'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('Must send refresh token.'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Refresh token must be string.'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')))
      .toStrictEqual(new InvariantError('Must send refresh token.'));
    expect(DomainErrorTranslator.translate(new Error('DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Refresh token must be string.'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Cannot add thread because required property is missing.'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Cannot add thread because data type does not match.'));
    expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Cannot create new thread because required property is missing.'));
    expect(DomainErrorTranslator.translate(new Error('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Cannot create new thread because data type does not match.'));
    expect(DomainErrorTranslator.translate(new Error('THREAD_DETAIL.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Cannot view thread details because required property is missing.'));
    expect(DomainErrorTranslator.translate(new Error('THREAD_DETAIL.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Cannot view thread details due to incorrect data type.'));
    expect(DomainErrorTranslator.translate(new Error('THREAD_DETAIL.COMMENTS_NOT_ARRAY')))
      .toStrictEqual(new InvariantError('Can\'t see thread details because comments are not in array form.'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Cannot add comment because required property is missing.'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Can\'t add comment because data type doesn\'t match.'));
    expect(DomainErrorTranslator.translate(new Error('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Cannot create new comment because required property is missing.'));
    expect(DomainErrorTranslator.translate(new Error('NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Cannot create new comment because data type does not match.'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Cannot add reply because required property is missing.'));
    expect(DomainErrorTranslator.translate(new Error('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Cannot add reply because data type does not match.'));
    expect(DomainErrorTranslator.translate(new Error('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY')))
      .toStrictEqual(new InvariantError('Cannot create new reply because required property is missing.'));
    expect(DomainErrorTranslator.translate(new Error('NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('Cannot create new reply because data type does not match.'));
  });

  it('should return original error when error message is not needed to translate', () => {
    const error = new Error('some_error_message');

    const translatedError = DomainErrorTranslator.translate(error);

    expect(translatedError).toStrictEqual(error);
  });
});
