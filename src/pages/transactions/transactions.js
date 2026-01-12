$(document).ready(function () {
  const $spinner = $("#spinner");
  const $alerta = $("#mensaje-alerta");
  const $lista = $("#lista-movimientos");

  $spinner.hide();
  $alerta.hide();

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

  function formatearFechaISO(iso) {
    if (!iso) return "Sin fecha";
    const d = new Date(iso);
    return d.toLocaleString("es-CL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getUsuarioActivoEmail() {
    return JSON.parse(localStorage.getItem("usuario_activo")) || null;
  }

  function getMovimientos(email) {
    const key = "movimientos_alke_" + email;
    return JSON.parse(localStorage.getItem(key)) || [];
  }

  function setMovimientos(email, movimientos) {
    const key = "movimientos_alke_" + email;
    localStorage.setItem(key, JSON.stringify(movimientos));
  }

  const emailActivo = getUsuarioActivoEmail();
  if (!emailActivo) {
    window.location.href = "../../../index.html";
    return;
  }

  let movimientos = getMovimientos(emailActivo);
  let filtroActual = "TODOS";

  function render() {
    $lista.empty();

    let data = movimientos;

    if (filtroActual !== "TODOS") {
      data = movimientos.filter((m) => m.tipo === filtroActual);
    }

    if (data.length === 0) {
      $lista.append(`
        <div class="text-muted">
          No hay movimientos para mostrar.
        </div>
      `);
      return;
    }

    data.forEach((m) => {
      const esDeposito = m.tipo === "DEPOSITO";
      const icono = esDeposito ? "bi-arrow-down-circle" : "bi-arrow-up-circle";
      const color = esDeposito ? "text-success" : "text-danger";
      const signo = esDeposito ? "+" : "-";

      const titulo = esDeposito ? "Depósito" : "Transferencia";
      const subtitulo = esDeposito
        ? m.detalle || "Depósito realizado"
        : `Destino: ${m.destino || "—"}`;

      $lista.append(`
        <div class="list-group-item d-flex justify-content-between align-items-start">
          <div class="d-flex gap-3">
            <i class="bi ${icono} ${color} fs-4"></i>
            <div>
              <div class="fw-semibold text-dark">${titulo}</div>
              <div class="text-muted small">${subtitulo}</div>
              <div class="text-muted small">${formatearFechaISO(m.fecha)}</div>
            </div>
          </div>

          <div class="text-end">
            <div class="fw-bold ${color}">
              ${signo}${formatoCLP(m.monto)}
            </div>
            <div class="text-muted small">
              Saldo: ${formatoCLP(m.saldoDespues)}
            </div>
          </div>
        </div>
      `);
    });
  }

  $spinner.show();
  setTimeout(() => {
    $spinner.hide();
    render();
  }, 300);

  $(".filtro").on("click", function () {
    $(".filtro").removeClass("active");
    $(this).addClass("active");

    filtroActual = $(this).data("tipo");
    render();
  });

  $("#btn-limpiar").on("click", function () {
    const ok = confirm("¿Seguro que quieres borrar tus movimientos?");
    if (!ok) return;

    movimientos = [];
    setMovimientos(emailActivo, movimientos);
    mostrarMensaje("Movimientos borrados.", "success");
    render();
  });
});
