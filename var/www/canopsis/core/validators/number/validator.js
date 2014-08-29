define([
], function() {

  function numberValidator(attr, valideStruct)
  {
    if ( Ember.isEmpty(attr.value) || !isNaN( attr.value )  )
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