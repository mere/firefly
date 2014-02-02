require.config({

    paths: {
        "jquery": ["http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min",
                    "libs/jquery/jquery"]        
    },

    shim: { },
    waitSeconds: 10
});

define("d3", [], function(){return d3})
define("kinetic", [], function(){return Kinetic})
define("three", [], function(){return THREE})

require(['app'], function(app){
    
});