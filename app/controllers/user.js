angular.module('myApp')
    .controller('User', ['$scope',
      function ($scope) {
        $scope.user = 'Default User';
      }]);
