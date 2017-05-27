angular.module('myApp')
    // This controller handle the emission of a new message
    // & retrieve the messages in your conversations from DB
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
        });
          // This function emit a new message using SocketIO
        $scope.sendMessage = (message) => {
          socket.emit('newMessage', {
            message,
            user: $scope.user,
            room: $scope.room,
            createdAt: new Date(),
          });
        };
        // At the reception of a new message
        socket.on('messageCreated', (message) => {
          $scope.messages.push(message);
          $scope.message = '';
        });
      })
    .filter('enclosing', () => function (input) {
      const bold = {
        reg: /\*(.+?)\*/g,
        name: 'bold',
      };
      const underline = {
        reg: /(?!:[a-z]+?)_(.+?)_(?![a-z]+?:)/g,
        name: 'underline',
      };
      const strike = {
        reg: /~(.+?)~/g,
        name: 'strike',
      };
      const italic = {
        reg: /(?!(<a).*?)(\/(?!span|(.*?(<\/a>|a>)).*?).*?\/)(?!.*?(<\/a>|a>))/g,
        name: 'italic',
      };
      let result = setNewClass(italic, input);
      result = setNewClass(underline, result);
      result = setNewClass(bold, result);
      return setNewClass(strike, result);

      function setNewClass(style, input) {
        const result = input.replace(style.reg, `<span class="${style.name}">$&</span>`);
        return result.replace(style.reg, cropEncloser);
      }
      function cropEncloser(match) {
        return match.slice(1, -1);
      }
    });
