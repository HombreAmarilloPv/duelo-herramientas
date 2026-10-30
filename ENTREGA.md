# Entrega · Duelo de herramientas

**Equipo:** Cucumber  
**Integrantes:** Jose David Palacio, Johan Andrés Opsina, Luis Fernando Valencia, Juan José Pérez  
**Repositorio:** https://github.com/HombreAmarilloPv/duelo-herramientas  
**Herramienta que nos tocó:** ☐ Selenium + Mocha &nbsp; ☐ Cypress &nbsp; ☑ Playwright + Cucumber  
**Escenario que nos tocó:** E1 · Pagos Ágiles — Fintech que despliega varias veces al días

> Completa este archivo a medida que avanzas (cada sección dice en qué parte de la guía se llena).
> Lo que se mide con números lo guarda el medidor en `medidas.json`; aquí va lo que un número no dice.
> Escribe con tus palabras: las respuestas copiadas de la guía, de otro equipo o de un asistente sin pasar por tu criterio no cuentan.

Archivos que entregan, todos en el repositorio y con `git push`:

| Archivo | Quién lo escribe | Parte |
|---|---|---|
| `ENTREGA.md` (este) | ustedes | 1 a 6 |
| `autoinforme.json` | ustedes (minutos y diagnóstico) | 2 a 4 |
| `medidas.json` y `medidas-control.json` | los genera el medidor (`npm run medir`) | 4 |
| `MATRIZ.md` | ustedes | 5 |
| `ADR.md` | ustedes | 6 |
| Las pruebas de su kit (las tres historias) | ustedes | 1 a 3 |

---

## 1. Qué hace la herramienta por nosotros (Parte 1)

Lean el ejemplo resuelto (US-01 CA1) en su kit, **línea por línea**, y los archivos de `soporte` o de configuración
que vienen con él. Para cada tarea que alguien debe cumplir en una prueba de interfaz, digan **quién la hace**:
*la herramienta sola*, *una librería que hubo que sumar* (¿cuál?) o *código nuestro*. Escriban el archivo y la línea.

| Tarea | ¿Quién la hace? | ¿Dónde lo vemos? (archivo y línea) |
|---|---|---|
| Abrir el navegador y cerrarlo al terminar | **Código nuestro (del kit)** que llama a Playwright como librería; Cucumber solo ofrece los *hooks* donde ponerlo | `features/soporte/mundo.js` L28 (`chromium.launch`), L14-15 (contexto y página por escenario), L38 (`contexto.close`), L42 (`navegador.close`) |
| Esperar a que el elemento exista o se pueda usar | **Librería sumada:** Playwright (espera automática de los localizadores y acciones) | `features/pasos/catalogo.js` L9 (`getByRole` + `toHaveCount`); `features/pasos/stock.js` L31-32 (`fill` y `click` esperan solos) |
| Reintentar una comprobación que todavía no se cumple | **Librería sumada:** el `expect` de `@playwright/test` (aserciones web-first, reintenta hasta 5 s) | `features/pasos/catalogo.js` L2 y L9. En el fallo a propósito el registro dice «14 × locator resolved to 8 elements» |
| Ejecutar las pruebas, contarlas y decir cuántas pasaron | **La herramienta:** Cucumber (`cucumber-js`), con la configuración del kit | `package.json` script `test`; `cucumber.js` L3-9 (rutas, etiquetas, formatos). Imprime «3 scenarios (3 passed)» |
| Comprobar un valor y mostrar «esperado» y «recibido» | **Librería sumada:** el `expect` de `@playwright/test` (Cucumber no trae aserciones) | `features/pasos/catalogo.js` L2 y L9 → «Expected: 9 / Received: 8» |
| Leer el texto de un `alert()` del navegador *(lo descubren en la Parte 2)* | **Código nuestro (del kit):** un escuchador de `dialog` de Playwright que guarda el texto en `this.avisos` y acepta; nosotros solo comprobamos la lista | `features/soporte/mundo.js` L16-20; `features/pasos/stock.js` L35-41 |
| Dejar evidencia (captura, video o traza) cuando una prueba falla | **Nadie, por defecto.** Solo queda el informe HTML de Cucumber porque lo pide la configuración del kit; captura y traza habría que programarlas en el `After` | `cucumber.js` L8 (`html:informe/cucumber.html`); `features/soporte/mundo.js` L35-38 (comentario: «Cucumber no deja una captura…») |

