/**
 * @author Marten Schälicke
 */

peerWeb.namespace("Connection");
peerWeb.Connection = function(config){
    "use strict";
    var Webrtc = peerWeb.Connection.WebRTC,
    Flash = peerWeb.Connection.Flash,
    Websocket = peerWeb.Connection.WebSocket,
    connection, ownid, protocolVersion = 0.1,
    sendIdentityMessage;
    
    if(config === null || config === undefined){
        throw {
            name: "Error",
            message: "no config Element"
        };
    }
    else{
        ownid = config.ownid;
    }
    
    if(config.onerror === undefined){
        config.onerror = function(err){peerWeb.log(err, "error");};
    }
    if(config.onclose === undefined){
        config.onclose = function(msg){peerWeb.log(msg, "warn");};
    }

    if(config.onmessage === undefined){
        config.onmessage = function(msg){peerWeb.log(msg, "log");};
    }

    if(config.onopen === undefined){
        config.onopen = function(msg){
            peerWeb.log(msg, "log");
            sendIdentityMessage();
        };
    }
    
    sendIdentityMessage = function(){
        var identityMessage = {
            head: {
                "protocolVersion": protocolVersion,
                "service": "network",
                "action": "peerIdentity"
            },
            body: {}
        };
        this.send(identityMessage);
    };
    
    
    //private
    (function(){
        var protocol = config.connectTo.split(":")[0];
        switch(protocol){
            case "ws":
            case "wss":
                connection = new Websocket(config);
                break;
            default:
                peerWeb.log("cannot determine connection type: "+protocol, "warn");
                break;
        }
    })();
    
    //public
    this.send = function(msg){
        if(typeof msg !== String){
            msg = JSON.stringify(msg);
        }
        connection.send(msg);
    };
};