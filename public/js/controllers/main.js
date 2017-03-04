var app = angular.module('ideaController', ['ui.router'])

	// inject the Idea service factory into our controller
	.controller('mainController', ['$scope','$http','Ideas','$state','Authenticate', 'LoginService', '$timeout', function($scope, $http, Ideas, $state, Authenticate, LoginService, $timeout) {
		$scope.formData = {};
		$scope.loading = true;

		// GET =====================================================================
		// when landing on the page, get all ideas and show them
		// use the service to get all the ideas
		Ideas.get()
			.success(function(data) {
				if(!LoginService.isAuthenticated()) {
      			  $scope.ideas = []; 
      			} else {
				  $scope.ideas = data; 
      			}
				$scope.loading = false;
			});

		// CREATE ==================================================================
		// when submitting the add form, send the text to the node API
		$scope.createIdea = function() {

			// validate the formData to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.formData.text != undefined) {
				$scope.loading = true;

				// call the create function from our service (returns a promise object)
				Ideas.create($scope.formData)

					// if successful creation, call our get function to get all the new ideas
					.success(function(data) {
						$scope.loading = false;
						$scope.formData = {}; // clear the form so our user is ready to enter another
						$scope.ideas = data; // assign our new list of ideas
					});
			}
		};

		// DELETE ==================================================================
		// delete a idea after checking it
		$scope.deleteIdea = function(id) {
			$scope.loading = true;

			Ideas.delete(id)
				// if successful creation, call our get function to get all the new ideas
				.success(function(data) {
					$scope.loading = false;
					$scope.ideas = data; // assign our new list of ideas
				});
		};
}])
.directive('ngConfirmClick', [
				function(){
					return {
						link: function (scope, element, attr) {
							var msg = attr.ngConfirmClick || "Are you sure?";
							var clickAction = attr.confirmedClick;
							element.bind('click',function (event) {
								if ( window.confirm(msg) ) {
									scope.$eval(clickAction)
								}
							});
						}
					};
				}])


.run(function($rootScope, $location, $state, LoginService) {
      if(!LoginService.isAuthenticated()) {
        $state.transitionTo('login');
      }
  })
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    
    $stateProvider
      .state('login', {
        url : '/login',
        templateUrl : 'loginTemplate.html',
        controller : 'LoginController'
      })
      .state('home', {
        url : '/',
        templateUrl : 'domainList.html',
        controller : 'mainController'
      });
  }])
.controller('LoginController', function($scope, $rootScope, $stateParams, $state, LoginService, $timeout) {
    $scope.formSubmit = function() {
		
	LoginService.login($scope)
	$scope.loading = true;
	$timeout(function(){
		$scope.loading = false;
      if(LoginService.isAuthenticated()) {
        $scope.error = '';
        $scope.username = '';
        $scope.password = '';
        $state.go('home');
      } else {
        $scope.error = "Incorrect username/password!";
      }
  		}, 1000);
    };
    
  })
.factory('LoginService', function(Authenticate,$state) {
	var isAuthenticated = false;
    return {
      login: function(scope) {
      	Authenticate.authenticate(scope.loginData).then(function(data) {
      		value = data.data.callback===false? data.data.callback : '"' + data.data.callback + '"';
			localStorage.setItem("token", '{"token":' + value + '}')
        	return isAuthenticated;
        })
      },
      isAuthenticated : function() {
      	if(!localStorage.getItem("token")) {
      		$state.go("login");
      		return false
      	}
        auth=JSON.parse(localStorage.getItem("token")).token || false;
        Authenticate.authenticateToken(auth).then(function(data) {
      		value = data.data.callback===false? data.data.callback : '"' + data.data.callback + '"';
			localStorage.setItem("token", '{"token":' + value + '}')
			if(data.data.callback===false){
				$state.go("login");
        		return false
			}
        	return isAuthenticated;
        })

        return auth;
      }
    };
    
  });
