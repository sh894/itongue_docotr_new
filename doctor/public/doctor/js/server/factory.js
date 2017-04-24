//修改个人信息
app.factory('modifyinfo', function ($http,Toast) {
   	var updateinfo=function(item,content){
				var myinfo = JSON.parse(localStorage.getItem("userinfo"));
				var modifydata={
					"user_id":myinfo._id
				}
				modifydata[item]=content;
				$http({
					method: 'POST',
					url: uri+'/user/setselfinfo',
					data: modifydata,
					header: 'Content-Type:application/json'
				}).success(function(data) {
					console.log(data)
					if(data.code==0){
						myinfo[item]=content;
						localStorage.setItem("userinfo",JSON.stringify(myinfo));					
						Toast.show("更改成功");
					}else{
						Toast.show("更改失败");
					}
				}).error(function(err, status) {
					console.log(err)
				});
			}
 				return updateinfo;
})
//消息提示
app.factory('Toast', function () {
    return {
        show: function (text, time, width) {
            var time = time || 1000;
            var width = width || '160';
            var toast = '<p id="myToast" style="text-align: center;position: absolute;z-index: 1000000;background-color: #000;opacity: 0.7;' +
                'color: #fff;left: 50%;margin-left: -' + width / 2 + 'px;width: ' + width + 'px;border-radius: 10px;padding: 10px;top:50%;margin-top: -25px;">' + text + '</p>'
            var body = angular.element(document.querySelector('body'))
            body.append(toast);
            setTimeout(function () {
                angular.element(document.querySelector('#myToast')).remove()
            }, time)
        }
    }
})