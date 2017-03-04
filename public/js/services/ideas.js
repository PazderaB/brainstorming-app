angular.module('ideaService', [])

	// super simple service
	// each function returns a promise object 
	.factory('Ideas', ['$http','LoginService',function($http, LoginService) {
		return {
			get : function() {
				LoginService.isAuthenticated()
				return $http.get('/api/ideas');
			},
			create : function(ideaData) {
				LoginService.isAuthenticated()
				return $http.post('/api/ideas', ideaData);
			},
			delete : function(id,pass) {
				LoginService.isAuthenticated()
				return $http.delete('/api/ideas/' + id);
			}
		}
	}]);