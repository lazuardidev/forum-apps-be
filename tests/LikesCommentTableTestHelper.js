/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesCommentTableTestHelper = {
  async addLike({
    id = 'like-1', threadId = 'thread-1', commentId = 'comment-1', date = '2024-11-03T10:24:06.873Z', owner = 'user-1',
  }) {
    const query = {
      text: 'INSERT INTO likes_comment VALUES($1, $2, $3, $4, $5)',
      values: [id, threadId, commentId, date, owner],
    };

    await pool.query(query);
  },

  async findLikesByCommentId(id) {
    const query = {
      text: 'SELECT * FROM likes_comment WHERE comment_id = $1',
      values: [id],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes_comment WHERE 1=1');
  },
};

module.exports = LikesCommentTableTestHelper;
