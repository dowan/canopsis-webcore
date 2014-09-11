define([
], function() {

  function maxItems(attr, valideStruct)
  {
    var maxItems = attr.model.options.maxItems;
    if(attr.value.length <= maxItems){

      valideStruct.valid = true ;

    }
    else{

        valideStruct.valid = false ;
        valideStruct.error = "There can be at most " + maxItems + " item(s).";

    }
    return valideStruct;
  }

  return maxItems;
});
