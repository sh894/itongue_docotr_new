(function(angular) {
	angular.module('myapp')
		.controller('homeCtrl', function($scope, $http, $state, $stateParams, $timeout) {
			var infoexist = JSON.parse(localStorage.getItem("userinfo"));
			$scope.doctorinfo = infoexist;
			if(infoexist.name.length == 0) {
				$scope.infocomplete = true;
			} else {
				$scope.infocomplete = false;
			}
			$scope.nolist=false;
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
			// 跳转登录
			$scope.go = function() {
					$state.go('login')
				}
				// 登出
			$scope.loginout = function() {
				localStorage.removeItem("userinfo");
				$scope.infoexist = false;
				$scope.admin = false;
			}
			
			$scope.list = [1, 2, 3, 4, 5]

			$scope.currentindex = 0;
			var date = new Date();
			var d = date.getDate();
			var m = date.getMonth();
			var y = date.getFullYear();
			$scope.eventSources = [];
			$scope.events=[];
			//calendar1111111111111//
			var getevent = function() {
				var time_now = new Date();
				var time=  Date.parse(time_now)
				$http({
					method: 'GET',
					url: uri + "/AllDateList?email="+$scope.doctorinfo.email,
					header: 'Content-Type:application/json'
				}).success(function(data, status) {
					console.log(data);
					if(data.code == '0') {
						var arr1=data.data[0].appointmenttime;
						var arr2=data.data[0].avaliabletime;
						var j=0;
						for(var i=0;i<arr2.length;i++){
							if(time<arr2[i].end){
								$scope.events[j]=arr2[i];
								j++;
							}						
						}
						for(var i=0;i<arr1.length;i++){
							$scope.events.push(arr1[i])
						}
						console.log($scope.events);
					} else {
//						alert(data.data);
						console.log(data.data);
					}
				}).error(function() {
					console.log("Login Fail!");
				});
			}
			getevent();
			var gethistorylist = function() {			
				$http({
					method: 'GET',
					url: uri + "/AllAppointmentList?email="+$scope.doctorinfo.email,
					header: 'Content-Type:application/json'
				}).success(function(data, status) {
					console.log(data);
					if(data.code == '0') {
						$scope.historylist=data.data;

						for(var i=0;i<$scope.historylist.length;i++){
							
							var t1=moment($scope.historylist[i].scheduletime).format('LL').substr(0,9);
							var t2=parseInt(moment($scope.historylist[i].scheduletime).format().substr(11,2));
							var t3=t2+1						
							$scope.historylist[i].scheduletime=t1+t2.toString()+":00-"+t3.toString()+":00"
						}
					} else {
//						alert(data.data);
						console.log(data.data);
					}
				}).error(function() {
					console.log("Login Fail!");
				});
			}
			gethistorylist();

			var todayappointlist = function() {			
				$http({
					method: 'GET',
					url: uri + "/TodayAppointmentList?email="+$scope.doctorinfo.email,
					header: 'Content-Type:application/json'
				}).success(function(data, status) {
					console.log(data);
					if(data.code == '0') {
						$scope.todayappointlist=data.data;
						for(var i=0;i<$scope.todayappointlist.length;i++){
							var t1=moment($scope.todayappointlist[i].scheduletime).format('LL').substr(0,9);
							var t2=parseInt(moment($scope.todayappointlist[i].scheduletime).format().substr(11,2));
							var t3=t2+1						
							$scope.todayappointlist[i].scheduletime=t1+t2.toString()+":00-"+t3.toString()+":00"
						}
					} else {
						$scope.nolist=true;
					}
				}).error(function() {
					console.log("Login Fail!");
				});
			}
			todayappointlist();
			


			$scope.uiConfig = {
				calendar: {
					height: 700,
					editable: true,
					header: {
						left: 'title',
						center: '',
						right: 'today prev,next'
					},
					defaultView: 'agendaWeek',
					//				eventClick: $scope.alertEventOnClick,
					eventDrop: $scope.alertOnDrop,
					eventResize: $scope.alertOnResize,

					//					dayClick: function(date, allDay, jsEvent, getView) {
					//						console.log(jsEvent)
					//					},
					eventClick: function(event) {
						console.log(event)
						if(event.type == 1) {
							Toast("病人预约不可取消")
						} else {
							for(var i = 0; i < $scope.events.length; i++) {
								if($scope.events[i].id == Date.parse(event.start)) {
									$scope.events.splice(i, 1);
								}
							}
							$http({
								method: 'POST',
								url: uri + "/delresttime",
								data: {
									"email": $scope.doctorinfo.email,
									"avaliabletime": Date.parse(event.start)
								},
								header: 'Content-Type:application/json'
							}).success(function(data, status) {
								console.log(data);
								if(data.code == '0') {
									console.log("Setting Success");
								} else {
//									alert(data.data);
									console.log(data.data);
								}
							}).error(function() {
								console.log("Login Fail!");
							});
						}
					},
					//设置是否可被单击或者拖动选择
					selectable: true,
					//点击或者拖动选择时，是否显示时间范围的提示信息，该属性只在agenda视图里可用
					selectHelper: true,
					select: function(start, end) {
						console.log($scope.events)
						if(end - start == 3600000) {
							$scope.events.push({
								id: Date.parse(start),
								title: 'Avaliable',
								start: start,
								end: end,
								type: 0,
								backgroundColor: "green"
							})
							$http({
								method: 'POST',
								url: uri + "/setresttime",
								data: {
									"email": $scope.doctorinfo.email,
									"avaliabletime": Date.parse(start)
								},
								header: 'Content-Type:application/json'
							}).success(function(data, status) {
								console.log(data);
								if(data.code == '0') {
									console.log("设置成功");
								} else {
									alert(data.data);
								}
							}).error(function() {
								console.log("登陆失败!");
							});
						} else {
							Toast(" Available time should be one hour, please sliding for one hour!");
						}

					},
					events: $scope.events

				}
			};
			
			$scope.postinfo={
								
			}
						
			$scope.goselfinfo=function(){
				$state.go("selfinfo");
			}
			
			$scope.changetab = function(index) {
				$scope.currentindex = index;
				for(var i = 0; i < 5; i++) {
					document.getElementById('tab' + i).className = "";
				}
				document.getElementById('tab' + index).className = "active";
			}
			
			$scope.logout=function(){
				$state.go("login")
			}
			
		});
})(angular);