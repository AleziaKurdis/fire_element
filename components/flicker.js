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
	var processInterval;

	this.preload = function(entityID) {

		var newval = 1;
		var processInterval = Script.setInterval(function() {
			newval = (Math.random() * 0.5)  + 1;
			Entities.editEntity(entityID, {"intensity": newval});
		}, 80); 
	}

    this.unload = function(entityID) {
		Script.clearInterval(processInterval);
    };
})