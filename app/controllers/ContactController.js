angular.module('myApp')
    .controller('ContactController',
        ($scope, socket, $http) => {
        $scope.information = {};
            $scope.message = '';
            $scope.searchContact = (information) => {
                $scope.message = '';
                $http.get(`http://localhost:3000/api/contacts?contactEmail=${information.contactEmail}`)
                    .then((user) => {
                        if(user.data != null) {
                            $scope.userFound = user.data;
                            $scope.userFound._id === $scope.user._id ? $scope.message = "It's you!" : '';
                            $scope.user.friendRequestSent.find((contact) => {
                                if ($scope.userFound._id === contact._id) {
                                    $scope.message = "You already sent a request to this user";
                                }
                                });
                            $scope.user.contacts.find((contact) => {
                                if ($scope.userFound._id === contact._id) {
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
            $scope.addContact = () => {
                $http.post('http://localhost:3000/api/contacts', {
                    contactId: $scope.userFound._id,
                    userId: $scope.user._id
                })
                    .then((response) => {
                        $scope.notYouOrFriend = false;
                        $scope.message = "The request has been successfully sent";
                        $scope.$parent.$parent.user = response.data;
                    })
            };
        });
