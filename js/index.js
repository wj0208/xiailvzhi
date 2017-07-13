var app = angular.module("kafanla", ['ng', 'ngRoute', 'ngAnimate']);
app.config(function ($routeProvider) {
    $routeProvider.when('/start', {
        templateUrl: 'tpl/start.html',
        controller: 'startCtrl'
    }).when('/main', {
        templateUrl: 'tpl/main.html',
        controller: 'mainCtrl'
    }).when('/detail/:did', {
        templateUrl: 'tpl/detail.html',
        controller: 'detailCtrl'
    }).when('/personal', {
        templateUrl: 'tpl/personal.html',
        controller: 'personalCtrl'
    }).when('/order/:did', {
        templateUrl: 'tpl/order.html',
        controller: 'orderCtrl'
    }).otherwise({redirectTo: '/start'})
})
app.controller('startCtrl',['$scope',function ($scope) {
    
}])
app.controller('parentCtrl', ['$scope', '$location' ,function ($scope, $location) {
    $scope.jump = function (url) {
        $location.path(url)
    }
    $scope.$on('$routeChangeSuccess', function () {
        if ($location.path() == '/start') {
            $scope.hide = true;
        } else {
            $scope.hide = false;
        }
    });
}])
app.controller('mainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.hasmore = true;
    $http.get('data/dish_getbypage.php?start=0').success(function (data) {
        $scope.menulists = data;
    })
    $scope.loadMore = function () {
        $http.get('data/dish_getbypage.php?start=' + $scope.menulists.length).success(function (data) {
            $scope.menulists = $scope.menulists.concat(data);
            if (data.length < 5) {
                $scope.hasmore = false;
            }
        })
    }
    $scope.$watch('kw', function () {
        if ($scope.menulists) {
            $http.get('data/dish_getbykw.php?kw=' + $scope.kw).success(function (data) {
                $scope.menulists = data;
            })
        }
    })
}])
app.controller('detailCtrl', ['$scope','$routeParams','$http', function ($scope,$routeParams,$http) {
    $scope.dishid = $routeParams.did;
    $http.get('data/dish_getbyid.php?id=' +$scope.dishid).success(function (data) {
        $scope.dish = data[0];
    })
}])
app.controller('orderCtrl', ['$scope','$routeParams','$http', function ($scope,$routeParams,$http) {
    $scope.orderList={"did":$routeParams.did};
    $scope.submitOrder = function () {
        $scope.args= $.param($scope.orderList);
        sessionStorage.setItem("phone",$scope.orderList.phone);
        $http.get('data/order_add.php?'+$scope.args).success(function (data) {
            if(data[0].msg == "succ"){
                $scope.msgBox = "购买成功！您的订单编号为："+data[0].oid+"。您可以在用户中心查看订单状态。"
            }else{
                $scope.errBox = "购买失败！"
            }
        })
    }
}])
app.controller('personalCtrl', ['$scope','$http', function ($scope,$http) {
    if(sessionStorage.getItem("phone")){
        $http.get('data/order_getbyphone.php?phone='+sessionStorage.getItem("phone")).success(function (data) {
            $scope.myOrders = data;
        })
    }else{
        $scope.emptyBox = "亲，您暂时没有任何订单哟，去商店看看吧^_^"
    }
}])


