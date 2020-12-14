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

    var UPDATE_TIMER_INTERVAL = 20000; // 20 sec
    var processTimer = 0;

    var fireSound;
    var fireSoundInjector;

    var thisEntityId;
    /* 
    var HighFlam;
    var LowFlam;
    var SparcklesFlam;
    var LightFire;
    */
        
	this.preload = function(entityID) { 
        thisEntityId = entityID;
        print("PARTICLE_FLAME_URL");
        fireSound = SoundCache.getSound(FIRE_SOUND_URL);
			//print("FIRE: preload sound!");
		/*
		playsound(entityID);
		//print("FIRE: Play looped sound!");
		
		
		
		//Add low fire particle
		AddLowFire(entityID);
		//print("FIRE: add Low fire!");
		
		//Add spackle particle
		AddSparckles(entityID);
		//print("FIRE: add Sparckles!");	
		
		//Add first High Fire
		AddHighFire(entityID);
		//print("FIRE: add 1st High Fire!");	

		//Add Light
		GenLight(entityID);
		//print("FIRE: add Light!");
		
		//install timer High Fire
		
        
		var ProcessInterval = Script.setInterval(function() {

			//50% time
			AddHighFire(entityID);
			
			//100%time
			AddLowFire(entityID);
			AddSparckles(entityID);
		    GenLight(entityID);
			
		}, 2400000); //40 minutes

		//print("FIRE: Install timer High Fire!");
		*/
        
        print("fireSoundInjector: " + fireSoundInjector);
        
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
        /*
		Entities.deleteEntity(HighFlam);
		Entities.deleteEntity(LowFlam);
		Entities.deleteEntity(SparcklesFlam);
		Entities.deleteEntity(LightFire);		
		
		//print("FIRE: script end, kill entities!");
        */
        
        Script.update.disconnect(myTimer);
    };	         

    function onFireSoundReady() {
        fireSound.ready.disconnect(onFireSoundReady);
        playFireSound();
    }
        
    function myTimer(deltaTime) {
        var today = new Date();
        if ((today.getTime() - processTimer) > UPDATE_TIMER_INTERVAL ) {
            
            //processing
            print("PROCESSING!");
            
            
            today = new Date();
            processTimer = today.getTime();
        }  
    }
        
