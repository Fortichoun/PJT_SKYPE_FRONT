angular.module('myApp')
    .controller('UserController',
      ($scope, $http) => {
        $scope.credentials = {
          email: '',
          password: '',
        };
        $scope.login = (credentials) => {
          $http.get(`http://localhost:3000/api/authenticate?email=${credentials.email}&password=${$scope.credentials.password}`)
              .then((response) => {
                // $scope.rooms = response.data;
              });
        };
      });
