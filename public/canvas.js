Canvas = {

    canvas: null
    , canvasRules: null

    , click: function(evt){
        // Canvas.drawRules(evt.layerX, evt.layerY);
    }
    , mouseMove: function(evt){
        console.log('mouseMove:' + Canvas.canvas);
        console.log(evt);
        Canvas.drawRules(evt.layerX, evt.layerY);
    }
    , mouseOut: function(evt){
        console.log('mouseOut:' + Canvas.canvas);
    }

    , drawRules: function(x, y){
        if(x > Canvas.canvasRules.width){
            return;
        }
        if(y > Canvas.canvasRules.height){
            return;
        }

        console.log('click:' + x + ', ' + y);
        var context = Canvas.canvasRules.getContext('2d');

        context.clearRect(0, 0, Canvas.canvasRules.width, Canvas.canvasRules.height);

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(Canvas.canvasRules.width, y);

        context.moveTo(x, 0);
        context.lineTo(x, Canvas.canvasRules.height);

        context.stroke();

    }
}