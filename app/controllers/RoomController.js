angular.module('myApp')
    // This controller handle the room's creation & retrieve all group / channel / private chat the user is in
    .controller('RoomController',
      ($scope, socket, $http) => {
        // After the DOM elements has been loaded, do the API call
        angular.element(() => {
            // Retrieve from the DB the group / channel / private chat the user is in
          $http.get(`http://localhost:3000/api/rooms?userId=${$scope.user._id}&typeOfRoom=${window.location.pathname.substring(6)}`)
                .then((response) => {
                  $scope.rooms = response.data;
                });
            $http({
                    method: 'GET',
                    url: 'http://localhost:3000/api/contacts/allContacts',
                    params: {
                        user: $scope.user._id,
                    }
                }
            )
                .then((user) => {
                    $scope.user = user.data;
                });
        });
        // Handle the creation of a new group / channel / private chat in base
        $scope.createRoom = (information) => {
            console.log($scope);
            if ($scope.RoomForm.$invalid === false) {
                const usersInRoom = [];
                angular.forEach(information.selected, function (value, key) {
                    if (value === true) usersInRoom.push(key);
                });
                $http.post('http://localhost:3000/api/rooms', {
                    roomName: information.roomName,
                    user: $scope.user._id,
                    typeOfRoom: window.location.pathname.substring(6),
                    usersInRoom,
                })
                    .then((response) => {
                        $scope.information.roomName = '';
                        $scope.room = response.data.room;
                        $scope.rooms.push(response.data.room);
                    });
            }
        };
      });
