Dataset = {

	points:[]

	, imageName: null
	, editing: false

	, getAllImagesNames: function(){
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
		Dataset.imageName = null;
		var detailContainer = document.getElementById('image-detail-container');
		var imageContainer = document.getElementById('image-container');

		imageContainer.innerHTML = '';

		var img = document.createElement('img');
		imageContainer.canvasRegions = document.createElement('canvas');
		imageContainer.canvasRules = document.createElement('canvas');
		imageContainer.canvasRules.className='rules';
		Canvas.canvasRegions = imageContainer.canvasRegions;
		Canvas.canvasRules = imageContainer.canvasRules;
		imageContainer.canvasRegions.addEventListener('click', Canvas.click);
		imageContainer.canvasRegions.addEventListener('mousemove', Canvas.mouseMove);
		imageContainer.canvasRegions.addEventListener('mouseout', Canvas.mouseOut);



		img.src = '/dataset/sample?name=' + imageName ;
		img.onload = function(){
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

			imageContainer.canvasRegions.width = newImageWidth;
			imageContainer.canvasRegions.height = newImageHeight;

			imageContainer.canvasRules.width = newImageWidth;
			imageContainer.canvasRules.height = newImageHeight;

			Dataset.loadMetaInfo(imageName);
			Dataset.imageName = imageName;
		};
		imageContainer.appendChild(img);
		imageContainer.appendChild(imageContainer.canvasRegions);
		imageContainer.appendChild(imageContainer.canvasRules);

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

	, click: function(fracX, fracY){
		if(Dataset.editing != true){
			return;
		}
		var point = [fracX, fracY];
		Dataset.points.push(point);
		var container = document.getElementById('new-region-container');
		var pointContainer = document.createElement('div');
		pointContainer.className = 'point-container';
		pointContainer.innerHTML = point;
		container.appendChild(pointContainer);
		Dataset.drawEdition(Dataset.points);
	}

	, new: function(){
		Dataset.editing = true;
		Dataset.points = [];
		document.getElementById('new-region-container').innerHTML = '';
		Dataset.drawEdition(Dataset.points);
	}

	, save: function(){
		Dataset.editing = false;

		var encodedPoints = '';
		for(var i = 0; i < Dataset.points.length; i++){
			var point = Dataset.points[i];
			if (i > 0){
				encodedPoints += '+';
			}
			encodedPoints += point[0] + ',' + point[1];
		}

		var url = '/dataset/mark/new?name=' + Dataset.imageName + '&points=' + encodedPoints;
		console.log(url);
		fetch(url).then(function(response){
			if(!response.ok){
				var message = 'Erro ao salvar os pontos';
				console.log(message);
				throw message;
			}
			console.log('pontos salvos com sucesso');

		}).catch(function(err){
			console.log(err); throw err;
		});
	}

	, drawEdition: function(){
		Canvas.drawPoints(Dataset.points);
	}
}

Dataset.getAllImagesNames();