**Con esta tabla:** ¿la herramienta que nos tocó es una *librería*, un *framework*, o una librería con piezas que
tuvimos que armar nosotros? Respondan en dos frases con la idea «la librería la llamas tú; el framework te llama a ti».

> _Respuesta:_ Es una **librería con piezas que tuvimos que armar**. Cucumber sí es un framework (él nos llama a
> nosotros: lee el `.feature` y ejecuta nuestros pasos y *hooks*), pero Playwright aquí es una librería: somos nosotros
> quienes llamamos a `chromium.launch()`, creamos el contexto, escuchamos los `alert()` y cerramos todo en `mundo.js`,
> cosas que Playwright Test (el control) ya hace solo.

## 2. Bitácora de las historias (Partes 2 y 3)

Una columna por historia. «Minutos» son los mismos que anotan en `autoinforme.json`: desde que empiezan a escribir
hasta que ven la prueba en verde.

| | US-04 CA2 (7 mochilas, stock 6) | US-09 CA1 (DESC10) |
|---|---|---|
| Minutos hasta el verde | 30 | 30 |
| Primer intento que **no** funcionó: qué escribimos y qué dijo la herramienta | Buscamos la cantidad y el botón en toda la página (`this.page.getByRole("spinbutton")`). Playwright respondió `strict mode violation: getByRole('spinbutton') resolved to 8 elements`. Luego intentamos ver el aviso con `getByText(...)` y falló con `element(s) not found`, porque el `alert()` no está en la página | Leímos la fila con `getByText('Descuento')` y dio `strict mode violation: getByText('Descuento') resolved to 2 elements` (también coincide con «Código aplicado: 10% de descuento.») |
| Mensaje de error que nos ayudó (o que nos confundió) | Ayudó el *strict mode violation*: lista los 8 `<input>` y sugiere `.first()`/`.nth()`, así entendimos que había que ubicar primero la tarjeta. Confundió el `element(s) not found` del aviso: no dice que el texto estaba en un `alert()` | Ayudó: mostraba los dos elementos que coincidían, y con eso pasamos a la pareja `dt` + `dd` (`dt:has-text("Descuento") + dd`) |
| Qué tuvimos que buscar en la documentación (enlace) | Diálogos: https://playwright.dev/docs/dialogs · Filtrar localizadores: https://playwright.dev/docs/locators#filtering-locators · El *World* de Cucumber: https://github.com/cucumber/cucumber-js/blob/main/docs/support_files/world.md | `toContainText`: https://playwright.dev/docs/api/class-locatorassertions#locator-assertions-to-contain-text · Expresiones de Cucumber (`{int}`, `{string}`, `unidad(es)`): https://github.com/cucumber/cucumber-expressions |
| Qué haría distinto un equipo con más experiencia en esta herramienta | Pondría el paso «agregar» en un archivo común en vez de repetirlo, y no usaría la clase CSS `.rounded-lg` (se rompe si cambia el diseño) | Ubicaría la tarjeta «Carrito» por su título, como el control; quitaría el `console.log` que dejamos; compartiría el paso de agregar con `stock.js` (hoy está copiado) |

**Lo más distinto frente a US-01 CA1** (el ejemplo resuelto): ¿qué cambió al leer un `alert()`, al elegir *dentro de
una tarjeta* y al leer un valor del carrito? Piensen en esperas, selectores y en cómo leyeron el resultado.

> _Respuesta:_ En US-01 bastaba un localizador y una aserción. En US-04 el resultado no está en la página: el `alert()` lo
> captura `mundo.js` y nosotros comprobamos una lista (`this.avisos`), y esa comprobación **no reintenta** como las de
> localizadores, porque es un valor normal de JavaScript. En los selectores tuvimos que pasar de «buscar en toda la página»
> a «buscar dentro de la tarjeta» con `filter({ has: ... })`, porque hay 8 botones «Agregar» y 8 campos de cantidad. En
> US-09 la fila «Descuento» aparece solo después de aplicar el código; no escribimos ninguna espera, `toContainText`
> reintentó hasta que React la dibujó. Con `fill` tampoco hubo problema de «17 en vez de 7»: reemplaza el valor del campo.

## 3. Lo que medimos (Parte 4)

