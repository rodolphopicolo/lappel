Canvas = {

    canvasRegions: null
    , canvasRules: null

    , click: function(evt){
        var x = evt.layerX;
        var y = evt.layerY;

        if(x > Canvas.canvasRegions.width){
            return;
        }

        if(y > Canvas.canvasRegions.height){
            return;
        }

		var fracX = x / Canvas.canvasRegions.width;
        var fracY = y / Canvas.canvasRegions.height;
        
        fracX = +fracX.toFixed(4);
        fracY = +fracY.toFixed(4);

        Dataset.click(fracX, fracY);
    }
    , mouseMove: function(evt){
        Canvas.drawRules(evt.layerX, evt.layerY);
    }
    , mouseOut: function(evt){

    }

    , drawRules: function(x, y){
        if(x > Canvas.canvasRules.width){
            x = Canvas.canvasRules.width;
        }
        if(y > Canvas.canvasRules.height){
            y = Canvas.canvasRules.height;
        }

        var context = Canvas.canvasRules.getContext('2d');

        context.clearRect(0, 0, Canvas.canvasRules.width, Canvas.canvasRules.height);
        // context.strokeStyle = "#FFFF00";
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(Canvas.canvasRules.width, y);

        context.moveTo(x, 0);
        context.lineTo(x, Canvas.canvasRules.height);

        context.stroke();
    }

    , clear: function(){
        var ctx = Canvas.canvasRegions.getContext('2d');
        ctx.clearRect(0, 0, Canvas.canvasRegions.width, Canvas.canvasRegions.height);
    }

    , drawRegions: function(regions){
        Canvas.clear();
        for(var key in regions){
            var region = regions[key];
            Canvas.drawRegion(region);
        }
    }

    , drawRegion: function(points){
        var width = Canvas.canvasRegions.width;
        var height = Canvas.canvasRegions.height;
        var ctx = Canvas.canvasRegions.getContext('2d');

        var RADIUS = 8;

        var firstX = null;
        var firstY = null;

        var previousX = null;
        var previousY = null;

        for(var i = 0; i < points.length; i++){
            var fracX = points[i][0];
            var fracY = points[i][1];

            var x = fracX * width;
            var y = fracY * height;

            if(i == 0){
                firstX = x;
                firstY = y;
            }

            ctx.beginPath();
            ctx.arc(x, y, RADIUS, 0, 2 * Math.PI);
            
            ctx.moveTo(x - RADIUS, y);
            ctx.lineTo(x + RADIUS, y);
            ctx.moveTo(x, y - RADIUS);
            ctx.lineTo(x, y + RADIUS);

            if(i > 0){
                ctx.moveTo(previousX, previousY);
                ctx.lineTo(x, y);
            }

            if(points.length == 4){
                if(i == points.length - 1){
                    ctx.lineTo(firstX, firstY);
                }
            }

            ctx.stroke();

            previousX = x;
            previousY = y;
        }
    }
}