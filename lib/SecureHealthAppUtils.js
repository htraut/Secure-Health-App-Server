
exports.StringToIntArray = function(text){
    var intArray = text.split(/\[|\]|\s|,/);
    var i;
    for(i = 0; i < intArray.length; i++){
   	if(intArray[i] === ""){
	     intArray.splice(i, 1);
	}
    }
    //console.log("intArray is: " + intArray);
    return intArray;
};

