Dataset = {
	getAllImagesNames: function(){
		fetch('/dataset').then(function(response){
			if(!response.ok){
				console.log('Network response was not ok.');
				return;
			}
			response.json().then(function(json){
				var container = document.getElementById('image-list-container');
				container.innerHTML = '';
				for (var i = 0; i < json.length; i++){
					var imageName = json[i];
					var div = document.createElement('DIV');
					div.className="thumbnails-container"
					div.innerHTML = '<div class="image-name">' + imageName + '</div><img src="/dataset/sample?name=' + imageName + '">'
					div.imageName = imageName;
					div.addEventListener('click', function(){Dataset.loadImage(this.imageName)})
					container.appendChild(div);
				}
			});
		}).catch(function(error){
			console.log(error);
		});
	}

	, loadImage: function(imageName){
		console.log(imageName);
		var detailContainer = document.getElementById('image-detail-container');
		var imageContainer = document.getElementById('image-container');
		// var img = document.getElementById('image');
		// var canvas = document.getElementById('canvas');
		
		imageContainer.innerHTML = '';

		var img = document.createElement('img');
		img.src = '/dataset/sample?name=' + imageName ;
		img.onload = function(){
			console.log(this.width + ',' + this.height);
			var containerHeight = imageContainer.offsetHeight;
			var containerWidth = imageContainer.offsetWidth;

			var imageHeight = this.height;
			var imageWidth = this.width;

			var wFrac = containerWidth / imageWidth;
			var hFrac = containerHeight / imageHeight;

			var minorFrac = (wFrac < hFrac ? wFrac: hFrac);

			var newImageWidth = minorFrac * imageWidth;
			var newImageHeight = minorFrac * imageHeight;

			img.style.width = newImageWidth + 'px';
			img.style.height = newImageHeight + 'px';

			console.log(this.width + ',' + this.height);
			Dataset.loadMetaInfo(imageName);
		};
		imageContainer.appendChild(img);
		// imageContainer.canvas = document.createElement('canvas');
		// imageContainer.appendChild(imageContainer.canvas);


		// imageContainer.style.backgroundImage = 'url("/dataset/sample?name=' + imageName + '")';
	}

	, loadMetaInfo: function(imageName){
		fetch('/dataset/mark?name=' + imageName).then(function(response){
			if(!response.ok){
				console.log('Network response was not ok.');
				return;
			}
			response.json().then(function(json){
				var container = document.getElementById('image-detail-container');
				container.innerHTML = '';

				var imageName = json['name'];
				// var clazz = json['classe'];
				var regions = json['regions'];

				var nameContainer = document.createElement('div');
				// var clazzContainer = document.createElement('div');
				var regionsContainer = document.createElement('div');
				nameContainer.className = 'nameContainer';
				// clazzContainer.className = 'classContainer';
				regionsContainer.className = 'regionsContainer';
				container.appendChild(nameContainer);
				// container.appendChild(clazzContainer);
				container.appendChild(regionsContainer);

				nameContainer.innerHTML = imageName;
				// clazzContainer.innerHTML = clazz;

				for(var key in regions){
					var region = regions[key];
					var regionContainer = document.createElement('div');
					regionContainer.className = 'regionContainer';
					regionsContainer.appendChild(regionContainer);

					var keyContainer = document.createElement('div');
					keyContainer.className='key';
					keyContainer.innerHTML = key;

					var valuesContainer = document.createElement('div');
					valuesContainer.className='values';
					
					for(var i = 0; i < region.length; i++){
						var valueContainer = document.createElement('div');
						valueContainer.className = 'value';
						valueContainer.innerHTML = region[i];
						valuesContainer.appendChild(valueContainer);
					}

					regionContainer.appendChild(keyContainer);
					regionContainer.appendChild(valuesContainer);
				}


				

				
			});
		}).catch(function(err){
			console.log(err)
		});
	}
}

Dataset.getAllImagesNames();
