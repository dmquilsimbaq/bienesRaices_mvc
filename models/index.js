import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js";

// relacion 1:1 hasOne se lee de derecha a izquierda
// Precio.hasOne(Propiedad);
// relacion 1:1 hasOne una Propiedad Tiene un precio
// Forma Opcional
// Propiedad.belongsTo(Precio, { foreignKey: nombreClaveForanea });
Propiedad.belongsTo(Precio);
Propiedad.belongsTo(Categoria);
Propiedad.belongsTo(Usuario);

export { Categoria, Precio, Propiedad, Usuario };
