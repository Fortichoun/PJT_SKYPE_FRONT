angular
    .module('myApp', [])
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
