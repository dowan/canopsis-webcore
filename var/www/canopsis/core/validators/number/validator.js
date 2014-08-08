define([
], function() {

  function numberValidator(attr, valideStruct)
  {
    //debugger;
    if (!isNaN( attr.value ) &&  attr.value != ""  )
      {
          valideStruct.valid = true ;
      }
    else
      {
          valideStruct.valid = false ;
          valideStruct.error = "value should be a number";
      }

    return valideStruct;
  };

  return numberValidator;
});