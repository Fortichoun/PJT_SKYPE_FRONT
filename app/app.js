angular
    .module('myApp', ['ngRoute', 'validation.match', 'ui.router', 'angularFileUpload', 'vkEmojiPicker'])
    .constant('HOST_CONFIG', {
    // url: 'localhost',
    url: '79.137.37.194',
    })
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
          templateUrl: 'templates/chat/contact.html',
          params: { room: null },
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

      $locationProvider.hashPrefix('');
      $locationProvider.html5Mode({ requireBase: true});
    })

    // SocketIO initialization
    .factory('socket', ($rootScope, HOST_CONFIG) => {
      const socket = io.connect(`http://${HOST_CONFIG.url}:3000`);
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
