
// Routing
app.config(function ($routeProvider) {
    $routeProvider
     .when('/', { controller: 'HomeCtrl', templateUrl: 'app/pages/home/home.tpl.html' })
     .when('/:url', { controller: 'HomeCtrl', templateUrl: 'app/pages/home/home.tpl.html' })
     .when('/about', { controller: 'AboutCtrl', templateUrl: 'app/pages/about/about.tpl.html' })
     .otherwise({ redirectTo: '/' });
});

// To enable 'ng-bind-html'
app.config(function ($sceProvider) {
    // Completely disable SCE.  For demonstration purposes only!
    // Do not use in new projects.
    $sceProvider.enabled(false);
});

app.config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
        // todo start the spinner here
        $('#loading-spinner').show();
        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
})
// register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('myHttpInterceptor', function ($q, $window) {
    return function (promise) {
        return promise.then(function (response) {
            // do something on success
            // todo hide the spinner

            $('#loading-spinner').hide();

            return response;
        }, function (response) {
            // do something on error
            // todo hide the spinner
            $('#loading-spinner').hide();
            return $q.reject(response);
        });
    };
})


// App Constants
app.constants = [];
app.constants["apiPath"] = "http://127.0.0.1:8000";
