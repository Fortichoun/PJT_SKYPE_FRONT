angular.module('myApp')
    .controller('Hello', ['$scope', 'socket',
      function ($scope, socket) {
        $scope.sendMessage = function (message) {
          socket.emit('newMessage', {
            message,
            user: $scope.user,
            room: $scope.room.name,
          });
        };
        socket.on('messageCreated', (message) => {
          $scope.messages.push(message);
          $scope.message = '';
        });
      }]);
