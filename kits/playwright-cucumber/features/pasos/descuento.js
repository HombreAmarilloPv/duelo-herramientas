const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

/**
 * Pasos de features/descuento.feature (US-09 CA1).
 *
 * Pasos que debes definir aquí (el texto debe coincidir con el del escenario):
 *   Given('que agrego {int} unidad(es) de {string} al carrito', ...)  → tarjeta del producto, cantidad, «Agregar»
 *   When('aplico el código {string}', ...)                            → campo «Código de descuento» y botón «Aplicar»
 *   Then('el descuento es {string}', ...)                             → la fila «Descuento» del carrito contiene ese valor
 *
 * Pista: el paso de agregar se parece mucho al de features/pasos/stock.js. ¿Lo van a repetir o a compartir?
 * (Con Cucumber, un paso definido en un archivo sirve a TODOS los escenarios.)
 */

Given('que agrego {int} unidad(es) de {string} al carrito', async function (cantidad, producto) {
    // Encuentra la tarjeta del producto por su nombre
    const productCard = this.page.locator(".rounded-lg").
        filter({
            has: this.page.getByRole("heading", {
                name: producto,
                level: 3,
            })
        });
    await productCard.getByRole("spinbutton").fill(`${cantidad}`);
    await productCard.getByRole("button", { name: "Agregar" }).click();
});

When('aplico el código {string}', async function (codigo) {
    await this.page.getByPlaceholder("Código de descuento").fill(codigo);
    await this.page.getByRole("button", { name: "Aplicar" }).click();
});

Then('el descuento es {string}', async function (descuento) {
    const discount = await this.page.locator(`dt:has-text("Descuento") + dd`)
    console.log(descuento);
    await expect(discount).toContainText(descuento);
});
