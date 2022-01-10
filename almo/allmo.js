var aztExam=aztExam || {};
aztExam.MonitorStudent=(function(){
    var instance;
    function createInstance(el) {
        var object = {
            prepairSession:function(){

            },
            startSession:function(){
        
            },
            stopSession:function(){
        
            },
        };
        return object;
    }
    return {
        getInstance: function (el) {
            if (instance==null) {
                instance = createInstance(el);
            }
            return instance;
        },
        releaseInst:function(){
            instance=null;
        },
        inst:function(){
            return this.getInstance();
        }
    };
})();
aztExam.MonitorTeacher=(function(){
    var instance;
    function createInstance(el) {
        var object = {
            prepairSession:function(){

            },
            startSession:function(){
        
            },
            stopSession:function(){
        
            },
        };
        return object;
    }
    return {
        getInstance: function (el) {
            if (instance==null) {
                instance = createInstance(el);
            }
            return instance;
        },
        releaseInst:function(){
            instance=null;
        },
        inst:function(){
            return this.getInstance();
        }
    };
})();