const LikeCommentRepository = require('../../Domains/likes/LikeCommentRepository');

class LikeCommentRepositoryPostgres extends LikeCommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async verifyLikeExist(threadId, commentId, credentialId) {
    const query = {
      text: 'SELECT 1 FROM likes_comment WHERE thread_id = $1 AND comment_id = $2 AND owner = $3',
      values: [threadId, commentId, credentialId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      return false;
    }

    return true;
  }

  async addLike(threadId, commentId, credentialId) {
    const id = `like-${this._idGenerator()}`;
    const date = new Date().toISOString();

    const query = {
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, commentId, date, credentialId],
    };

    await this._pool.query(query);
  }

  async deleteLike(threadId, commentId, credentialId) {
    const query = {
      text: 'DELETE FROM likes_comment WHERE thread_id = $1 AND comment_id = $2 AND owner = $3',
      values: [threadId, commentId, credentialId],
    };

    await this._pool.query(query);
  }

  async getLikesByThreadId(threadId) {
    const query = {
      text: `SELECT likes_comment.comment_id, COUNT(likes_comment.id)::INTEGER AS like_count
             FROM likes_comment
             WHERE likes_comment.thread_id = $1
             GROUP BY likes_comment.comment_id
             ORDER BY likes_comment.comment_id ASC`,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = LikeCommentRepositoryPostgres;
