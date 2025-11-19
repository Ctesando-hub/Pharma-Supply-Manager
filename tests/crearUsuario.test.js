// ============================================================================
// Archivo: crearUsuario.test.js
// Descripción: Prueba unitaria del servicio crearUsuarioService utilizando Jest.
//              Valida que el servicio:
//                1) Hashee la contraseña con bcrypt
//                2) Convierta "activo" de booleano a entero
//                3) Llame correctamente al modelo mockeado
// ============================================================================

import { jest } from "@jest/globals"; // Permite usar mocks en ES Modules

// ============================================================================
// MOCK DEL MODELO (usuarios_model.js)
// ----------------------------------------------------------------------------
// Jest necesita simular todas las funciones exportadas por el modelo, porque
// crearUsuarioService importa todas. Si no se mockean todas, Jest lanza error.
// Esta mockeada reemplaza las funciones reales con versiones falsas.
// ============================================================================

jest.unstable_mockModule("../src/models/usuarios_model.js", () => ({
    crearUsuarioModel: jest.fn().mockResolvedValue({ message: "ok" }), // Respuesta simulada
    actualizarUsuarioModel: jest.fn(),  // mock vacío para evitar errores
    getUsuariosModel: jest.fn(),        // mock vacío
    getUsuarioByIDModel: jest.fn(),     // mock vacío
    searchUsuarioModel: jest.fn(),      // mock vacío
    eliminarUsuarioModel: jest.fn()     // mock vacío
}));

// ============================================================================
// IMPORTACIONES DINÁMICAS
// ----------------------------------------------------------------------------
// Cuando se usa "unstable_mockModule", Jest obliga a importar los módulos
// DESPUÉS de declarar el mock. Por eso se usa "await import()".
// ============================================================================

const { crearUsuarioService } = await import("../src/services/usuarios_service.js");
const { crearUsuarioModel } = await import("../src/models/usuarios_model.js");

// ============================================================================
// TEST: crearUsuarioService
// ----------------------------------------------------------------------------
// Objetivo: Verificar que el servicio transforme y procese los datos
// antes de enviarlos al modelo. Específicamente:
//
//   1) Que la contraseña sea hasheada con bcrypt
//   2) Que el campo "activo" pase de true → 1
//   3) Que se llame al modelo con los datos transformados
//   4) Que devuelva el resultado mockeado
// ============================================================================

test("crearUsuarioService debe hashear la contraseña y llamar al modelo", async () => {

    // ------------------------------
    // Usuario simulado (entrada)
    // ------------------------------
    const usuario = {
        nombre: "Carolina",
        password: "123456", // contraseña original sin encriptar
        activo: true         // debe transformarse a 1
    };

    // Ejecutamos el servicio real
    const result = await crearUsuarioService(usuario);

    // ------------------------------------------------------------------------
    // (1) Comprobación: la contraseña NO debe ser la misma
    // ------------------------------------------------------------------------
    expect(usuario.password).not.toBe("123456");

    // ------------------------------------------------------------------------
    // (2) Comprobación: bcrypt genera hashes que comienzan con "$2"
    // ------------------------------------------------------------------------
    expect(usuario.password.startsWith("$2")).toBe(true);

    // ------------------------------------------------------------------------
    // (3) Comprobación: el modelo debe recibir los datos ya transformados
    // ------------------------------------------------------------------------
    expect(crearUsuarioModel).toHaveBeenCalledWith({
        nombre: "Carolina",
        password: usuario.password, // hash generado
        activo: 1                   // true → 1
    });

    // ------------------------------------------------------------------------
    // (4) Verificar que el servicio devuelve el valor mockeado
    // ------------------------------------------------------------------------
    expect(result).toEqual({ message: "ok" });
});

