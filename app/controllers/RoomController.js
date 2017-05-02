angular.module('myApp')
    .controller('RoomController',
      ($scope, socket, $http) => {
        $scope.rooms = [];
        $http.get('http://localhost:3000/api/quotes')
                .then((response) => {
                  $scope.rooms = response.data;
                });
        $scope.selectRoom = (room) => {
          $scope.room = room;
          socket.emit('switchRoom', {
            newRoom: room,
            username: $scope.username,
          });
          $http.get(`http://localhost:3000/api/quotes/messages?room=${room.name}`)
                    .then((response) => {
                      $scope.messages = response.data;
                    });
        };
      });
