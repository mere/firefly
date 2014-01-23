require.config({

    paths: {
        "jquery": ["http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
                    "libs/jquery/jquery"],
        "underscore": "libs/underscore/underscore-min",
        "backbone": "libs/backbone/backbone-min"
    },

    shim: { },
    waitSeconds: 10
});

define("d3", [], function(){return d3})
require(['./app'], function(app){
    app()
});