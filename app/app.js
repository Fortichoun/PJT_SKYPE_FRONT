angular
    .module('myApp', ['ngRoute', 'ngPassword', 'validation.match', 'ui.router'])
    .config(($routeProvider, $locationProvider, $stateProvider) => {
      $stateProvider
        .state('login', {
          url: '/',
          templateUrl: 'templates/login.html',
        })
        .state('home', {
          url: '/home',
          templateUrl: 'templates/home.html',
        })
        .state('home.groups', {
          url: '/groups',
          templateUrl: 'templates/home/groups.html',
        })
        .state('group', {
          url: '/groups/{roomId}',
          templateUrl: 'templates/chat.html',
          params: { room: null },
            // controller: 'ChatController'
        })
        .state('home.channels', {
          url: '/channels',
          templateUrl: 'templates/home/channels.html',
        })
        .state('home.contacts', {
          url: '/contacts',
          templateUrl: 'templates/home/contacts.html',
        });

      $locationProvider.html5Mode(true).hashPrefix('');
      // $routeProvider
      //       .when('/', {
      //         templateUrl: 'templates/login.html',
      //         // controller: 'controllers/ChatController'
      //       })
      //       .when('/home', {
      //         templateUrl: 'templates/home.html',
      //         // controller: 'controllers/ChatController'
      //       })
      //     .when('/home/groups', {
      //         templateUrl: 'templates/groups.html',
      //         // controller: 'controllers/ChatController'
      //     })
      //     .otherwise({
      //       redirectTo: '/',
      //     });
    })
    .factory('socket', ($rootScope) => {
      const socket = io.connect('localhost:3000');
      return {
        on(eventName, callback) {
          socket.on(eventName, (...args) => {
            $rootScope.$apply(() => {
              callback.apply(socket, args);
            });
          });
        },
        emit(eventName, data, callback) {
          socket.emit(eventName, data, (...args) => {
            $rootScope.$apply(() => {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          });
        },
      };
    });
