$(document).ready(function () {
  const usuariosGuardados =
    JSON.parse(localStorage.getItem("usuarios_alke")) || [];

  const usuarioActivo =
    JSON.parse(localStorage.getItem("usuario_activo")) || [];

  const usuarioExistente = usuariosGuardados.find(
    (u) => u.email === usuarioActivo
  );
});
