//  flicker.js
//
//  Created by Alezia Kurdis on December 13, 2020.
//  Copyright 2020 Alezia Kurdis.
//
//  This script make flickering a light entity .
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

(function(){
    var thisEntity;
    var UPDATE_TIMER_INTERVAL = 80;
    var processTimer = 0;
    
	this.preload = function(entityID) {
        thisEntity = entityID;
        Script.update.connect(myTimer);
	}

    function myTimer(deltaTime) {
        var today = new Date();
        if ((today.getTime() - processTimer) > UPDATE_TIMER_INTERVAL ) {
            var newval = (Math.random() * 0.5)  + 1;
            Entities.editEntity(thisEntity, {"intensity": newval});
            processTimer = today.getTime();            
        }
    }
    
    this.unload = function(entityID) {
		Script.update.disconnect(myTimer);
    };
})