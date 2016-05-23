/*$http({method: 'GET', url: 'www.google.com/someapi', headers: {
    'Authorization': 'Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ=='}
});*/


(function(angular) {
  'use strict';
angular.module('menusifuPay', ['ngRoute', 'ngAnimate','pascalprecht.translate','LocalStorageModule'])
.directive('iscrollDirective', iscrollDirective)
.config(function($routeProvider, $locationProvider,$translateProvider) {
       var translationsEN = {
  ComfirmPayment: 'Comfirm Payment',
  EditPayment: 'Modify Amount',
  Back: 'Back',
  Cancel: 'Cancel',
  English: '中  文',
  Amount: 'Amount',
  Split: 'Split/Modify',
  Recipient: 'Recipient',
  AddTips: 'Add Tips',
  PayOK:"Comfirm Payment",
  Pay: 'Pay',
  GoDutch:"Go Dutch",
  OK:"OK",
  SplitA:"Evenly Split to",
  SplitB:"Orders,You'll pay $",
  SplitC:"",
  EditAmount:"Other Amount",
  ModifyAmountTo:"Modify Amount To：",
  Tips:"TIPS:",
  OrderSum:"sum",
  NoTips:"No Tips",
  PersonCount:"All Count",
  ThisTimeAmount:"This Time Amount",
  HaveTips:"Have Tips",
  Average:"Average Amount",
  Other:"other"
};
 
var translationsZH= {
  ComfirmPayment: '支付',
  EditPayment: '修改金额',
  Back: '返回',
  Cancel: '取消',
  English: 'English',
  Amount: '用餐金额',
  Split: '分单/修改',
  Recipient: '收款人',
  AddTips: '添加小费',
  PayOK:"确认支付",
  Pay: '支 付',
  GoDutch:"平均分单",
  OK:"确 认",
   SplitA:"你将和",
  SplitB:"人平分本单，需要支付金额",
  SplitC:"美元",
  EditAmount:"手动修改",
  ModifyAmountTo:"修改金额为：",
  Tips:"小费金额:",
  OrderSum:"本单小计",
  NoTips:"不加小费",
  PersonCount:"总人数",
  ThisTimeAmount:"本次消费金额",
   HaveTips:"已包含小费",
   Average:"每单均额",
    Other:"其它金额"

};

$translateProvider.translations('en',translationsEN);
$translateProvider.translations('zh',translationsZH);
$translateProvider.preferredLanguage('en');
   $routeProvider
        .when('/a', {
          templateUrl: 'order.html',
          controller: 'OrderCtrl'
          
        })
        .when('/split', {
          templateUrl: 'split.html',
          controller: 'SplitCtrl',
          
        })
        /*.otherwise({ redirectTo: '/a'});*/
         .otherwise('/a');

        /*.otherwise(
          '/Book',
        {
         templateUrl: 'book.html',
          controller: 'BookCtrl'
        });
*/
       $locationProvider.html5Mode(true);


  })
 .filter('format2', function () {
  return function (data, scope) {

    return  toFixed(data,2);
  };
})
 .filter('formatAmount', function () {
  return function (data, scope) {
     var result=data.value;
     var key=data.key;
     if(!!Number(result) && !!key){
 
      result=toFixed(result*parseFloat(scope.config.Amount),2);
     }

    return  result;
  };
})
  .controller('MainCtrl', 
    function($route, $routeParams, $location, $scope,$http,$translate,localStorageService) {
      $scope.config={};
      $scope.config.Amount="4.51";
      $scope.config.money=$scope.config.Amount;
      $scope.config.tempAmount="";
      $scope.config.back="Cancel";
      $scope.config.number=1;
      $scope.config.count=1;
      $scope.config.selfTips=10;
      $scope.config.oneAmout=$scope.config.Amount;
      $scope.config.getAmout=$scope.config.Amount;
      $scope.config.keyboard=[
      '1','2','3','4','5','6','7','8','9','.','0','×'
      ]
      $scope.config.keyboardShow=false;
      $scope.config.dutch=true;
      $scope.config.tipsList=[
        {key:"Tips",value:"",active:false},{key:"(15%)",value:"0.15",active:false},{key:"(18%)",value:"0.18",active:false},{key:"(20%)",value:"0.2",active:false},{key:"",value:"",active:false},
        {key:"",value:"NoTips",active:false},{key:"",value:"",active:false},{key:"",value:"",active:false}
        ];
  $scope.config.language=!!localStorageService.get("wechatPayLanguage")?localStorageService.get("wechatPayLanguage"):"en";
   $translate.use($scope.config.language);
     $scope.language=function(){
      $scope.stop();
       $scope.config.language=($scope.config.language=="en")?"zh":"en";
         $translate.use($scope.config.language);
         localStorageService.set("wechatPayLanguage",$scope.config.language);
        }

         $scope.back=function(){
          if($scope.config.back=="Cancel"){

          }else{
             $location.path("/pay/")
             $scope.config.keyboardShow=false;
             $scope.config.back="Cancel";
          }
         }
         $scope.add=function(){
          if($scope.config.number<99){
           $scope.config.number++;  
           $scope.config.oneAmout=toFixed($scope.config.Amount/$scope.config.number,2);
           $scope.config.getAmout=toFixed($scope.config.oneAmout*$scope.config.count,2);
          }
          
         }
          $scope.sub=function(){
            if($scope.config.number>1){
            $scope.config.number--;    
             $scope.config.oneAmout=toFixed($scope.config.Amount/$scope.config.number,2);
             $scope.config.getAmout=toFixed($scope.config.oneAmout*$scope.config.count,2);
            }
          
         }
         $scope.pay=function(){

         }
         $scope.inputAmount=function(e){
            $scope.stop();
            var v=e.target.innerText;
            if(v=="×"){
              var vv=$scope.config.tipsList[6].value;
              if(vv.length>0){
                $scope.config.tipsList[6].value=vv.substring(0,vv.length-1);
              }
            }else{

              var vv=$scope.config.tipsList[6].value;
              
              if(vv.indexOf(".")==-1 || v !="."){
               $scope.config.tipsList[6].value+=v;  
              }
            }
            
         
         }
         $scope.backPay=function(){
          $location.path("pay/a")
          if(!$scope.config.dutch){
          $scope.config.money=$scope.config.tempAmount;
          }else{
          $scope.config.money=$scope.config.getAmout;  
          }
          
          
         }
         $scope.stop=function(){
        
          var e = event || window.event;
        if(e && e.preventDefault) { 
        　e.preventDefault(); 
        } else { 
        window.event.returnValue = false; 
        } 
        
        if (e && e.stopPropagation ) 
        e.stopPropagation(); 
        else
        window.event.cancelBubble = true; 
         }
        $scope.changeTip=function(index){
          $scope.stop();
         

          $scope.config.keyboardShow=false;
           if(index!=0 && index !=4){
           
           angular.forEach($scope.config.tipsList,function(v,k){
                 v.active=false;
                  if(k==index){
                    v.active=true;

                  }
           })
            if(index==6){
              $scope.config.keyboardShow=true;
            }else{
              $scope.config.tipsList[6].value="";
            }
         }
        }
      this.$route = $route;
      this.$location = $location;
      this.$routeParams = $routeParams;
    
  })
  .controller('OrderCtrl', function($routeParams,$scope) {

  })
  .controller('SplitCtrl', function($routeParams,$scope) {
    $scope.config.back="Back";
    $scope.config.keyboardShow=false;
    this.name = "ChapterCtrl";
    this.params = $routeParams;
  $scope.test123=function(){
        alert("MainCtrl-test123")
      }
      $scope.test234=function(e){
      alert("MainCtrl-test234");
    }

    $scope.inputAmount=function(e){
            if(!$scope.config.dutch){
            var v=e.target.innerText;
            if(v=="x"){
              var vv=$scope.config.tempAmount;
              if(vv.length>0){
                $scope.config.tempAmount=vv.substring(0,vv.length-1);
              }
            }else{

              var vv=$scope.config.tempAmount;
              
              if(vv.indexOf(".")==-1 || v !="."){
               $scope.config.tempAmount+=v;  
              }
            }
            }else{
              alert(e.target.innerText)
            }
         
         }


  });
iscrollDirective.$inject = ['$timeout'];
function iscrollDirective($timeout) {
    return {
        restrict:'A',
        link: function ($scope, element, attrs) {
            $timeout(function(){
                console.log('#'+element.attr('id'));
                var iscrollwrapper = new IScroll('#'+element.attr('id'), {
                    scrollX: true,
                    scrollY: true,
                    mouseWheel: false,
                    scrollbars: false,
                    useTransform: false,
                    useTransition: false,
                    eventPassthrough: false,
                    click: true 
                });
                iscrollwrapper.refresh();
            })
        }
    }
};
})(window.angular);

 function test123(n){
  var element = document.querySelector('[ng-controller="BookCtrl"]');
   var scope = element.scope();
   scope.test234();


 }
 function book(){
  var el = document.getElementById('bookId');
var ngEl = angular.element(el);
var scope = ngEl.scope();
scope.test234();
scope.test123();
loaded();

 }



function toFixed(num, s) {
var times = Math.pow(10, s)
if(!!parseFloat(num)){
var des = num * times + 0.5
des = parseInt(des, 10) / times
return des
}else{
return 0;
}
}
document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);