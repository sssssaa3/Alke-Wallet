$(document).ready(function () {
  const $alerta = $("#mensaje-alerta");

  const $spinner = $("#spinner");
  $spinner.hide();

  $("#form-registro").on("submit", function (event) {
    event.preventDefault();

    const email = $("#email").val().trim();
    const password = $("#password").val();
    const confirmPassword = $("#password2").val();

    if (password !== confirmPassword) {
      mostrarMensaje("Las contraseñas no coinciden.", "danger");
      return;
    }

    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuarios_alke")) || [];

    const usuarioExistente = usuariosGuardados.find((u) => u.email === email);

    if (usuarioExistente) {
      mostrarMensaje("El correo electrónico ya está registrado.", "danger");
      return;
    }

    $("#form-registro").hide();

    $("#form-registro")[0].reset();
    $spinner.show();

    const nuevoUsuario = {
      id: Date.now(),
      email: email,
      password: password,
      saldo: 0,
    };

    usuariosGuardados.push(nuevoUsuario);

    localStorage.setItem("usuarios_alke", JSON.stringify(usuariosGuardados));

    setTimeout(() => {
      $spinner.hide();
    }, 2400);

    setTimeout(() => {
      mostrarMensaje("¡Registro exitoso! Redirigiendo...", "success");
    }, 2500);

    setTimeout(function () {
      window.location.href = "login.html";
    }, 3500);
  });

  function mostrarMensaje(texto, tipo) {
    const claseAlerta = "alert-" + tipo;
    $("#mensaje-alerta").text(texto).addClass(claseAlerta).fadeIn(300); // Efecto de aparición suave
    setTimeout(() => {
      $alerta.text("").hide().removeClass("alert-success alert-danger");
    }, 3500);
  }
});