Pega el resumen que imprimió `npm run medir` en tu kit y en el control (Playwright Test):

```text
Midiendo: Playwright + Cucumber (BDD) · 5 corridas · carpeta kits/playwright-cucumber
Resumen
  Velocidad ......... mediana 3.82 s  (mínimo 3.1 · máximo 4.08)
  Estabilidad ....... 5 de 5 corridas completas
  Código ............ 72 líneas de pruebas + 37 de soporte = 109
  @cucumber/cucumber  13.3.0 instalada · última publicación hace 22 días (v13.3.0)
  @playwright/test .. 1.64.1 instalada · última publicación hace 13 días (v1.64.1)
  Autoinforme ....... minutos {"instalacion":"3m","ca2":"30m","ca3":"30m"}, diagnóstico 3/5
```

```text
Midiendo: Playwright Test (control) · 5 corridas · carpeta control/playwright
Resumen
  Velocidad ......... mediana 3.46 s  (mínimo 3.39 · máximo 3.47)
  Estabilidad ....... 5 de 5 corridas completas
  Código ............ 34 líneas de pruebas + 14 de soporte = 48
  @playwright/test .. 1.64.1 instalada · última publicación hace 13 días (v1.64.1)
```

- Mediana de nuestro kit: **3,82** s · Mediana del control en **nuestra** máquina: **3,46** s · **Veces el control** (kit ÷ control): **1,10**
- Corridas completas de nuestro kit: **5** de **5**
- Líneas de código (pruebas + soporte): **109** (72 + 37)
- Puntos de diagnóstico (de 5): **3**

**El fallo a propósito.** ¿Qué rompieron y cómo? Pega las primeras 10 líneas de lo que dijo la herramienta y señala
qué ayudaba a encontrar la causa y qué faltaba.

Cambiamos `Entonces veo 8 productos` por `Entonces veo 9 productos` en `features/ver_catalogo.feature` y corrimos `npm test`:

```text
Failed scenarios:
  1) US-01 CA1 · El catálogo muestra 8 productos # features/ver_catalogo.feature:5
       Entonces veo 9 productos # features/pasos/catalogo.js:8
           Error: expect(locator).toHaveCount(expected) failed

           Locator:  getByRole('heading', { level: 3 })
           Expected: 9
           Received: 8
           Timeout:  5000ms
```

**Lo que ayudaba:** dice qué escenario y qué paso fallaron (con la línea del `.feature` y del archivo de pasos), qué
localizador se usó y muestra «Expected: 9 / Received: 8»; el registro de llamadas confirma que reintentó durante 5 s.
**Lo que faltaba:** no quedó captura ni traza de cómo se veía la página; la pila de llamadas trae muchas líneas internas de
`node_modules` antes de llegar a la nuestra (`catalogo.js:9:62`); y el error sale del `expect` de Playwright, no de Cucumber.

**Las cinco preguntas del diagnóstico** (se contestan **con el kit tal como llegó**, y el «sí» o «no» va en `autoinforme.json`).
En la última columna digan *de dónde vino* cada evidencia: de la **herramienta** (sola), de la **configuración del kit** o de
**código nuestro**.

| Pregunta (campo en `autoinforme.json`) | ¿Sí o no? | ¿De dónde vino? |
|---|:---:|---|
| ¿El mensaje dice **qué** falló (el elemento o la comprobación), sin que haya que adivinar? (`diceQueFallo`) | Sí | **Herramienta:** Cucumber marca el escenario y el paso; el `expect` de Playwright nombra la comprobación y el localizador |
| ¿Muestra el valor **esperado** y el **recibido**? (`esperadoYRecibido`) | Sí | **Herramienta:** el `expect` de `@playwright/test` (Expected: 9 / Received: 8) |
| ¿Señala la **línea de nuestra prueba** donde falló? (`lineaDeLaPrueba`) | Sí | **Herramienta:** Cucumber da `ver_catalogo.feature:5` y `catalogo.js:8`; la pila llega a `catalogo.js:9:62` |
| ¿Quedó una **captura de pantalla** (o un video) de la falla en el disco? (`capturaOVideo`) | No | Nadie la genera: habría que programarla en el `After` de `mundo.js` |
| ¿Quedó una **traza o un informe** para repasar la falla paso a paso sin volver a correrla? (`trazaOInforme`) | No | No hay traza de Playwright. Solo queda `informe/cucumber.html` (**configuración del kit**, `cucumber.js` L8), que lista los pasos y el error pero no deja ver la página en cada paso |

