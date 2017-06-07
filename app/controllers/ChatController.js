angular.module('myApp')
    // This controller handle the emission of a new message
    // & retrieve the messages in your conversations from DB
    .controller('ChatController',
      ($scope, socket, $http, $rootScope, $state, $stateParams, HOST_CONFIG) => {
        $scope.room = $stateParams.room;
        let tokenEnterRoom = 0;
          // After the DOM elements has been loaded, do the API call
        angular.element(() => {
              // Retrieve from the DB every messages in the conversation you've been through
          $http.get(`http://${HOST_CONFIG.url}:3000/api/rooms/messages?room=${$scope.room._id}`)
              .then((response) => {
                $scope.messages = response.data;
              });
            $http.get(`http://${HOST_CONFIG.url}:3000/api/rooms/usersInRoom?room=${$scope.room._id}`)
                .then((response) => {
                    $scope.room = response.data;
                    if (window.location.hash.substring(2,10) === 'channels') {
                        $scope.room.users.find((user) => {
                            if (user._id._id !== $scope.user._id && tokenEnterRoom === 0) {
                                tokenEnterRoom++;
                                $http.post(`http://${HOST_CONFIG.url}:3000/api/rooms/addContact`, {
                                    roomId: $scope.room._id,
                                    contactId: $scope.user._id
                                })
                                    .then((response) => {
                                        $scope.room = response.data;
                                    });
                            }
                        });
                    }
                });
            $http.get(`http://${HOST_CONFIG.url}:3000/api/contacts/allContacts?user=${$scope.user._id}`)
                .then((user) => {
                    $scope.user = user.data;
                });
                // .then(() => {
                //     $scope.isUserInRoom = (user) => {
                //         $scope.user.contacts.map((u) => {
                //             if (u._id.hasOwnProperty('userName') && user._id.hasOwnProperty('userName')) {
                //                 console.log('hey');
                //                 console.log(u);
                //             }
                //         });
                //     };
                // })
            // console.log(window.location.hash.substring(2,10));
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
          if (message.user._id === $scope.user._id) $scope.message = '';
        });
          $scope.optionSelected = (selectOption) => {
              if (selectOption.selectOption === '1') {
                  $http.post(`http://${HOST_CONFIG.url}:3000/api/rooms`, {
                      roomName: `Private conversation between ${$scope.user.userName} and ${selectOption.contact._id.userName}`,
                      user: $scope.user._id,
                      typeOfRoom: window.location.hash.substring(7),
                      usersInRoom: [selectOption.contact._id._id],
                  })
                      .then((response) => {
                          $scope.room = response.data;
                          $state.go('contact', {roomId: response.data._id, room: response.data});
                      });
              }
              else if (selectOption.selectOption === '2') {
                  $scope.contactProfile = selectOption.contact._id;
                  selectOption.selectOption = "";
                  $('#myModal').modal()
              }
              else if (selectOption.selectOption === '3') {
                  $http.post(`http://${HOST_CONFIG.url}:3000/api/contacts/remove`, {
                      userId: $scope.user._id,
                      contactId: selectOption.contact._id._id
                  })
                      .then((response) => {
                          $scope.user = response.data;
                      })
              }
          };
          $scope.addContactToRoom = (contact) => {
              $http.post(`http://${HOST_CONFIG.url}:3000/api/rooms/addContact`, {
                  roomId: $scope.room._id,
                  contactId: contact._id
              })
                  .then((response) => {
                      $scope.room = response.data;
                  });
          };
          $scope.leaveRoom = () => {
              $http.post(`http://${HOST_CONFIG.url}:3000/api/rooms/quit`, {
                  roomId: $scope.room._id,
                  userId: $scope.user._id
              })
                  .then((response) => {
                      $scope.room = response.data;
                      $state.go(`home.${$scope.room.typeOfRoom}`);
                  });
          }
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
