(function () {
 
    var app = angular.module('chirpApp', ['ngRoute', 'ngResource']).run(function ($rootScope, $http) {

        // on load - attemp to get the current user from local storage
        if (!localStorage.current_user) {
            $rootScope.authenticated = false;
            $rootScope.current_user = "";
        }
        else {
            $rootScope.authenticated = true;
            $rootScope.current_user = localStorage.current_user;
        }
        $rootScope.signout = function () {
            $http.get('/auth/signout');
            $rootScope.authenticated = false;
            $rootScope.current_user = "";
            localStorage.removeItem("current_user");
        }

    });

    // configure route provider
    app.config(function ($routeProvider) {
        $routeProvider
            // the timeline display
            .when('/', {
                templateUrl: 'main.html',
                controller: 'mainController as chirpController'
            })
            .when('/login', {
                templateUrl: 'login.html',
                controller: 'AuthController as authCtrl'
            })
            .when('/register', {
                templateUrl: 'register.html',
                controller: 'AuthController as authCtrl'
            });
    });

    app.factory('postService', ['$http', '$resource', function ($http, $resource) {
        /*
     
        //Method 1: Using a factory
     
        var factory = {};
        factory.getAll = function(){
            return $http.get('/api/posts');
        }
        return factory;
        */

        // Method 2: Using ngResource
        return $resource('/api/posts/:id');
    }]);

    app.controller('mainController', ['$http', 'postService', '$rootScope', function ($http, postService, $rootScope) {
        var self = this;
        self.posts = postService.query();
        //console.log(self.posts);
        self.newPost = {
            created_by: "",
            text: "",
            created_at: ""
        };
        /*
        postService.getAll().success(function(data){
            self.posts = data;
            console.log(data);
        });
        */

        self.post = function () {
            self.newPost.created_at = Date.now();
            self.newPost.created_by = $rootScope.current_user;

            /* 
            // Manipulate posts using temporary array, not used any more..
            
            // push the new post to the posts-list
            self.posts.push(self.newPost);
            // reset the new Post text
            self.newPost = {
                created_by: "",
                text: "",
                created_at: ""
            };
    
            */

            postService.save(self.newPost, function () {
                // query all posts
                self.posts = postService.query();

                // clear new post
                self.newPost = {
                    created_by: "",
                    text: "",
                    created_at: ""
                };
            });

        };
    }]);
    app.controller('AuthController', ['$http', '$rootScope', '$location', function ($http, $rootScope, $location) {
        var self = this;
        self.user = { username: "", password: "" };
        self.error_message = "";

        // login function
        self.login = function () {
            // TODO: login request
            console.log('Login request for user ' + self.user.username);
            $http.post('/auth/login', self.user).success(function (data) {
                if (data.state == 'success') {
                    // push the user into local storage
                    localStorage.current_user = data.user.username;
                    $rootScope.authenticated = true;
                    $rootScope.current_user = data.user.username;
                    $rootScope.signed = true;
                    $location.path('/');
                }
                else {
                    self.error_message = data.message;
                }
            });
        };

        // register function
        self.register = function () {
            // TODO: login request
            console.log('Register request for user ' + self.user.username);
            $http.post('/auth/signup', self.user).success(function (data) {
                if (data.state == 'success') {
                    // push the user into local storage
                    localStorage.current_user = data.user.username;
                    $rootScope.authenticated = true;
                    $rootScope.current_user = self.user.username;
                    //$rootScope.current_user = data.user.username;
                    $location.path('/');
                }
                else {
                    // failure
                    self.error_message = data.message;
                }

            });
        };

    }]);
} ());

function showPassword() {
    
    var key_attr = $('#key').attr('type');
    
    if(key_attr != 'text') {
        
        $('.checkbox').addClass('show');
        $('#key').attr('type', 'text');
        
    } else {
        
        $('.checkbox').removeClass('show');
        $('#key').attr('type', 'password');
        
    }
    
}

