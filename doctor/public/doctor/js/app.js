var app = angular.module('myapp', ['ui.router','ngMessages','ui.calendar'])

//var uri = "http://www.handsomebird.cn:5000";
//var uri = "http://www.handsomebird.cn:3000";
var uri="http://127.0.0.1:3000"
var imgurl = "http://ofnxiqa6o.bkt.clouddn.com"



app.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise('/login');
	$stateProvider
		.state('home', {    //  主页
			url: '/home',
			templateUrl: 'template/home.html',
			controller: 'homeCtrl'
		})
		.state('login', { 
			url: '/login',
			templateUrl: 'template/login.html',
			controller: 'loginCtrl'
		})
		.state('register', { 
			url: '/register',
			templateUrl: 'template/register.html',
			controller: 'registerCtrl'
		})
		.state('selfinfo', { 
			url: '/selfinfo',
			templateUrl: 'template/selfinfo.html',
			controller: 'selfinfoCtrl'
		})


});