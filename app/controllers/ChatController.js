angular.module('myApp')
    .controller('ChatController',
      ($scope, socket) => {
        $scope.sendMessage = (message) => {
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
      });
