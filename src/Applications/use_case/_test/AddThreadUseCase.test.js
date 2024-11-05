const NewThread = require('../../../Domains/threads/entities/NewThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const AddThreadUseCase = require('../AddThreadUseCase');

describe('AddThreadUseCase', () => {
  it('should orchestrating the add thread action correctly', async () => {
    const useCasePayload = {
      title: 'test title',
      body: 'test body',
    };

    const mockAddedThread = new AddedThread({
      id: 'thread-1',
      title: useCasePayload.title,
      owner: 'user-1',
    });

    const mockThreadRepository = new ThreadRepository();
    mockThreadRepository.addThread = jest.fn(() => Promise.resolve(mockAddedThread));

    const getAddThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const credentialId = 'user-1';
    const addedThread = await getAddThreadUseCase.execute(useCasePayload, credentialId);

    expect(addedThread).toStrictEqual(new AddedThread({
      id: 'thread-1',
      title: useCasePayload.title,
      owner: 'user-1',
    }));
    expect(mockThreadRepository.addThread).toBeCalledWith(new NewThread({
      title: useCasePayload.title,
      body: useCasePayload.body,
    }), credentialId);
  });
});
