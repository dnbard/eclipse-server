define(function(){
	return {
		get: get
	};

	function get(type){
		return {
			"alpha": {
				"start": 0.8,
				"end": 0.1
			},
			"scale": {
				"start": 0.2,
				"end": 0.03,
				"minimumScaleMultiplier": 0.39
			},
			"color": type === 'ion' ? {
				"start": "#2e0ffc",
				"end": "#b2d9ed"
			} : {
				"start": "#e8172f",
				"end": "#e5f013"
			} ,
			"speed": {
				"start": 59,
				"end": 84
			},
			"acceleration": {
				"x": 0,
				"y": -1
			},
			"startRotation": {
				"min": 0,
				"max": 0
			},
			"noRotation": false,
			"rotationSpeed": {
				"min": 0,
				"max": 0
			},
			"lifetime": {
				"min": 0.11,
				"max": 0.5
			},
			"blendMode": "normal",
			"frequency": 0.009,
			"emitterLifetime": 0.1,
			"maxParticles": 1000,
			"pos": {
				"x": 0,
				"y": 0
			},
			"addAtBack": false,
			"spawnType": "burst",
			"particlesPerWave": 10,
			"particleSpacing": Math.round(Math.random() * 500),
			"angleStart": 0
		}
	}
});
