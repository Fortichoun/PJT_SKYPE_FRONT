angular.module('myApp')
    .controller('RoomController',
      ($scope, socket, $http) => {
        angular.element(() => {
          $http.get(`http://localhost:3000/api/rooms?userId=${$scope.user._id}&typeOfRoom=${window.location.pathname.substring(6)}`)
                .then((response) => {
                  $scope.rooms = response.data;
                });
        });
        $scope.createRoom = (information) => {
          $http.post('http://localhost:3000/api/rooms', {
            roomName: information.roomName,
            user: $scope.user._id,
            typeOfRoom: window.location.pathname.substring(6),
          })
                 .then((response) => {
                   $scope.room = response.data.room;
                   $scope.rooms.push(response.data.room);
                 });
        };
      });