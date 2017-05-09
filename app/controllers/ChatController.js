angular.module('myApp')
    .controller('ChatController',
      ($scope, socket, $http, $rootScope, $stateParams) => {
        $scope.room = $stateParams.room;
          angular.element(function() {
              $http.get(`http://localhost:3000/api/rooms/messages?room=${ $scope.room._id }`)
              .then((response) => {
                  $scope.messages = response.data;
              });
          });
        $scope.sendMessage = (message) => {
          socket.emit('newMessage', {
            message,
            user: $scope.user,
            room: $scope.room,
          });
        };
        socket.on('messageCreated', (message) => {
          $scope.messages.push(message);
          $scope.message = '';
        });
      });
