'use strict';

// import module
const Hapi = require('@hapi/hapi');
const Inert = require("@hapi/inert");
const path = require('path');
const Connection = require('./dbconfig');
const User = require('./model/user');


const init = async () => {

    // setup server
    const server = Hapi.Server({
        host: 'localhost',
        port: 888,
        routes : {
            files : {
                relativeTo: path.join(__dirname, 'static')
            }
        }
    });

    // setup plugin untnuk server ini
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

    // konfigurasi server khusus view engine (handlebars)
    server.views({
        engines:{
            hbs: require('handlebars')
        },
        path: path.join(__dirname, 'views'),
        layout: 'default'
    })

    // contoh basic route
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, h) => {
            return `hello world`;
        }
    });

    // define route
    server.route([

        // segmen dinamis (misal: xxx/user/2)
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

        // menerima query parameter di url nya (misal: xxx/product?id=5)
        {
            method: 'GET',
            path: '/product',
            handler: (request, h) => {
                if (request.query.name) {
                    return `hello ${request.query.name}`;
                } else {
                    return `hello product`;
                }
            }
        },

        // redirect route
        {
            method: 'GET',
            path: '/home',
            handler: (request, h) => {
                return h.redirect('/');
            }
        }, 

        // handle 404 not found route
        {
            method: 'GET',
            path: '/{any*}',
            handler: (request, h) => {
                return `oops.. page not found`;
            }
        },

        // tes plugin (contoh di sini location, setup ada di atas)
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

        // return view
        {
            method: 'GET',
            path: '/welcome',
            handler: (request, h) => {
                return h.file('welcome.html');
            }    
        },

        // return download file
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

        // post method
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
            // tambahan option jika dipanggil dari API
            options: {
                payload: {
                    multipart: true
                }
            }  
        },

        // view dinamis handlebars (hbs)
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

        // query ke DB (get)
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

        // query ke DB (save)
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
        },

        // query ke DB (update)
        {
            method: 'POST',
            path: '/manage-update',
            handler: async (request, h) => {
                //User.createUser(request.payload.name);
                const update = await Connection.raw2(`
                    UPDATE user SET USER_NAME = ? WHERE USER_ID = ?
                `, ["Badroll", 1]);
                console.log(update);

                return h.redirect('/manage-get');
            },
            options: {
                payload: {
                    multipart: true
                }
            }  
        }

    ]);



    // start server
    await server.start();
    console.log(`server started on : ${server.info.uri}`);

}

// exception log
process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
/*
    - download semua modul dan plugin
    - run dengan command : nodemon -e hbs,js server.js
*/

/*Happy with Hapi<3*/