**Tres cosas que nuestra medición NO demuestra** (pistas: cuántas pruebas, cuántas corridas, cuántas máquinas,
qué mide el tiempo, qué cuenta una «línea de código»):

1. **Son 3 pruebas, no 300.** Todas las suites corren con un solo *worker*, así que no vemos el efecto del paralelismo
   ni cómo crece el tiempo o el mantenimiento con una suite real como la de Pagos Ágiles.
2. **Son 5 corridas en una sola máquina (Windows) y solo en Chrome.** 5 de 5 no demuestra que no haya pruebas
   inestables (una falla del 5 % podría no aparecer) y no dice nada de Safari/WebKit ni de un servidor de CI.
3. **El tiempo y las líneas no miden lo que parecen.** El tiempo incluye arrancar el servidor y el navegador (en 3
   pruebas eso pesa casi todo), y las líneas cuentan igual una línea de Gherkin que una de código: no miden legibilidad
   ni lo difícil que es mantener cada una.

## 4. Mirando el tablero (Parte 5)

Abran el tablero de la clase (el enlace lo da el docente) y respondan **con datos del tablero**, no con opiniones:

1. ¿Qué herramienta fue más rápida, medida en «veces el control»? ¿Y la más estable? ¿Hubo diferencias grandes **dentro** de una misma herramienta entre equipos? ¿A qué lo atribuyen?
2. ¿Qué herramienta dejó mejor diagnóstico y qué parte vino «de fábrica» o la tuvo que armar el equipo?
3. Un dato del tablero que les pareció raro. ¿Qué preguntarían a ese equipo antes de usarlo como evidencia?

> _Respuestas:_
>
> 1. ⟨Completar con el tablero: herramienta con menor «veces el control» y con más corridas completas.⟩ Nuestro dato:
>    Playwright + Cucumber quedó en 1,10× el control con 5/5 corridas. Dentro de una misma herramienta, las diferencias
>    entre equipos se explican sobre todo por la máquina (por eso se divide entre el control), por correr 5 o 10 corridas
>    y por cómo escribió cada equipo sus pruebas (esperas manuales, selectores).
> 2. ⟨Completar con el tablero: puntos de diagnóstico de cada herramienta.⟩ Nuestro kit sacó 3/5: lo que dio vino de
>    fábrica (Cucumber + el `expect` de Playwright); la captura y la traza no venían y había que armarlas. El control, en
>    cambio, las tiene en su configuración (`playwright.config.js`: `screenshot` y `trace`).
> 3. ⟨Completar con un dato raro del tablero⟩. Antes de usarlo preguntaríamos: ¿cuántas corridas hicieron?, ¿midieron
>    también el control en la misma máquina?, ¿midieron contra la tienda local o contra Vercel?, ¿las corridas fallidas
>    fueron por la herramienta o por una prueba mal escrita?

## 5. Matriz y decisión (Partes 5 y 6)

☑ `MATRIZ.md` completa (pesos que suman 100, puntajes con evidencia, total y prueba de sensibilidad)  
☑ `ADR.md` completo (una página, con consecuencias negativas y qué nos haría cambiar de opinión)  
☑ `medidas.json`, `medidas-control.json` y `autoinforme.json` en el repositorio, con `git push`

