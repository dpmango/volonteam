$(document).ready(function(){
  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org


  // GENERIC FUNCTIONS
  ////////////////////

  var validateErrorPlacement = function(error, element) {
    error.addClass('ui-input-validation');
    error.appendTo(element.parent("div"));
  }
  var validateHighlight = function(element) {
    $(element).parent('div').addClass("has-error");
  }
  var validateUnhighlight = function(element) {
    $(element).parent('div').removeClass("has-error");
  }
  var validateSubmitHandler = function(form) {
    $(form).addClass('loading');
    $.ajax({
      type: "POST",
      url: $(form).attr('action'),
      data: $(form).serialize(),
      success: function(response) {
        $(form).removeClass('loading');
        var data = $.parseJSON(response);
        if (data.status == 'success') {
          // do something I can't test
        } else {
            $(form).find('[data-error]').html(data.message).show();
        }
      }
    });
  }

  /////////////////////
  // REGISTRATION FORM
  ////////////////////
  $("[js-validate-register]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      name: "required",
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6,
      },
      agree: "required"
    },
    messages: {
      name: "Заполните это поле",
      email: {
          required: "Заполните это поле",
          email: "Email содержит неправильный формат"
      },
      password: {
          required: "Заполните это поле",
          email: "Пароль мимимум 6 символов"
      }
    }
  });


  /////////////////////
  // LOGIN FORM
  ////////////////////
  $("[js-validate-login]").validate({
    errorPlacement: validateErrorPlacement,
    highlight: validateHighlight,
    unhighlight: validateUnhighlight,
    submitHandler: validateSubmitHandler,
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6,
      }
    },
    messages: {
      email: {
          required: "Заполните это поле",
          email: "Email содержит неправильный формат"
      },
      password: {
          required: "Заполните это поле",
          email: "Пароль мимимум 6 символов"
      }
    }
  });

});
