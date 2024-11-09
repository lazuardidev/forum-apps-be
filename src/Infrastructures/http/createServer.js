const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
// eslint-disable-next-line import/no-extraneous-dependencies
const RateLimitor = require('hapi-rate-limitor');
const config = require('../../Commons/config');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');
const threads = require('../../Interfaces/http/api/threads');
const comments = require('../../Interfaces/http/api/comments');
const replies = require('../../Interfaces/http/api/replies');
const likes = require('../../Interfaces/http/api/likes');

const createServer = async (container) => {
  const server = Hapi.server({
    host: config.app.host,
    port: config.app.port,
  });

  await server.register([
    { plugin: Jwt },
    {
      plugin: RateLimitor,
      options: {
        redis: process.env.REDIS_URL,
        max: 30,
        duration: 60000,
      },
    },
  ]);

  server.auth.strategy('forumapi_jwt', 'jwt', {
    keys: config.jwt.accessTokenKey,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: config.jwt.accessTokenAge,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    { plugin: users, options: { container } },
    { plugin: authentications, options: { container } },
    { plugin: threads, options: { container } },
    { plugin: comments, options: { container } },
    { plugin: replies, options: { container } },
    { plugin: likes, options: { container } },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      const translatedError = DomainErrorTranslator.translate(response);

      if (translatedError instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      if (!translatedError.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'There was a failure on our server.',
      });
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  return server;
};

module.exports = createServer;
