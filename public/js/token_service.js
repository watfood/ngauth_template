(function() {
  "use strict";

  angular
    .module("authtemplate")
    .factory('tokenService', tokenService);


  console.log("token_service.js loaded!")

  tokenService.$inject = ['$log', '$window']

  function tokenService($log, $window) {
    const TOKEN_KEY = 'myApp-token';
    var service = {
      store: store,
      retrieve: retrieve,
      decode: decode,
      destroy: destroy
    };
    return service;

    function store(token) {
      $window.localStorage.setItem(TOKEN_KEY, token);
    }
    function retrieve() {
      return $window.localStorage.getItem(TOKEN_KEY);
    }
    function decode() {
      return $window.jwt_decode(retrieve());
    }
    function destroy() {
      $window.localStorage.removeItem(TOKEN_KEY);
    }

  }


})();
