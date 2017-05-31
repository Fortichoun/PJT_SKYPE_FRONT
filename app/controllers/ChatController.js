angular.module('myApp')
    // This controller handle the emission of a new message & retrieve the messages in your conversations from DB
    .controller('ChatController',
      ($scope, socket, $http, $rootScope, $stateParams) => {
        $scope.room = $stateParams.room;
          // After the DOM elements has been loaded, do the API call
        angular.element(() => {
              // Retrieve from the DB every messages in the conversation you've been through
          $http.get(`http://localhost:3000/api/rooms/messages?room=${$scope.room._id}`)
              .then((response) => {
                $scope.messages = response.data;
              });
            $http.get(`http://localhost:3000/api/rooms/usersInRoom?room=${$scope.room._id}`)
                .then((response) => {
                    $scope.room = response.data;
                });
        });
          // This function emit a new message using SocketIO
        $scope.sendMessage = (message) => {
          socket.emit('newMessage', {
            message,
            user: $scope.user,
            room: $scope.room,
            createdAt: new Date()
          });
        };
        // At the reception of a new message
        socket.on('messageCreated', (message) => {
          $scope.messages.push(message);
          $scope.message = '';
        });
      });
