(function(angular) {
	angular.module('myapp')
		.controller('selfinfoCtrl', function($scope, $http, $state, $stateParams, $timeout) {
			var infoexist = JSON.parse(localStorage.getItem("userinfo"));
			$scope.doctorinfo = infoexist;

			$scope.check = ["Female", "Male"]

			function Toast(msg, duration) {
				duration = isNaN(duration) ? 3000 : duration;
				var m = document.createElement('div');
				m.innerHTML = msg;
				m.style.cssText = "width: 25%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: absolute;top: 40%;left: 40%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
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

			$scope.postinfo = {
				"email": $scope.doctorinfo.email,
				"headimg": $scope.doctorinfo.headimg,
				"gender":$scope.doctorinfo.gender,
				"age":$scope.doctorinfo.age,
				"clinic":$scope.doctorinfo.clinic,
				"department": $scope.doctorinfo.department,
				"name": $scope.doctorinfo.name,
				"telephone":parseInt($scope.doctorinfo.telephone),
				"specialist":$scope.doctorinfo.specialist,
				"link":$scope.doctorinfo.link,
				"introduction":$scope.doctorinfo.introduction				
			}
			$scope.gohome=function(){
				$state.go("home")
			}
			/**************上传图片************/
			/********上传图片********/

			var fileinput = document.getElementById("one-input");

			fileinput.addEventListener("change", function() {
				var file = fileinput.files;
				$scope.img_upload(file);
			});

			$scope.reader = new FileReader(); //创建一个FileReader接口
			$scope.form = { //用于绑定提交内容，图片或其他数据
				image: {},
			};
			$scope.thumb = {}; //用于存放图片的base64

			$scope.img_upload = function(files) { //单次提交图片的函数
				console.log("3333", files[0])
				$scope.reader.readAsDataURL(files[0]); //FileReader的方法，把图片转成base64
				$scope.reader.onload = function(ev) {
					$scope.$apply(function() {
						$scope.thumb[$scope.postinfo.headimg] = {
							imgSrc: ev.target.result, //接收base64
						}
					});
				};
				var token;
				var fd = new FormData(); //以下为像后台提交图片数据
				fd.append('file', files[0]);
				fd.append('key', 'food/' + $scope.doctorinfo.email);
				console.log("1111", files[0])
				console.log("123", $scope.doctorinfo.email);
				$http.get("http://www.handsomebird.cn:5000/" + 'getUptoken?key=food/' + $scope.doctorinfo.email)
					.success(function(data) {
						console.log
						token = data.uptoken;
						//已获得服务器给的上传秘钥token
						fd.append('token', data.uptoken);
						$http({
							method: 'POST',
							url: 'http://up.qiniu.com',
							data: fd,
							pathName: 'food/' + $scope.doctorinfo.email,
							headers: {
								'Content-Type': undefined
							},
							transformRequest: angular.identity
						}).success(function(data) {
							$scope.postinfo.headimg = "http://ofnxiqa6o.bkt.clouddn.com/food/" + $scope.doctorinfo.email;
							alert("Upload success");
						}).error(function(err, status) {
							console.log(err)
							alert("Upload fail, please check the network！");
						});
					}).error(function() {
						alert("Upload fail, please check the network！");
					});
			};

			$scope.Submit = function() {
				$http({
					method: 'POST',
					url: uri + "/selfinfo",
					data: $scope.postinfo,
					header: 'Content-Type:application/json'
				}).success(function(data, status) {
					console.log(data);
					if(data.code == '0') {
						console.log($scope.postinfo)
						alert("Update success!")
						$http({
							method: 'GET',
							url: uri + "/getinfo?email="+$scope.doctorinfo.email,
							header: 'Content-Type:application/json'
						}).success(function(data, status) {
							console.log(data);
							if(data.code == '0') {
								localStorage.setItem("userinfo", JSON.stringify(data.data));
								console.log("Update success!");
							} else {
								alert(data.data);
							}
						}).error(function() {
							console.log("Login fail!");
						});
					} else {
						alert(data.data);
					}
				}).error(function() {
					console.log("Login fail!");
				});

			}
		});
})(angular);