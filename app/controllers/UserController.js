angular.module('myApp')
    // This controller handle the user login/registration
    .controller('UserController',
      ($scope, $http, $location, HOST_CONFIG) => {
        $scope.information = {};
        $scope.credentials = {};
        $scope.errorMessage = '';
        $scope.errorSaveMessage = '';

        // This function is called when the user try to login
        $scope.login = (loginForm) => {
          if (loginForm.$valid) {
            $http.post(`http://${HOST_CONFIG.url}:3000/api/authenticate`, {
              email: $scope.credentials.email,
              password: $scope.credentials.password,
            })
                // If the user exists in base & valid credentials
                // Log him in & give the scope this user
              .then((response) => {
                if (response.data.success) {
                  $scope.user = response.data.user;
                  $scope.credentials = {};
                    $scope.errorMessage = "";
                    $location.path('/home');
                } else {
                  $scope.errorMessage = 'Sorry, wrong credentials.';
                }
              });
          }
        };
        // $scope.uploader = new FileUploader();

          // This function is called when the user try to register
        $scope.register = (registerForm) => {
          if (registerForm.$valid) {
            $http.post(`http://${HOST_CONFIG.url}:3000/api/register`, {
              userName: $scope.information.userName,
              email: $scope.information.email,
              password: $scope.information.password,
              picture: $scope.information.picture,
              birthDate: $scope.information.birthDate,
              bio: $scope.information.bio,
            })
            // If the email doesn't already exist in base
            // Register him then log him in & give the scope this user
              .then((response) => {
                if (response.data.success) {
                  $scope.user = response.data.user;
                  $scope.informations = {};
                    $scope.errorMessage = "";
                    $location.path('/home');
                } else {
                  $scope.errorSaveMessage = response.data.message;
                }
              });
          }
        };

            //This function is called when the user make some modifications
        $scope.modify = (modificationForm) => {
            $scope.modificationMessage = '';
            if (modificationForm.$valid) {
                $http.post(`http://${HOST_CONFIG.url}:3000/api/settings`, {
                    userId: $scope.user._id,
                    newUserName: document.getElementById('userName').value,
                    newBio: document.getElementById('bio').value,
                })
                    .then((response) => {
                    $scope.modificationMessage = "Informations are updated";
                    $scope.user = response.data;
                    });
            }
        };
        $scope.disconnect = () => {
            $scope.user = {};
            $scope.credentials = {};
            $scope.information = {};
          };
        // $scope.forgo tPassword = () => {
        //     $http.post(`http://${HOST_CONFIG.url}:3000/api/settings/forgotten`, {
        //         // userId: $scope.user._id,
        //     }).then((response) => {
        //         console.log($scope.response);
        //     });
        // }
      });
