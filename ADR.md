# ADR-001 · Herramienta de pruebas de interfaz para «Pagos Ágiles»

- **Estado:** Propuesta
- **Fecha:** 2026-10-30
- **Equipo:** Cucumber (Jose David Palacio, Johan Andrés Opsina, Luis Fernando Valencia, Juan José Pérez)

## Contexto

Pagos Ágiles es una fintech de Bogotá con cuatro desarrolladores full-stack en TypeScript y sin testers dedicados.
Despliegan entre 5 y 10 veces al día y su pipeline de CI debe terminar en menos de 10 minutos. La aplicación es una SPA
en React; los flujos críticos (registro, cobro y comprobante) hoy se prueban a mano en medio día. Sus clientes usan Chrome
en el computador y Safari en el iPhone. No hay presupuesto para servicios de pago en la nube. Lo que más les duele: una
prueba que falla «a veces» frena el despliegue de todos y termina ignorándose.

## Opciones consideradas

Selenium (con Mocha), Cypress y Playwright. La matriz con pesos y puntajes está en [`MATRIZ.md`](MATRIZ.md).
Criterios que más pesaron en este escenario: **Estabilidad (20)**, y luego **Encaje, Cobertura, Diagnóstico y Velocidad (15 cada uno)**.

## Decisión

Recomendamos **Playwright Test (sin capa Cucumber), escrito en TypeScript** porque obtuvo el mayor total de la matriz
(4,55 frente a 4,20 de Cypress y 3,80 de Selenium) y gana en lo que más pesa: espera y reintenta sola las comprobaciones
(en nuestro fallo a propósito reintentó 14 veces durante 5 s antes de fallar), corrió 5 de 5 veces sin fallos tanto en
nuestro kit como en el control, y es la única de las tres que prueba el motor de Safari (WebKit) de fábrica y gratis.
Además usa el mismo lenguaje del equipo (TypeScript) y paraleliza sin pagar servicios, lo que ayuda a cumplir los 10 minutos.

## Consecuencias

- **Lo que ganamos:** esperas automáticas que reducen las pruebas «a veces rojas»; Chrome y WebKit (perfil de iPhone) en la
  misma suite; trazas y capturas al fallar con dos líneas de configuración; paralelismo y *sharding* gratuitos; mismo
  lenguaje y mismo repositorio que la aplicación.
- **Lo que perdemos o se complica:**
  - WebKit de Playwright **no es** el Safari real de un iPhone: algunos errores propios de iOS no se verán; seguirá haciendo
    falta una revisión manual en un iPhone antes de los cambios grandes.
  - El diagnóstico no viene encendido: sin `screenshot` y `trace` en la configuración no queda evidencia (lo comprobamos:
    nuestro kit sacó 3 de 5 en diagnóstico). Cypress trae un ejecutor interactivo más amable para depurar.
  - Probar en dos motores duplica el tiempo de la suite; habrá que repartirla en *workers* o *shards* para no pasar de 10 minutos.
  - Sin Gherkin, las pruebas solo las leen quienes programan (en este equipo no es problema; ver abajo).
- **Lo que tendremos que hacer:** configurar `trace: 'retain-on-failure'` y `screenshot: 'only-on-failure'`; definir dos
  proyectos (Desktop Chrome y Mobile Safari/WebKit); cachear los navegadores en el CI; una regla de equipo para pruebas
  inestables (ponerlas en cuarentena y arreglarlas en el día, no reintentarlas a ciegas); unas horas de formación en
  localizadores por rol y aserciones web-first; empezar por los tres flujos críticos.

## Qué nos haría cambiar de opinión

- Si en un mes de uso aparecen más de 2 errores de producción que solo ocurren en Safari de iOS y WebKit no los reprodujo:
  habría que sumar pruebas en dispositivo real (otra herramienta o servicio), y revisar el peso de «Cobertura».
- Si con la suite completa y en paralelo el CI pasa de 10 minutos, o si más del 1 % de las corridas del CI fallan sin cambio
  en el código.
- Si el equipo contrata testers que no programan o negocio empieza a escribir los criterios en Dado/Cuando/Entonces:
  ahí volveríamos a evaluar la capa Cucumber.

## ¿Con capa BDD (Cucumber) o sin ella?

**Sin ella.** Frente al control, nuestro kit Playwright + Cucumber necesitó 109 líneas contra 48 (2,3 veces más), tardó
3,82 s contra 3,46 s de mediana (1,10 veces el control) y nos costó 30 + 30 minutos escribir dos escenarios; además el
navegador, el contexto y la lectura de `alert()` hubo que armarlos en `mundo.js`, y perdimos la captura y la traza que el
control sí configura. En Pagos Ágiles los cuatro lectores de las pruebas son los mismos desarrolladores que las escriben:
nadie leería los archivos `.feature`, así que la capa extra cuesta y no se aprovecha.

## Evidencia usada

- Tablero de la clase, consultado el 2026-10-__ a las __:__ : corridas completas, mediana y «veces el control», puntos de
  diagnóstico, líneas de código y días desde la última publicación de cada herramienta. Nuestros datos: kit 5/5 corridas,
  mediana 3,82 s, 1,10× el control, 109 líneas, diagnóstico 3/5; control 5/5, 3,46 s, 48 líneas.
- Documentación consultada:
  - Navegadores de Playwright (Chromium, Firefox, WebKit): https://playwright.dev/docs/browsers
  - Esperas automáticas: https://playwright.dev/docs/actionability · Aserciones que reintentan: https://playwright.dev/docs/test-assertions
  - Paralelismo y *sharding*: https://playwright.dev/docs/test-parallel · https://playwright.dev/docs/test-sharding
  - Traza y capturas: https://playwright.dev/docs/trace-viewer
  - Safari con Selenium (safaridriver, solo en macOS): https://www.selenium.dev/documentation/webdriver/browsers/safari/
  - Navegadores en Cypress (WebKit experimental): https://docs.cypress.io/app/references/launching-browsers
