'use strict';

const Hapi = require('hapi');
const fs = require('fs');
const util = require('util');
const db = require('./heroes.json')
const Inert = require('inert');
const Vision = require('vision');
const HapiSwagger = require('hapi-swagger');
const Joi = require('joi');

// const swaggerOptions = {
//     info: {
//         title: 'Books API Documentation',
//         version: '0.0.1',
//     }
// };

const swaggerOptions = {
    info: {
      title: ' SWAPI Documentation'
      },
    jsonPath: '/documentation.json',
    documentationPath: '/documentation',
    schemes: ['https', 'http'],
};

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'GET',
        path: '/heroes',
        options: {
            validate: {
                headers: {
                    'accept-encoding': Joi.number().min(0)
                }
            },
            description: 'Heroes',
            tags: ['api'],
            handler: (request, h) => {
                return h.response(db);
            }
        }
});

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();