/*        
		function AddHighFire(TityId) {
			//print("FIRE: add Temporary High fire!");
			
			var properHighFlam = Entities.getEntityProperties(TityId); 
			var HighFlamPosition = properHighFlam.position;
			var HighFlamRotation = properHighFlam.rotation;
			
			HighFlam = Entities.addEntity({
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
				"clientOnly": 0,
				"collisionless": 1,
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
					"blue": 38,
					"green": 208,
					"red": 255
				},
				"dimensions": {
					"x": 2.5576000213623047,
					"y": 2.5576000213623047,
					"z": 2.5576000213623047
				},
				"emitAcceleration": {
					"x": 0,
					"y": 3,
					"z": 0
				},
				"emitDimensions": {
					"x": 1,
					"y": 1,
					"z": 1
				},
				"emitOrientation": {
					"w": 0.7071068,
					"x": 0.7071068,
					"y": 0,
					"z": 0
				},
				"emitRate": 30,
				"emitterShouldTrail": 0,			
				"emitSpeed": 0.59,
				"ignoreForCollisions": 1,
				"isEmitting": 1,			
				"lifespan": 1.0,
				"maxParticles": 300,
				"name": "High Flame Fire Particle - AK2018",
				"particleRadius": 0.3,
				"polarStart": 0,
				"polarFinish": 0.20944,
				"position":{
					"x": HighFlamPosition.x,
					"y": HighFlamPosition.y + 0.6,
					"z": HighFlamPosition.z
				},
				"parentID": TityId,
				"lifetime": 1200.0,
				"queryAACube": {
					"scale": 4.429893493652344,
					"x": -2.214946746826172,
					"y": -2.214946746826172,
					"z": -2.214946746826172
				},
				"radiusFinish": 0,
				"radiusSpread": 0,
				"radiusStart": 0,
				"rotation": {
					"w": HighFlamRotation.w,
					"x": HighFlamRotation.x,
					"y": HighFlamRotation.y,
					"z": HighFlamRotation.z
				},
				"speedSpread": 0,
				"textures": "http://mpassets.highfidelity.com/bf263f5a-c152-45ae-953f-07c61438ed82-v1/PARTICLE_FIRE_FLAMME_2017.png",
				"type": "ParticleEffect",
				"userData": "{\"grabbableKey\":{\"grabbable\":false}}"
			});
			
			
		}		


		function AddLowFire(TityId) {
			//print("FIRE: add permanent Low fire!");
			
			var properLowFlam = Entities.getEntityProperties(TityId); 
			var LowFlamPosition = properLowFlam.position;
			var LowFlamRotation = properLowFlam.rotation;
			
			LowFlam = Entities.addEntity({
				"accelerationSpread": {  
					"x": 0,
					"y": 0,
					"z": 0
				}, 
				"alpha": 0.2,
				"alphaFinish": 0,
				"alphaSpread": 0,
				"alphaStart": 0.5,
				"azimuthStart": -3.14159,
				"azimuthFinish": 3.14159,			
				"clientOnly": 0,
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
					"x": 2.5576000213623047,
					"y": 2.5576000213623047,
					"z": 2.5576000213623047
				},
				"emitAcceleration": {
					"x": 0,
					"y": 0.5,
					"z": 0
				},
				"emitDimensions": {
					"x": 1,
					"y": 1,
					"z": 1
				},
				"emitOrientation": {
					"w": 0.7071068,
					"x": 0.7071068,
					"y": 0,
					"z": 0
				},
				"emitRate": 20,
				"emitterShouldTrail": 0,			
				"emitSpeed": 0.1,
				"ignoreForCollisions": 1,
				"isEmitting": 1,			
				"lifespan": 1.1,
				"maxParticles": 100,
				"name": "Low Flame Fire Particle - AK2018",
				"particleRadius": 0.3,
				"polarStart": 0,
				"polarFinish": 0.1745,
				"position":{
					"x": LowFlamPosition.x,
					"y": LowFlamPosition.y + 0.51,
					"z": LowFlamPosition.z
				},
				"parentID": TityId,
				"lifetime": 2400.1,
				"queryAACube": {
					"scale": 4.429893493652344,
					"x": -2.214946746826172,
					"y": -2.214946746826172,
					"z": -2.214946746826172
				},
				"radiusFinish": 0.2,
				"radiusSpread": 0,
				"radiusStart": 0.1,
				"rotation": {
					"w": LowFlamRotation.w,
					"x": LowFlamRotation.x,
					"y": LowFlamRotation.y,
					"z": LowFlamRotation.z
				},
				"speedSpread": 0,
				"textures": "http://mpassets.highfidelity.com/bf263f5a-c152-45ae-953f-07c61438ed82-v1/PARTICLE_LOW_FIRE_FLAMME_2018.png",
				"type": "ParticleEffect",
				"userData": "{\"grabbableKey\":{\"grabbable\":false}}"
			});
			
			
		}		

		
		function AddSparckles(TityId) {
			//print("FIRE: add permanent Sparckle!");
			
			var properSparcklesFlam = Entities.getEntityProperties(TityId); 
			var SparcklesFlamPosition = properSparcklesFlam.position;
			var SparcklesFlamRotation = properSparcklesFlam.rotation;
			
			SparcklesFlam = Entities.addEntity({
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
				"clientOnly": 0,
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
					"x": 2.5576000213623047,
					"y": 2.5576000213623047,
					"z": 2.5576000213623047
				},
				"emitAcceleration": {
					"x": 0,
					"y": 2,
					"z": 0
				},
				"emitDimensions": {
					"x": 1,
					"y": 1,
					"z": 1
				},
				"emitOrientation": {
					"w": 0.7071068,
					"x": 0.7071068,
					"y": 0,
					"z": 0
				},
				"emitRate": 3,
				"emitterShouldTrail": 0,			
				"emitSpeed": 0.6,
				"ignoreForCollisions": 1,
				"isEmitting": 1,			
				"lifespan": 2,
				"maxParticles": 20,
				"name": "Sparckles Particle - AK2018",
				"particleRadius": 0.2,
				"polarStart": 0,
				"polarFinish": 0.191,
				"position":{
					"x": SparcklesFlamPosition.x,
					"y": SparcklesFlamPosition.y + 0.45,
					"z": SparcklesFlamPosition.z
				},
				"parentID": TityId,
				"lifetime": 2400.1,
				"queryAACube": {
					"scale": 4.429893493652344,
					"x": -2.214946746826172,
					"y": -2.214946746826172,
					"z": -2.214946746826172
				},
				"radiusFinish": 0.2,
				"radiusSpread": 0,
				"radiusStart": 0.2,
				"rotation": {
					"w": SparcklesFlamRotation.w,
					"x": SparcklesFlamRotation.x,
					"y": SparcklesFlamRotation.y,
					"z": SparcklesFlamRotation.z
				},
				"speedSpread": 0,
				"textures": "http://mpassets.highfidelity.com/bf263f5a-c152-45ae-953f-07c61438ed82-v1/PARTICLE_SPARCKLE_FIRE_2018.png",
				"type": "ParticleEffect",
				"userData": "{\"grabbableKey\":{\"grabbable\":false}}"
			});
			
			
		}		


	function GenLight(TityId){
		
		var properLight = Entities.getEntityProperties(TityId); 
		var LightPosition = properLight.position;

			
		LightFire = Entities.addEntity({
            "color": {
                "blue": 0,
                "green": 111,
                "red": 255
            },
            "cutoff": 90,
            "dimensions": {
                "x": 4,
                "y": 4,
                "z": 4
            },
            "exponent": 0.20,
            "falloffRadius": 3,
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
				"x": LightPosition.x,
				"y": LightPosition.y - 0.11,		
				"z": LightPosition.z				
			},
			"parentID": TityId,
			"lifetime": 2400.1,			
            "serverScripts": "http://mpassets.highfidelity.com/bf263f5a-c152-45ae-953f-07c61438ed82-v1/flicker.js",
            "type": "Light",
            "userData": "{\"grabbableKey\":{\"grabbable\":false}}"
        });
		
	}
		
*/		
    function playFireSound(){
        var prop = Entities.getEntityProperties(thisEntityId, "position"); 
        var entposition = prop.position;
		fireSoundInjector = Audio.playSound(fireSound, {
            "position": entposition,
            "loop": true,
            "localOnly": true,
            "volume": 1.0
        });
    }

})