angular.module('myApp')
    .controller('ContactController',
        ($scope, socket, $http) => {
            $scope.searchContact = (information) => {
                $scope.userFound = false;
                $scope.userNotFound = false;
                $http.get(`http://localhost:3000/api/contacts?contactEmail=${information.contactEmail}`)
                    .then((user) => {
                        console.log(user);
                        console.log(user.data);
                        if(user.data != null) {
                            $scope.userFound = user.data;
                        } else {
                            console.log('bonjour');
                            $scope.userNotFound = true;
                        }
                    })

            };
            $scope.addContact = () => {
                $http.post('http://localhost:3000/api/contacts', {
                    contactId: $scope.userFound._id,
                    userId: $scope.user._id
                })
                    .then((response) => {
                        console.log(response);
                    })
            }
        });
