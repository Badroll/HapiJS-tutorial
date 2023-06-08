'use strict';

const Hapi = require('@hapi/hapi');
const Inert = require("@hapi/inert");
const path = require('path');
const Connection = require('./dbconfig');
const User = require('./model/user');


const init = async () => {

    const server = Hapi.Server({
        host: 'localhost',
        port: 888,
        routes : {
            files : {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    });

    await server.register([
        {
            plugin : require("hapi-geo-locate"),
            options : {
                enabledByDefault : true
            }
        },
        {
            plugin : Inert
        },
        {
            plugin : require("@hapi/vision")
        }
    ])

    server.views({
        engines:{
            hbs: require('handlebars')
        },
        path: path.join(__dirname, 'views'),
        layout: 'default'
    })

    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return `hello world`;
        }
    });

    server.route([
        {
            method: 'GET',
            path: '/users/{user?}',
            handler: (request, h) => {
                if (request.params.user) {
                    return `hello ${request.params.user}`;
                } else {
                    return `hello users`;
                }
            }
        },
        {
            method: 'GET',
            path: '/task',
            handler: (request, h) => {
                if (request.query.name) {
                    return `hello ${request.query.name}`;
                } else {
                    return `hello task`;
                }
            }
        },
        {
            method: 'GET',
            path: '/home',
            handler: (request, h) => {
                return h.redirect('/');
            }
        }, 
        {
            method: 'GET',
            path: '/{any*}',
            handler: (request, h) => {
                return `oops.. page not found`;
            }
        },
        {
            method: 'GET',
            path: '/location',
            handler: (request, h) => {
                if(request.location){
                    return request.location;
                }else{
                    return `your location not enabled`
                }
            }
        },
        {
            method: 'GET',
            path: '/welcome',
            handler: (request, h) => {
                return h.file('welcome.html');
            }    
        },
        {
            method: 'GET',
            path: '/download',
            handler: (request, h) => {
                return h.file('welcome.html', {
                    mode: 'attachment',
                    filename: 'welcome-download.html'
                });
            }    
        },
        {
            method: 'POST',
            path: '/login',
            handler: (request, h) => {
                var name = request.payload.name
                if(name){
                    return `hello ${name}`;
                }else{
                    return `hello (no name)`;
                }
            },
            options: {
                payload: {
                    multipart: true
                }
            }  
        },
        {
            method: 'GET',
            path: '/dynamic',
            handler: (request, h) => {
                var data = {
                    name: 'Badrol'
                };
                return h.view('index', data);
            }
        },
        {
            method: 'GET',
            path: '/manage-get',
            handler: async (request, h) => {
                const user = await Connection.raw(`
                    SELECT * FROM user
                `);
                console.log(user[1]);

                var data = {
                    user : user[0]
                }
                return h.view('manage', data);
            }
        },
        {
            method: 'POST',
            path: '/manage-save',
            handler: async (request, h) => {
                //User.createUser(request.payload.name);
                const insert = await Connection.raw(`
                    INSERT INTO USER (USER_NAME) VALUES ('${request.payload.name}')
                `);
                console.log(insert[1]);

                return h.redirect('/manage-get');
            },
            options: {
                payload: {
                    multipart: true
                }
            }  
        }

    ]);



    await server.start();
    console.log(`server started on : ${server.info.uri}`);

}

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();