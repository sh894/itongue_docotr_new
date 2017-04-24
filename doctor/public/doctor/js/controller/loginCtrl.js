(function(angular) {
	angular.module('myapp')
		.controller('loginCtrl', function($scope, $http, $state, Toast) {
			
			$scope.loginform={
				"email":"",
				"password":""
			}
			
			$scope.login = function() {
				console.log($scope);
				$http({
					method: 'POST',
					url: uri + "/login",
					data: $scope.loginform,
					header: 'Content-Type:application/json'
				}).success(function(data, status) {
					console.log(data);
					if(data.code == '0') {
						alert("Login Success！");
						localStorage.setItem("userinfo", JSON.stringify(data.data));
						$state.go('home');
					} else {
						alert(data.data);
					}
				}).error(function() {
					console.log("Login Fail!");
				});
			};

			$scope.goregister = function() {
				$state.go('register');
			};
		});
})(angular);

(function(angular) {
	angular.module('myapp')
		.controller('registerCtrl', function($scope, $http, $state, Toast) {

	


			function Toast(msg, duration) {
				duration = isNaN(duration) ? 3000 : duration;
				var m = document.createElement('div');
				m.innerHTML = msg;
				m.style.cssText = "width: 20%;min-width: 100px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 40%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
				document.body.appendChild(m);
				setTimeout(function() {
					var d = 0.5;
					m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
					m.style.opacity = '0';
					setTimeout(function() {
						document.body.removeChild(m)
					}, d * 1000);
				}, duration);
			}
			
			$scope.FormData={
				"email":"",
				"password":""
			}
			
			
			$scope.Submit = function() {
				console.log($scope)
				console.log($scope.FormData);
				if(!$scope.FormData.password ||!$scope.FormData.email) {
					Toast("Information incomplete", 500);
				} else if($scope.FormData.password != $scope.FormData.confirmpwd) {
					Toast("Password in-consices!", 500);
				} else {
					$http({
						method: 'POST',
						url: uri + "/register",
						data: $scope.FormData,
						header: 'Content-Type:application/json'
					}).success(function(data, status) {
						console.log(data);
						if(data.code == '0') {
							Toast("Register Success!");
							$state.go('login');
						} else {
							alert(data.data);
						}
					}).error(function() {
						console.log("Login Fail!");
					});
				}
			}
			
			$scope.gologin = function() {
				$state.go('login');
			};
			
		});
})(angular);