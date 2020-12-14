    
    function WebGLGlobeDataSource(name) {
        this._name = name;
        this._changed = new Cesium.Event();
        this._error = new Cesium.Event();
        this._isLoading = false;
        this._loading = new Cesium.Event();
        this._entityCollection = new Cesium.EntityCollection();
        this._seriesNames = [];
        this._seriesToDisplay = undefined;
        this._heightScale = 10000;
        this._entityCluster = new Cesium.EntityCluster();
    }

    Object.defineProperties(WebGLGlobeDataSource.prototype, {

        name: {
        get: function () {
            return this._name;
        },
        },
        
        clock: {
        value: undefined,
        writable: false,
        },
    
        entities: {
        get: function () {
            return this._entityCollection;
        },
        },
    
        isLoading: {
        get: function () {
            return this._isLoading;
        },
        },
    
        changedEvent: {
        get: function () {
            return this._changed;
        },
        },
        
        errorEvent: {
        get: function () {
            return this._error;
        },
        },
        
        loadingEvent: {
        get: function () {
            return this._loading;
        },
        },

        
        seriesNames: {
        get: function () {
            return this._seriesNames;
        },
        },
        
        seriesToDisplay: {
        get: function () {
            return this._seriesToDisplay;
        },
        set: function (value) {
            this._seriesToDisplay = value;

            var collection = this._entityCollection;
            var entities = collection.values;
            collection.suspendEvents();
            for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.show = value === entity.seriesName;
            }
            collection.resumeEvents();
        },
        },

        heightScale: {
        get: function () {
            return this._heightScale;
        },
        set: function (value) {
            if (value <= 0) {
            throw new Cesium.DeveloperError("value must be greater than 0");
            }
            this._heightScale = value;
        },
        },
    
        show: {
        get: function () {
            return this._entityCollection;
        },
        set: function (value) {
            this._entityCollection = value;
        },
        },
        
        clustering: {
        get: function () {
            return this._entityCluster;
        },
        set: function (value) {
            if (!Cesium.defined(value)) {
            throw new Cesium.DeveloperError("value must be defined.");
            }
            this._entityCluster = value;
        },
        },
    });

    WebGLGlobeDataSource.prototype._setLoading = function (isLoading) {
        if (this._isLoading !== isLoading) {
        this._isLoading = isLoading;
        this._loading.raiseEvent(this, isLoading);
        }
    };

    
    WebGLGlobeDataSource.prototype.onLoadData = function (data, colour) {

          
          
          this._setLoading(true);
          this._seriesNames.length = 0;
          this._seriesToDisplay = undefined;
    
          var heightScale = this.heightScale;
          var entities = this._entityCollection;
          var color    = "";
          var radius    = "";
          
          
          entities.suspendEvents();
          entities.removeAll();
          entities.resumeEvents();
          entities.suspendEvents();
         
          if (data != null){
              for (var x = 0; x < data.length; x++) {
                var item = data[x];
                var lineLength;
                if (colour === "red"){
                    color = Cesium.Color.RED;
                }else{
                    color = Cesium.Color.GREEN;
                }

                if (item.nbr === undefined){
                    lineLength = 1;
                }else{
                    lineLength = item.nbr;
                    heightScale = 6000;
                }
                
                var coef = 300 * 0.0000089;
                var new_lat = parseFloat(item.lat) + coef;
                
                var new_long = parseFloat(item.long) + coef / Math.cos(parseFloat(item.lat) * 0.018);

                var pos = Cesium.Cartesian3.fromDegrees(
                    colour === 'red' ? item.long : new_long + "",
                    colour === 'red' ? item.lat : new_lat + "",
                    0
                );
                
                
                var cylinderShape = new Cesium.CylinderGraphics();
                cylinderShape.material = new Cesium.ColorMaterialProperty(color);
                cylinderShape.length = lineLength * heightScale;
                cylinderShape.bottomRadius = 200;
                cylinderShape.topRadius = 200;
                var entity = new Cesium.Entity({
                    id: "seriesName" + " index " + x.toString(),
                    show: true,
                    position: pos,
                    cylinder: cylinderShape,
                    seriesName: "seriesName", //Custom property to indicate series name
                });
                entities.add(entity);
            }
            
          }
          entities.resumeEvents();
          this._changed.raiseEvent(this);
          this._setLoading(false);
    };


    
