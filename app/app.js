angular
    .module('myApp', ['ngRoute', 'ngPassword', 'validation.match'])
    .config(($routeProvider, $locationProvider) => {
      $locationProvider.html5Mode(true).hashPrefix('');
      $routeProvider
            .when('/', {
              templateUrl: 'templates/login.html',
              // controller: 'controllers/ChatController'
            })
            .when('/home', {
              templateUrl: 'templates/home.html',
              // controller: 'controllers/ChatController'
            })
          .otherwise({
            redirectTo: '/',
          });
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
