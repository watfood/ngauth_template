(function() {
  "use strict";

  angular
    .module("authtemplate")
    .controller("SignInController", SignInController)


console.log("sign_in_controller.js loaded!")

  SignInController.$inject = ['$log', '$http', 'tokenService'];

  function SignInController($log, $http,  tokenService) {

    var vm = this;
    // BINDINGS
      vm.signUp = {
        email:  "",
        name:  "",
        password:  "",
        passwordConfirm:  ""
      }
      vm.submitSignUp = submitSignUp;

    //HELPERS

    //FUNCTIONS
    function submitSignUp() {
       $http
          .post('/api/users', vm.signUp, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
          .then(
            function(res)
            { $log.info("Success User Data Sent:", res);
            generateToken();
          },
            function(err) {
              $log.info("Error User Data Not Sent:", err);
            }

            );

        }
          function generateToken() {
              $http
                 .post('/api/token', vm.signUp, {
                   headers: {
                     'Content-Type': 'application/json'
                   }
                 })
                 .then(
                   function(res) {
                      tokenService.store(res.data.token);
                      $log.info("Success Token Sent:", tokenService.decode());
                 },
                   function(err) {
                     $log.info("Error Token not sent:", err);
                   }
                  );

              $log.info("Token Generated")
          }
  }



})();
