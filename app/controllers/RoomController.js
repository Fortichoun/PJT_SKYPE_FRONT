angular.module('myApp')
    // This controller handle the room's creation & retrieve all group / channel / private chat the user is in
    .controller('RoomController',
      ($scope, $state, socket, $http, HOST_CONFIG) => {
          $scope.information = {};
          // After the DOM elements has been loaded, do the API call
        angular.element(() => {
            $http({
                    method: 'GET',
                    url: `http://${HOST_CONFIG.url}:3000/api/contacts/allContacts`,
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
            if ($scope.RoomForm.$invalid === false) {
                const usersInRoom = [];
                angular.forEach(information.selected, function (value, key) {
                    if (value === true) usersInRoom.push(key);
                });
                $http.post(`http://${HOST_CONFIG.url}:3000/api/rooms`, {
                    roomName: information.roomName,
                    user: $scope.user._id,
                    typeOfRoom: window.location.hash.substring(7),
                    usersInRoom,
                })
                    .then((response) => {
                        $scope.information = {};
                        information = {};
                        $scope.room = response.data;
                        $state.go($scope.room.typeOfRoom.substring(0, $scope.room.typeOfRoom.length - 1),
                            {roomId: response.data._id, room: response.data});
                    });
            }
        };
          $scope.$on('$locationChangeStart', function(event, toUrl, fromUrl) {
              // Retrieve from the DB the group / channel / private chat the user is in
              $http.get(`http://${HOST_CONFIG.url}:3000/api/rooms?userId=${$scope.user._id}&typeOfRoom=${toUrl.substring(toUrl.lastIndexOf('/') + 1)}`)
                  .then((response) => {
                      $scope.rooms = response.data;
                  });
          });
      });
