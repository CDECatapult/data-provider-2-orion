/*

function transform(data){
  console.log("IN TRANSFORM AIR QUALITY");
  //console.log(data);
  var idString = data.locname.toString().replace(/[\\"'()]/g, "");
  var idArray = idString.split(" ");
  var id = idArray[0];

  let transformed = {
        id : "urn:ngsiv2:AirQualityObserved:manchester:" + id,
        type : "AirQualityObserved",
        address: {
            value: {
                addressCountry: "UK",
                addressLocality: "Manchester",
                streetAddress: data.locname.toString.replace(/[\\"'()]/g, "")
            },
            type: "object"
        },
        location: {
            value: {
              coordinates: [parseFloat(data.lon), parseFloat(data.lat)],
              type: "Point"
            },
            type: "geo:json"
          },
    
    if (msg.payload.locname !== undefined)
        jsonMsg.address = {
            "value": {
                "addressCountry": "UK",
                "addressLocality": "Manchester",
                "streetAddress": msg.payload.locname
            },
            "type": "object"
        }
    else
        jsonMsg.address = {
            "value": {
                "addressCountry": "UK",
                "addressLocality": "Manchester",
                "streetAddress": msg.payload.title.split("-")[1]
            },
            "type": "object"
        }
        
    
    for (let i = 0; i < msg.payload.streams.length; i++){
        let attribute = msg.payload.streams[i];
        if (attribute.current_value !== undefined){
            jsonMsg.dateObserved = {
                "type": "DateTime",
                "value": new Date(attribute.current_time),
                "metadata": {}
                }
        }
        switch (attribute.tags[0].toUpperCase()){
            case "BTX":{
                if (attribute.current_value !== undefined){
                    jsonMsg.BTX = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"ppb",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "CO":{
                if (attribute.current_value !== undefined){
                    jsonMsg.CO = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"ppb",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "NO":{
                if (attribute.current_value !== undefined){
                    jsonMsg.NO = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{"unitCode":{
                                "value":"ppb",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "NO2":{
                if (attribute.current_value !== undefined){
                    jsonMsg.NO2 = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"ppb",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "NOX":{
                if (attribute.current_value !== undefined){
                    jsonMsg.NOX = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"GQ",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "NOXASNO2":{
                if (attribute.current_value !== undefined){
                    jsonMsg.NOXasNO2 = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"ppb",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "O3":{
                if (attribute.current_value !== undefined){
                    jsonMsg.O3 = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"ppb",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "PAH":{
                if (attribute.current_value !== undefined){
                    jsonMsg.PAH = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"ppb",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "PM1":{
                if (attribute.current_value !== undefined){
                    jsonMsg.PM1 = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"GQ",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "PM2":{
                if (attribute.current_value !== undefined){
                    jsonMsg.PM2 = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"GQ",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "PM10":{
                if (attribute.current_value !== undefined){
                    jsonMsg.PM10 = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"GQ",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "PM25":{
                if (attribute.current_value !== undefined){
                    jsonMsg.PM25 = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"GQ",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
            case "SO2":{
                if (attribute.current_value !== undefined){
                    jsonMsg.SO2 = {
                        "type":"Number",
                        "value":parseInt(attribute.current_value),
                        "metadata":{
                            "unitCode":{
                                "value":"GQ",
                                "type":"Text"
                            }
                        }
                    }
                }
                break;
            }
        }
    }
  
  return transformed;

}

module.exports = transform;

*/
