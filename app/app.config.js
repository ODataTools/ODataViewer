
// Routing
app.config(function ($routeProvider) {
    $routeProvider
     .when('/', { controller: 'HomeCtrl', templateUrl: 'app/pages/home/home.tpl.html' })
     .when('/about', { controller: 'AboutCtrl', templateUrl: 'app/pages/about/about.tpl.html' })
     .otherwise({ redirectTo: '/' });
});

// App Constants
app.constants = [];
app.constants["apiPath"] = "http://127.0.0.1:8000";
