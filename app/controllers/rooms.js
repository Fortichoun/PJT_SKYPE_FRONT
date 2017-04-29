angular.module('myApp')
    .controller('Rooms', ['$scope', 'socket', '$http',
      function ($scope, socket, $http) {
        $scope.rooms = [];
        $http.get('http://localhost:3000/quotes')
                .then((response) => {
                  $scope.rooms = response.data;
                });
        $scope.selectRoom = function (room) {
          $scope.room = room;
          socket.emit('switchRoom', {
            newRoom: room,
            username: $scope.username,
          });
          $http.get(`http://localhost:3000/quotes/messages?room=${room.name}`)
                    .then((response) => {
                      $scope.messages = response.data;
                    });
        };
      }]);
