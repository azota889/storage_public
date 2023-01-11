


var notePlugin=function(pluginId){
    this.pluginId=pluginId;
   // console.log("constructor : "+this.pluginId);
    var _events={};

    /**
     * 
     */
    window.addEventListener("message", (a)=>{
        if(a.data && a.data.pluginId && a.data.pluginId==this.pluginId){
            var eventName=a.data.eventName;
            var data=a.data.data;
            this.emit(eventName,data);
        }
    });

    /**
     * 
     * @param {*} pluginId 
     * @param {*} eventName 
     * @param {*} data 
     */
    this.sendData=function(pluginId,eventName,data){
        parent.postMessage({
            pluginId:this.pluginId,
            eventName:eventName,
            data:data
        },"*")
    }

    /**
     * 
     * @param event {String} eventName 
     * @param callback {Function} function callback
     * @param caller  {Object} object to call
     * @returns 
     */
     this.on=function(event, callback, caller){
        //validate event & callback not null 
        if(!event || event.trim()=="" || !callback) {
            console.log("addEventListener need event not empty !");
            return;
        }

        let ev={
            event:event,
            callback:callback,
            caller:(caller)?caller:null
        }
        if(!_events) _events={};
        if(!_events[event]) _events[event]=[];
        _events[event].push(ev);
    }

    /**
     * 
     * @param event {String}
     * @param callback {Function}
     * @param caller {Object}
     * @returns 
     */
    this.removeListener=function(event, callback, caller){
        //event null remove all 
        if(!event ||  event.trim()=="") {
            for(var p in _events) delete _events[p];
            return;
        }
        //callback null remove all event
        if(!callback){
            if(_events[event]) delete _events[event];
            return;
        }
        //remove event equal input
        let arr=_events[event].concat([]);
        _events[event]=[];
        for(var i=0;i<arr.length;i++) {
            if(arr[i].callback!=callback) _events[event].push(arr[i]);
            else if(arr[i].caller!=caller) _events[event].push(arr[i]);
            else{
                //IEvent need remove 
            }
        }
    }
    

    /**
     * 
     * @param event {String} event name to trigger
     * @param args {Array} params to pass to callback function 
     * @returns 
     */
    this.emit=function(event,...args){
        if(!event || event.trim()=="") {
            console.log("_fireEvent need event not empty !");
            return;
        }

        let arr=_events[event];
        if(arr){
            for(var i=0;i<arr.length;i++) {
                var ev=arr[i];
                if(ev.callback) ev.callback.apply(ev.caller,args);
            }
        }
    }

    this.getQueryParams=function(qs){
        qs = qs.split('+').join(' ');
    
        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;
    
        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
    
        return params;
    }

    this.sendData(this.pluginId,"INITED");

}