define([
], function() {

  function minItems(attr, valideStruct)
  {
    var minItems = attr.model.options.minItems;
    if(attr.value.length >= minItems){

      valideStruct.valid = true ;

    }
    else{

        valideStruct.valid = false ;
        valideStruct.error = "Must have at least " + minItems + " item(s).";

    }
    return valideStruct;
  }

  return minItems;
});
