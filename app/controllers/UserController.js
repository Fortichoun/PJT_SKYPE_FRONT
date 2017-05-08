angular.module('myApp')
    .controller('UserController',
      ($scope, $http, $location) => {
        $scope.information = {};
        $scope.credentials = {};
        $scope.errorMessage = '';
        $scope.errorSaveMessage = '';

        $scope.login = (loginForm) => {
          if (loginForm.$valid) {
            $http.post('http://localhost:3000/api/authenticate', {
              email: $scope.credentials.email,
              password: $scope.credentials.password,
            })
              .then((response) => {
                if (response.data.success) {
                  $scope.user = response.data.user;
                  $scope.token = response.data.token;
                  $location.path('/home');
                } else {
                  $scope.errorMessage = 'Sorry, wrong credentials.';
                }
              });
          }
        };
        $scope.register = (registerForm) => {
          if (registerForm.$valid) {
            $http.post('http://localhost:3000/api/register', {
              userName: $scope.information.userName,
              email: $scope.information.email,
              password: $scope.information.password,
              picture: $scope.information.picture,
              birthDate: $scope.information.dateOfBirth,
              bio: $scope.information.bio,
            })
              .then((response) => {
                if (response.data.success) {
                  $scope.user = response.data.user;
                  $scope.token = response.data.token;
                  $location.path('/home');
                } else {
                  $scope.errorSaveMessage = response.data.message;
                }
              });
          }
        };
      });
