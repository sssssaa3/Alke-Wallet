$(document).ready(function () {
  const $spinner = $("#spinner");
  const $alerta = $("#mensaje-alerta");
  $spinner.hide();
  $alerta.hide();

  // -------------------------
  // Helpers
  // -------------------------
  function mostrarMensaje(texto, tipo) {
    $alerta
      .removeClass()
      .addClass("alert alert-" + tipo)
      .text(texto)
      .fadeIn(150);

    setTimeout(() => $alerta.fadeOut(150), 2500);
  }

  function formatoCLP(numero) {
    return (
      "$" +
      Number(numero || 0).toLocaleString("es-CL", {
        maximumFractionDigits: 0,
      })
    );
  }

  function getUsuarios() {
    return JSON.parse(localStorage.getItem("usuarios_alke")) || [];
  }

  function setUsuarios(usuarios) {
    localStorage.setItem("usuarios_alke", JSON.stringify(usuarios));
  }

  function getUsuarioActivoEmail() {
    return JSON.parse(localStorage.getItem("usuario_activo")) || null;
  }

  function getMovimientosKey(email) {
    return "movimientos_alke_" + email;
  }

  function agregarMovimiento(email, mov) {
    const key = getMovimientosKey(email);
    const movimientos = JSON.parse(localStorage.getItem(key)) || [];
    movimientos.unshift(mov); // último primero
    localStorage.setItem(key, JSON.stringify(movimientos.slice(0, 20)));
  }

  // -------------------------
  // Seguridad / cargar usuario
  // -------------------------
  const emailActivo = getUsuarioActivoEmail();

  if (!emailActivo) {
    window.location.href = "../../../index.html";
    return;
  }

  const usuarios = getUsuarios();
  const indexUsuario = usuarios.findIndex((u) => u.email === emailActivo);

  if (indexUsuario === -1) {
    window.location.href = "../../../index.html";
    return;
  }

  // Pintar saldo actual
  $("#saldo-actual").text(formatoCLP(usuarios[indexUsuario].saldo || 0));

  // -------------------------
  // Evento depósito
  // -------------------------
  $("#form-deposito").on("submit", function (e) {
    e.preventDefault();

    const monto = Number($("#monto").val());

    if (!Number.isFinite(monto) || monto <= 0) {
      mostrarMensaje("Ingresa un monto válido mayor que 0.", "danger");
      return;
    }

    // UI feedback
    $("#form-deposito").hide();
    $spinner.show();

    // Actualizar saldo
    const saldoActual = Number(usuarios[indexUsuario].saldo || 0);
    const nuevoSaldo = saldoActual + monto;
    usuarios[indexUsuario].saldo = nuevoSaldo;

    setUsuarios(usuarios);

    // Registrar movimiento (simple)
    agregarMovimiento(emailActivo, {
      id: Date.now(),
      tipo: "DEPOSITO",
      monto: monto,
      fecha: new Date().toISOString(),
      detalle: "Depósito realizado",
      saldoDespues: nuevoSaldo,
    });

    // Simular carga
    setTimeout(() => {
      $spinner.hide();
      $("#saldo-actual").text(formatoCLP(nuevoSaldo));
      mostrarMensaje("Depósito realizado. Redirigiendo al menú...", "success");
    }, 900);

    setTimeout(() => {
      window.location.href = "../app/menu.html";
    }, 2000);
  });
});
