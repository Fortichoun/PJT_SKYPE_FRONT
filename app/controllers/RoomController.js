angular.module('myApp')
    .controller('RoomController',
      ($scope, socket, $http) => {
        $scope.rooms = [];
        $http.get('http://localhost:3000/api/rooms')
                .then((response) => {
                  $scope.rooms = response.data;
                });
        $scope.selectRoom = (room) => {
          $scope.room = room;
          $http.get(`http://localhost:3000/api/rooms/messages?room=${room._id}`)
                    .then((response) => {
                      $scope.messages = response.data;
                    });
        };
        $scope.createRoom = (information) => {
          $http.post('http://localhost:3000/api/rooms', {
            roomName: information.roomName,
            user: $scope.user._id,
          })
                 .then((response) => {
                   $scope.room = response.data.room;
                   $scope.rooms.push(response.data.room);
                 });
        };
      });
