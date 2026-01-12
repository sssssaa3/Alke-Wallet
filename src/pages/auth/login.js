$(document).ready(function () {
  const $alerta = $("#mensaje-alerta");

  const $spinner = $("#spinner");
  $spinner.hide();

  $("#form-registro").on("submit", function (event) {
    event.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val();

    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios_alke")) || [];

    const usuarioExistente = usuariosGuardados.find((u) => u.email === email);

    if (!usuarioExistente) {
      mostrarMensaje("Credenciales Incorrectas.", "danger");
      return;
    }

    if (usuarioExistente.password !== password) {
      mostrarMensaje("Credenciales Incorrectas.", "danger");
      return;
    }

    localStorage.setItem("usuario_activo", JSON.stringify(email));

    $("#form-registro").hide();

    $("#form-registro")[0].reset();
    $spinner.show();

    setTimeout(() => {
      $spinner.hide();
    }, 2400);

    setTimeout(() => {
      mostrarMensaje("¡Registro exitoso! Redirigiendo...", "success");
    }, 2500);

    setTimeout(function () {
      window.location.href = "../app/menu.html";
    }, 3500);
  });

  function mostrarMensaje(texto, tipo) {
    const claseAlerta = "alert-" + tipo;
    $("#mensaje-alerta").text(texto).addClass(claseAlerta).fadeIn(300);
    setTimeout(() => {
      $alerta.text("").hide().removeClass("alert-success alert-danger");
    }, 3500);
  }
});
