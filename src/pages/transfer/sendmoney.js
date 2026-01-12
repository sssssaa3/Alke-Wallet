$(document).ready(function () {
  const $spinner = $("#spinner");
  const $alerta = $("#mensaje-alerta");

  $spinner.hide();
  $alerta.hide();

  function mostrarMensaje(texto, tipo) {
    $alerta
      .removeClass()
      .addClass("alert alert-" + tipo)
      .text(texto)
      .fadeIn(150);

    setTimeout(() => $alerta.fadeOut(150), 2600);
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
    movimientos.unshift(mov);
    localStorage.setItem(key, JSON.stringify(movimientos.slice(0, 20)));
  }

  const emailActivo = getUsuarioActivoEmail();
  if (!emailActivo) {
    window.location.href = "../../../index.html";
    return;
  }

  const usuarios = getUsuarios();
  const idx = usuarios.findIndex((u) => u.email === emailActivo);

  if (idx === -1) {
    window.location.href = "../../../index.html";
    return;
  }

  $("#saldo-disponible").text(formatoCLP(usuarios[idx].saldo || 0));

  $("#form-transferencia").on("submit", function (e) {
    e.preventDefault();

    const destino = $("#destino").val().trim();
    const monto = Number($("#monto").val());

    if (destino.length < 6) {
      mostrarMensaje("Cuenta destino inválida (muy corta).", "danger");
      return;
    }

    if (!Number.isFinite(monto) || monto <= 0) {
      mostrarMensaje("Ingresa un monto válido mayor que 0.", "danger");
      return;
    }

    const saldoActual = Number(usuarios[idx].saldo || 0);

    if (monto > saldoActual) {
      mostrarMensaje(
        "Saldo insuficiente para realizar la transferencia.",
        "danger"
      );
      return;
    }

    $("#form-transferencia").hide();
    $spinner.show();

    const nuevoSaldo = saldoActual - monto;
    usuarios[idx].saldo = nuevoSaldo;
    setUsuarios(usuarios);

    agregarMovimiento(emailActivo, {
      id: Date.now(),
      tipo: "TRANSFERENCIA",
      monto: monto,
      destino: destino,
      fecha: new Date().toISOString(),
      detalle: "Transferencia enviada",
      saldoDespues: nuevoSaldo,
    });

    setTimeout(() => {
      $spinner.hide();
      $("#saldo-disponible").text(formatoCLP(nuevoSaldo));
      mostrarMensaje(
        "Transferencia realizada. Redirigiendo al menú...",
        "success"
      );
    }, 900);

    setTimeout(() => {
      window.location.href = "../app/menu.html";
    }, 2000);
  });
});
