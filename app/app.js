const myApp = angular.module('myApp', []);

myApp.factory('socket', ($rootScope) => {
  const socket = io.connect('localhost:3000');

  return {
    on(eventName, callback) {
      socket.on(eventName, function () {
        const args = arguments;
        $rootScope.$apply(() => {
          callback.apply(socket, args);
        });
      });
    },
    emit(eventName, data, callback) {
      socket.emit(eventName, data, function () {
        const args = arguments;
        $rootScope.$apply(() => {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    },
  };
});
