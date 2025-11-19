// Importamos jest 
import { jest } from "@jest/globals";

// Como mapUser NO está exportada desde el service,
// lo copiamos aquí para poder testearlo como función unitaria.

const mapUser = (user) => ({
    ...user,
    activo: user.activo === 1
});

// ---------------- TEST ---------------- //
test("mapUser convierte activo=1 en activo=true", () => {
    // Datos simulados que representarían un usuario desde MySQL
    const mockUser = { id: 1, nombre: "Juan", activo: 1 };

    // Ejecutamos la función
    const result = mapUser(mockUser);

    // Afirmamos lo que esperamos que suceda
    expect(result.activo).toBe(true);  // Debe transformarse a booleano
});
