angular.module('myApp')
    .controller('ContactController',
        ($scope, socket, $http) => {
          $scope.information = {};
          $scope.message = '';
          $scope.searchContact = (information) => {
            $scope.message = '';
            // This call intend to bind every _id in user.contacts, user.friendRequestSent
            // and user.friendRequestReceived to real user object
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
            // This function handle the "Search for this user" button
            // It'll try to retrieve the email you gave in DB
            $scope.searchContact = (information) => {
                $scope.message = '';
                $scope.notYouOrFriend = false;
                $http.get(`http://localhost:3000/api/contacts?contactEmail=${information.contactEmail}`)
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
                $http.post('http://localhost:3000/api/contacts', {
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
                $http.post('http://localhost:3000/api/contacts/accept', {
                    userId: $scope.user._id,
                    invitationId
                })
                    .then((response) => {
                        $scope.user = response.data;
                    })
            };
            // This function handle the 'Reject' button on friend request received
            $scope.refuseContact = (invitationId) => {
                $http.post('http://localhost:3000/api/contacts/refuse', {
                    userId: $scope.user._id,
                    invitationId
                })
                    .then((response) => {
                    $scope.user = response.data;
                    })
            };
        });