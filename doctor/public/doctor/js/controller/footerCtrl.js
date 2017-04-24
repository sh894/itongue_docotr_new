(function(angular) {
    angular.module('myapp')
        .controller('footerCtrl', function($scope, $http, $state, $stateParams, $timeout) {

            $scope.text = "This is footer";


        });
})(angular);