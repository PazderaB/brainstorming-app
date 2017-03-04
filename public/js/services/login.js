angular.module('loginService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Authenticate', ['$http',function($http) {
		return {
			authenticate : function(authenticateData) {
				a=$http.post('/api/authenticate', authenticateData);
				return a;
			}
		}
	}]);