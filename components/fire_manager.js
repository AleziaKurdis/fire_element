//  fire_manager.js
//
//  Created by Alezia Kurdis on December 13, 2020.
//  Copyright 2020 Alezia Kurdis.
//
//  This script manage the fire element events
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//
(function(){
    var ROOT = Script.resolvePath("").split("fire_manager.js")[0];
    var FIRE_SOUND_URL = ROOT + "SOUND_FIRE_MONO.mp3";
    var PARTICLE_FLAME_URL = ROOT + "PARTICLE_FIRE_FLAME.png";
    var PARTICLE_LOW_FLAME_URL = ROOT + "PARTICLE_FIRE_LOW_FLAME.png";
    var PARTICLE_SPARK_URL = ROOT + "PARTICLE_FIRE_SPARK.png";
    var LIGHT_FLICKER_SCRIPT_URL = ROOT + "flicker.js";
    
    var UPDATE_TIMER_INTERVAL = 20000; // 20 sec
    var processTimer = 0;

    var fireSound;
    var fireSoundInjector;

    var thisEntityId;
    var fireScaleFactor = 1;
    var previousDimensions;
    
    var FIRE_MODEL_Y_SIZE = 0.3003;
    var FIRE_MODEL_Z_SIZE = 0.9676;
    
    var FIRE_CYCLE = 2100; //35 minutes

    var highFlamId;
    var lowFlamId;
    var sparksFlamId;
    var lightFireId;

    this.preload = function(entityID) { 
        thisEntityId = entityID;
        fireSound = SoundCache.getSound(FIRE_SOUND_URL);
        
        var properties = Entities.getEntityProperties(thisEntityId, "dimensions");
        fireScaleFactor = properties.dimensions.x;
        previousDimensions = properties.dimensions;

        addLowFire(thisEntityId);
        addSparks(thisEntityId); 
        addLight(thisEntityId);
        addHighFire(thisEntityId);

        if (fireSound.downloaded) {
            playFireSound();
        } else {
            fireSound.ready.connect(onFireSoundReady);
        }

        Script.update.connect(myTimer);
    }; 

    this.unload = function(entityID) {
        
        if (fireSoundInjector !== undefined){
            fireSoundInjector.stop();
        }
        
        Entities.deleteEntity(lowFlamId);
        Entities.deleteEntity(sparksFlamId);
        Entities.deleteEntity(lightFireId); 
        Entities.deleteEntity(highFlamId);

        Script.update.disconnect(myTimer);
    };             

    function onFireSoundReady() {
        fireSound.ready.disconnect(onFireSoundReady);
        playFireSound();
    }
        
    function myTimer(deltaTime) {
        var today = new Date();
        if ((today.getTime() - processTimer) > UPDATE_TIMER_INTERVAL ) {

            var state = GetCurrentCycleValue(100, FIRE_CYCLE);
            if (state > 49){
                Entities.editEntity(lightFireId, {
                    "color": {
                        "blue": 0,
                        "green": 68,
                        "red": 255
                    },
                    "falloffRadius": 1.6
                });
                Entities.editEntity(highFlamId, {
                    "isEmitting": false
                });                
                if (fireSoundInjector !== undefined){
                    fireSoundInjector.setOptions({"volume": 0.4});
                }
            } else {
                Entities.editEntity(lightFireId, {
                    "color": {
                        "blue": 0,
                        "green": 128,
                        "red": 255
                    },
                    "falloffRadius": 3.0
                });
                Entities.editEntity(highFlamId, {
                    "isEmitting": true
                });                
                if (fireSoundInjector !== undefined){
                    fireSoundInjector.setOptions({"volume": 0.8});
                }                
            }
            
            //Check for resize
            var properties = Entities.getEntityProperties(thisEntityId, "dimensions");
            if ((properties.dimensions.x - previousDimensions.x) > 0.001){
                //Resize
                fireScaleFactor = properties.dimensions.x;
                var newDimensions = {
                        "x": fireScaleFactor, 
                        "y": fireScaleFactor * FIRE_MODEL_Y_SIZE, 
                        "z": fireScaleFactor * FIRE_MODEL_Z_SIZE
                    };
                Entities.editEntity(thisEntityId, {
                    "dimensions": newDimensions
                });
                
                Entities.deleteEntity(lowFlamId);
                addLowFire(thisEntityId);                

                Entities.deleteEntity(sparksFlamId);
                addSparks(thisEntityId);

                Entities.deleteEntity(lightFireId);
                addLight(thisEntityId);

                Entities.deleteEntity(highFlamId);
                addHighFire(thisEntityId);

                previousDimensions = newDimensions;
            }

            today = new Date();
            processTimer = today.getTime();
        }  
    }
        
    function addHighFire(entityID) {
        var state = GetCurrentCycleValue(100, FIRE_CYCLE);
        var isEmitting = true;
        if (state > 49){
            isEmitting = false;
        }
        var properties = Entities.getEntityProperties(entityID, ["position", "rotation", "renderWithZones"]); 
        
        highFlamId = Entities.addEntity({
            "accelerationSpread": {
                "x": 0,
                "y": 0,
                "z": 0
            }, 
            "alpha": 0.20000000298023224,
            "alphaFinish": 0,
            "alphaSpread": 0,
            "alphaStart": 0.5,
            "azimuthStart": -3.14159,
            "azimuthFinish": 3.14159,
            "color": {
                "blue": 18,
                "green": 113,
                "red": 255
            },
            "colorFinish": {
                "blue": 0,
                "green": 0,
                "red": 255
            },
            "colorSpread": {
                "blue": 0,
                "green": 15,
                "red": 0
            },
            "colorStart": {
                "blue": 66,
                "green": 208,
                "red": 255
            },
            "dimensions": {
                "x": 2.5576000213623047 * fireScaleFactor,
                "y": 2.5576000213623047 * fireScaleFactor,
                "z": 2.5576000213623047 * fireScaleFactor
            },
            "emitAcceleration": {
                "x": 0,
                "y": 3 * fireScaleFactor,
                "z": 0
            },
            "emitDimensions": {
                "x": fireScaleFactor,
                "y": fireScaleFactor,
                "z": fireScaleFactor
            },
            "emitOrientation": {
                "w": 0.7071068,
                "x": 0.7071068,
                "y": 0,
                "z": 0
            },
            "emitRate": 30,
            "emitterShouldTrail": 0,            
            "emitSpeed": 0.59 * fireScaleFactor,
            "ignoreForCollisions": 1,
            "isEmitting": isEmitting,            
            "lifespan": 1.0,
            "maxParticles": 300,
            "name": "HIGH-FLAME",
            "particleRadius": 0.3 * fireScaleFactor,
            "polarStart": 0,
            "polarFinish": 0.20944,
            "position":{
                "x": properties.position.x,
                "y": properties.position.y + (0.53 * fireScaleFactor),
                "z": properties.position.z
            },
            "parentID": entityID,
            "renderWithZones": properties.renderWithZones,
            "radiusFinish": 0,
            "radiusSpread": 0,
            "radiusStart": 0,
            "rotation": properties.rotation,
            "speedSpread": 0.08 * fireScaleFactor,
            "textures": PARTICLE_FLAME_URL,
            "type": "ParticleEffect",
            "grab": {
                "grabbable": false
            }
        }, "local");
        
        
    }

    function addLowFire(entityID) {

        var properties = Entities.getEntityProperties(entityID, ["position", "rotation", "renderWithZones"]);   
        
        lowFlamId = Entities.addEntity({ 
            "alpha": 0.2,
            "alphaFinish": 0,
            "alphaSpread": 0,
            "alphaStart": 0.5,
            "azimuthStart": 0,
            "azimuthFinish": 3.14159,
            "collisionless": 1,
            "color": {
                "blue": 18,
                "green": 93,
                "red": 255
            },
            "colorFinish": {
                "blue": 0,
                "green": 0,
                "red": 255
            },
            "colorSpread": {
                "blue": 0,
                "green": 35,
                "red": 0
            },
            "colorStart": {
                "blue": 0,
                "green": 0,
                "red": 255
            },
            "dimensions": {
                "x": 2.5576000213623047 * fireScaleFactor,
                "y": 2.5576000213623047 * fireScaleFactor,
                "z": 2.5576000213623047 * fireScaleFactor
            },
            "emitAcceleration": {
                "x": 0,
                "y": 0.2 * fireScaleFactor,
                "z": 0
            },
            "accelerationSpread": {
                "x": 0,
                "y": 0.05 * fireScaleFactor,
                "z": 0
            },                
            "emitDimensions": {
                "x": 0.4 * fireScaleFactor,
                "y": 0.01 * fireScaleFactor,
                "z": 0.4 * fireScaleFactor
            },
            "emitOrientation": {
                "w": 1,
                "x": 0,
                "y": 0,
                "z": 0
            },
            "emitRate": 30,
            "emitterShouldTrail": 0,            
            "emitSpeed": 0.06  * fireScaleFactor,
            "speedSpread": 0.03  * fireScaleFactor,
            "ignoreForCollisions": 1,
            "isEmitting": 1,            
            "lifespan": 1.1,
            "maxParticles": 60,
            "name": "Low Flames Particles",
            "particleRadius": 0.3  * fireScaleFactor,
            "polarStart": 0,
            "polarFinish": Math.PI,
            "position":{
                "x": properties.position.x,
                "y": properties.position.y - (0.05  * fireScaleFactor),
                "z": properties.position.z
            },
            "parentID": entityID,
            "renderWithZones": properties.renderWithZones,
            "radiusFinish": 0.2 * fireScaleFactor,
            "radiusSpread": 0.1 * fireScaleFactor,
            "radiusStart": 0.1  * fireScaleFactor,
            "rotation": properties.rotation,
            "textures": PARTICLE_LOW_FLAME_URL,
            "type": "ParticleEffect",
            "grab": {
                "grabbable": false
            }
        }, "local"); 
    }        
  
    function addSparks(entityID) {
        
        var properties = Entities.getEntityProperties(entityID,["position", "rotation", "renderWithZones"]); 
        
        sparksFlamId = Entities.addEntity({
            "accelerationSpread": {  
                "x": 0,
                "y": 0,
                "z": 0
            }, 
            "alpha": 0.5,
            "alphaFinish": 0,
            "alphaSpread": 0,
            "alphaStart": 1,
            "azimuthStart": -3.14159,
            "azimuthFinish": 3.14159,            
            "collisionless": 1,
            "color": {
                "blue": 0,
                "green": 77,
                "red": 255
            },
            "colorFinish": {
                "blue": 0,
                "green": 0,
                "red": 255
            },
            "colorSpread": {
                "blue": 0,
                "green": 15,
                "red": 0
            },
            "colorStart": {
                "blue": 0,
                "green": 183,
                "red": 255
            },
            "dimensions": {
                "x": 2.5576000213623047 * fireScaleFactor,
                "y": 2.5576000213623047 * fireScaleFactor,
                "z": 2.5576000213623047 * fireScaleFactor
            },
            "emitAcceleration": {
                "x": 0,
                "y": 2 * fireScaleFactor,
                "z": 0
            },
            "emitDimensions": {
                "x": 0.4 * fireScaleFactor,
                "y": 0.2 * fireScaleFactor,
                "z": 0.4 * fireScaleFactor
            },
            "emitOrientation": {
                "w": 1,
                "x": 0,
                "y": 0,
                "z": 0
            },
            "emitRate": 3 * fireScaleFactor,
            "emitterShouldTrail": 0,            
            "emitSpeed": 0,
            "speedSpread": 0.1 * fireScaleFactor,
            "ignoreForCollisions": 1,
            "isEmitting": 1,            
            "lifespan": 1.6 * fireScaleFactor,
            "maxParticles": 20 * fireScaleFactor,
            "name": "Sparks Particles",
            "particleRadius": 0.2,
            "polarStart": Math.PI/2,
            "polarFinish": Math.PI,
            "position":{
                "x": properties.position.x,
                "y": properties.position.y,
                "z": properties.position.z
            },
            "parentID": entityID,
            "radiusFinish": 0.2,
            "radiusSpread": 0,
            "radiusStart": 0.2,
            "rotation": properties.rotation,
            "renderWithZones": properties.renderWithZones,
            "textures": PARTICLE_SPARK_URL,
            "type": "ParticleEffect",
            "grab": {
                "grabbable": false
            }
        }, "local");
    }        

    function addLight(entityID){
        var state = GetCurrentCycleValue(100, FIRE_CYCLE);
        var falloffRadius = 3;
        var color = {
            "blue": 0,
            "green": 128,
            "red": 255
        };
        if (state > 49){
            color = {
                "blue": 0,
                "green": 68,
                "red": 255
            };
            falloffRadius = 1.6;
        }
        var properties = Entities.getEntityProperties(entityID,["position", "rotation", "renderWithZones"]);   
        lightFireId = Entities.addEntity({
            "color": color,
            "cutoff": 90,
            "dimensions": {
                "x": 6 * fireScaleFactor,
                "y": 6 * fireScaleFactor,
                "z": 6 * fireScaleFactor
            },
            "exponent": 0.20,
            "falloffRadius": falloffRadius,
            "isSpotlight": true,
            "intensity": 1.0,
            "name": "FIRE-LIGHT",
            "rotation": {
                "w": 0.7071067690849304,
                "x": 0.7071067690849304,
                "y": 0,
                "z": 0
            },
            "position": {
                "x": properties.position.x,
                "y": properties.position.y - (0.11 * fireScaleFactor),        
                "z": properties.position.z                
            },
            "renderWithZones": properties.renderWithZones,            
            "parentID": entityID,          
            "script": LIGHT_FLICKER_SCRIPT_URL,
            "type": "Light",
            "grab": {
                "grabbable": false
            }
        }, "local");      
    }       
       
    function playFireSound(){
        var state = GetCurrentCycleValue(100, FIRE_CYCLE);
        var volume = 0.8;
        if (state > 49){
            volume = 0.4;
        }
        var prop = Entities.getEntityProperties(thisEntityId, "position"); 
        var entposition = prop.position;
        fireSoundInjector = Audio.playSound(fireSound, {
            "position": entposition,
            "loop": true,
            "localOnly": true,
            "volume": volume
        });
    }

	/*
	* Return the current position in a cycle 
	* for specific time length
	*
    * @param   {number integer}  cyclelength       a cycle goes from 0 to cyclelength
	* @param   {number integer}  cycleduration     duration of a cycle in seconds.
    * @return  {number double}           		current position in the cycle (double)
	*/
    function GetCurrentCycleValue(cyclelength, cycleduration){
		var today = new Date();
		var TodaySec = today.getTime()/1000;
		var CurrentSec = TodaySec%cycleduration;
		
		return (CurrentSec/cycleduration)*cyclelength;
		
	}

})