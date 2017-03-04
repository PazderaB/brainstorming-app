angular.module('loginService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Authenticate', ['$http',function($http) {
		return {
			authenticate : function(authenticateData) {
				return $http.post('/api/authenticate', authenticateData);
			},
			authenticateToken : function(token) {
				return $http.get('/api/authenticate/'+token);
			}
		}
	}]);