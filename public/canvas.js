Canvas = {

    canvasRegions: null
    , canvasRules: null

    , click: function(evt){
        var x = evt.layerX;
        var y = evt.layerY;
		var fracX = +('0.' + Math.round((x / Canvas.canvasRegions.width) * 10000));
		var fracY = +('0.' + Math.round((y / Canvas.canvasRegions.height) * 10000));

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

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(Canvas.canvasRules.width, y);

        context.moveTo(x, 0);
        context.lineTo(x, Canvas.canvasRules.height);

        context.stroke();

    }

    , drawPoints: function(points){

    }
}