| Criterio | Peso | Selenium | Cypress | Playwright | ¿Por qué ese peso? · Evidencia de los puntajes |
|---|---:|:---:|:---:|:---:|---|
| 1 · Encaje | 15 | 4 | 5 | 5 | El equipo trabaja en TypeScript y React: la herramienta debe usar su lenguaje. [doc] Cypress y Playwright son JS/TS nativos; Selenium también tiene JS, pero exige armar ejecutor y aserciones. [exp] 30 + 30 min hasta el verde |
| 2 · Cobertura | 15 | 5 | 4 | 5 | Sus clientes usan Chrome y Safari en iPhone. [doc] Playwright trae WebKit de fábrica; Selenium maneja el Safari real (solo en macOS); Cypress tiene WebKit experimental |
| 3 · Estabilidad | 20 | 3 | 3 | 4 | Lo que más le duele: una prueba inestable frena 5 a 10 despliegues diarios. [tablero] nuestro kit y el control 5/5 corridas · [exp] no escribimos ninguna espera manual |
| 4 · Diagnóstico | 15 | 3 | 5 | 4 | Sin testers, quien desarrolla debe entender la falla rápido. [tablero] nuestro kit 3/5; el control deja captura y traza con su configuración |
| 5 · Velocidad | 15 | 3 | 4 | 5 | El CI debe terminar en menos de 10 minutos. [tablero] nuestro kit 1,10× el control · [doc] paralelismo y *sharding* gratis en Playwright |
| 6 · Integración | 5 | 4 | 4 | 4 | Debe correr en su pipeline; las tres lo hacen con Node.js. [exp] Cucumber dejó informe HTML |
| 7 · Comunidad y futuro | 5 | 5 | 4 | 4 | Importa, pero no es lo urgente. [tablero] @playwright/test publicado hace 13 días, @cucumber/cucumber hace 22 |
| 8 · Costo total | 10 | 5 | 5 | 5 | Sin presupuesto para nube: [doc] las tres son de código abierto y gratuitas. [tablero] 109 líneas nuestro kit vs 48 el control |
| **Total ponderado** (máx. 5,00) | **100** | **3,80** | **4,20** | **4,55** | Gana Playwright; no cambia en la prueba de sensibilidad |

**Nuestra recomendación en una frase:**

> _Para Pagos Ágiles recomendamos Playwright Test en TypeScript, sin Cucumber, porque es el más estable y rápido de los
> tres en nuestras mediciones, cubre Chrome y el motor de Safari sin pagar nada, y la capa BDD no la leería nadie en un
> equipo de cuatro desarrolladores._

## 6. Reflexión

1. Antes de medir, ¿qué herramienta habríamos recomendado? ¿Cambió algo después de ver los datos de **todas** las herramientas? Si la que recomendamos no es la que nos tocó, ¿por qué? Si lo es, ¿qué habría pasado si nos hubiera tocado otra?
2. ¿Qué evidencia nos hizo falta y no pudimos medir en esta actividad (por ejemplo: 300 pruebas en lugar de 3, otros navegadores, un mes de mantenimiento)?
3. En una automatización real, ¿qué parte del esfuerzo creen que es **escribir** las primeras pruebas y qué parte es **mantenerlas**? ¿Qué parte de esto no capta nuestra actividad?
4. Si el cliente fuera la empresa donde quieren trabajar, ¿qué pesos cambiarían en la matriz?
5. Si usaron un asistente de IA: ¿en qué momentos ayudó y en cuáles hubo que corregirlo? ¿Cómo cambia eso lo que significan los minutos de `autoinforme.json`?

> _Respuestas:_
>
> 1. Antes de medir ya pensábamos en Playwright por su fama de rápido y por ser de Microsoft, y los datos lo
>    confirmaron. Lo que sí cambió fue la capa BDD: después de comparar con el control (109 contra 48 líneas, sin
>    captura ni traza) no recomendaríamos Cucumber para este cliente. Si nos hubiera tocado Selenium, seguramente
>    habríamos tenido que escribir esperas a mano y habríamos valorado aún más la espera automática.
> 2. Nos faltó medir con muchas más pruebas y en paralelo, correr en WebKit y en un iPhone real (el punto débil de la
>    cobertura), medir en un servidor de CI y no solo en un portátil, y ver qué pasa con las pruebas cuando la interfaz
>    cambia durante semanas.
> 3. Creemos que escribir las primeras pruebas es la parte pequeña y que la mayor parte del esfuerzo es mantenerlas:
>    arreglar selectores cuando cambia el diseño (como nuestro `.rounded-lg`), investigar fallas intermitentes y
>    actualizar versiones. La actividad solo mide los primeros 60 minutos de escritura.
> 4. Depende de la empresa, pero en general subiríamos «Comunidad y futuro» e «Integración» (CI, informes, Jira) y
>    bajaríamos un poco «Velocidad», porque una herramienta que se usa por años importa más que segundos de diferencia.
> 5. No usamos IA para escribir las pruebas, así que los minutos de `autoinforme.json` son nuestros. Usamos un asistente
>    para organizar y redactar esta entrega a partir de nuestros datos, y la revisamos y corregimos nosotros.
