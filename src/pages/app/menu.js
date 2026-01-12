$(document).ready(function () {
  const emailActivo = JSON.parse(localStorage.getItem("usuario_activo"));

  if (!emailActivo) {
    window.location.href = "../../../index.html";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios_alke")) || [];

  const usuario = usuarios.find((u) => u.email === emailActivo);

  if (!usuario) {
    window.location.href = "../../../index.html";
    return;
  }

  const cuentaKey = "cuenta_alke_" + emailActivo;
  let cuenta = localStorage.getItem(cuentaKey);

  if (!cuenta) {
    cuenta = String(Math.floor(Math.random() * 10 ** 11)).padStart(11, "0");
    localStorage.setItem(cuentaKey, cuenta);
  }

  $("#cuenta-numero").text(cuenta);

  const saldo = usuario.saldo || 0;

  $("#saldo-texto").text(
    "$" +
      saldo.toLocaleString("es-CL", {
        maximumFractionDigits: 0,
      })
  );

  $("#btn-depositar").on("click", function () {
    window.location.href = "../deposit/deposit.html";
  });

  $("#btn-transferir").on("click", function () {
    window.location.href = "../transfer/sendmoney.html";
  });

  $("#btn-movimientos").on("click", function () {
    window.location.href = "../transactions/transactions.html";
  });

  $("#btn-copiar").on("click", function () {
    navigator.clipboard.writeText(cuenta);
    $(this).text("Copiado ✓");

    setTimeout(() => {
      $(this).html('<i class="bi bi-clipboard"></i> Copiar');
    }, 1500);
  });
});
