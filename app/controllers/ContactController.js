angular.module('myApp')
    .controller('ContactController',
        ($scope, socket, $http, $state, HOST_CONFIG) => {
          $scope.information = {};
          $scope.message = '';
            // This call intend to bind every _id in user.contacts, user.friendRequestSent
            // and user.friendRequestReceived to real user object
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
            // This function handle the "Search for this user" button
            // It'll try to retrieve the email you gave in DB
            $scope.searchContact = (information) => {
                $scope.message = '';
                $scope.notYouOrFriend = false;
                $http.get(`http://${HOST_CONFIG.url}:3000/api/contacts?contactEmail=${information.contactEmail}`)
                    .then((user) => {
                        if(user.data != null) {
                            $scope.userFound = user.data;
                            $scope.userFound._id === $scope.user._id ? $scope.message = "It's you!" : '';
                            $scope.user.friendRequestSent.find((contact) => {
                                if ($scope.userFound._id === contact._id._id) {
                                    $scope.message = "You already sent a request to this user";
                                }
                                });
                            $scope.user.contacts.find((contact) => {
                                if ($scope.userFound._id === contact._id._id) {
                                    $scope.message = "User already in your contacts";
                                }
                            });
                            if (!$scope.message) {
                                $scope.notYouOrFriend = true;
                            }
                        } else {
                            $scope.message = "We didn't find the user";
                        }
                    })
            };
            // This function handle the 'Add to contact' button when a valid email is found
            $scope.addContact = () => {
                $http.post(`http://${HOST_CONFIG.url}:3000/api/contacts`, {
                    contactId: $scope.userFound._id,
                    userId: $scope.user._id
                })
                    .then((response) => {
                        $scope.notYouOrFriend = false;
                        $scope.message = "The request has been successfully sent";
                        $scope.user = response.data;
                    })
            };
            // This function handle the 'Accept' button on friend request received
            $scope.acceptContact = (invitationId) => {
                $http.post(`http://${HOST_CONFIG.url}:3000/api/contacts/accept`, {
                    userId: $scope.user._id,
                    invitationId
                })
                    .then((response) => {
                        $scope.user = response.data;
                    })
            };
            // This function handle the 'Reject' button on friend request received
            $scope.refuseContact = (invitationId) => {
                $http.post(`http://${HOST_CONFIG.url}:3000/api/contacts/refuse`, {
                    userId: $scope.user._id,
                    invitationId
                })
                    .then((response) => {
                    $scope.user = response.data;
                    })
            };

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
        });