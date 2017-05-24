angular
    .module('myApp', ['validation.match', 'ui.router'])
    .config(($locationProvider, $stateProvider) => {
    // UI-Router, defines the routes
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
          templateUrl: 'templates/chat/group.html',
          params: { room: null },
        })
        .state('channel', {
          url: '/channels/{roomId}',
          templateUrl: 'templates/chat/channel.html',
          params: { room: null },
        })
          .state('contact', {
              url: '/contacts/{roomId}',
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
        })
          .state('home.settings', {
              url: '/settings',
              templateUrl: 'templates/home/settings.html',
          });

      $locationProvider.html5Mode(true).hashPrefix('');
    })

    // SocketIO initialization
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
