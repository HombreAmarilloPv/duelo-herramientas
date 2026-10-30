# Matriz de decisión

**Equipo:** Playwright 
**Escenario:** Pagos Ágiles — Fintech que despliega varias veces al día

Las tres opciones son las mismas de la presentación: **Selenium** (con Mocha en este duelo), **Cypress** y **Playwright**.
La pregunta de si hace falta una capa BDD (Cucumber) por encima va aparte, en el `ADR.md`.

## Cómo se llena (en este orden)

1. **Pesos.** Repartan **100 puntos** entre los ocho criterios según lo que el escenario necesita. Un criterio puede valer 0 si no importa. Escriban en una frase *por qué* pesa lo que pesa: esa frase se califica.
2. **Puntajes de 1 a 5** por herramienta y criterio (5 = lo cubre muy bien). Cada puntaje lleva **evidencia**, con una etiqueta:
   - **[tablero]** un dato de la clase (diga cuál: «Cypress, 10/10 corridas, mediana 1,8× el control»).
   - **[doc]** documentación oficial (pongan el enlace y lo que dice).
   - **[exp]** lo que vivió el equipo en el laboratorio (qué pasó, en qué parte).

   Un puntaje sin evidencia no cuenta. Una opinión sin dato se marca como opinión: `[opinión]`.
3. **Total** = Σ (peso × puntaje) ÷ 100. El máximo es 5,00.
4. **Prueba de sensibilidad.** Suban 10 puntos al peso del criterio del que más dudaron (bajándoselos a otro). ¿Cambió el ganador? Anótenlo abajo: si cambia con 10 puntos, la decisión es frágil y el ADR debe decirlo.

## De dónde sale la evidencia de cada criterio

| # | Criterio | La pregunta | En el duelo se mide… | Para el resto, busquen… |
|---|---|---|---|---|
| 1 | **Encaje** | ¿Calza con el lenguaje, las habilidades y los procesos del equipo del escenario? | **[exp]** minutos hasta el verde y obstáculos (`ENTREGA.md` §2) | **[doc]** lenguajes que soporta |
| 2 | **Cobertura** | ¿Cubre los navegadores, móviles y APIs que el escenario necesita? | — (no se mide aquí) | **[doc]** navegadores y plataformas soportados |
| 3 | **Estabilidad** | ¿Espera sola o las esperas se programan a mano? ¿Falló alguna corrida? | **[tablero]** corridas completas / corridas | **[exp]** esperas que tuvimos que escribir |
| 4 | **Diagnóstico** | Cuando falla, ¿se ve por qué? | **[tablero]** puntos de diagnóstico (0 a 5) | |
| 5 | **Velocidad** | ¿Cuánto tarda, descontando la máquina? | **[tablero]** mediana y «veces el control» | **[doc]** paralelismo |
| 6 | **Integración** | ¿Se lleva bien con CI, informes y Jira? | **[exp]** qué informe dejó y en qué formato | **[doc]** guías de integración continua |
| 7 | **Comunidad y futuro** | ¿Quién la mantiene y hasta cuándo? | **[tablero]** días desde la última publicación | **[doc]** repositorio, frecuencia de versiones, quién la respalda |
| 8 | **Costo total** | Licencias + aprender + mantener | **[tablero]** líneas de código · **[exp]** minutos | **[doc]** licencia y servicios de pago |

> Ojo con los datos del tablero: son **3 pruebas, 10 corridas, una máquina por equipo**. Sirven para comparar, no para sentenciar. Si un dato no les alcanza para puntuar, díganlo en la columna de evidencia.

## La matriz

| Criterio | Peso | Selenium | Cypress | Playwright | ¿Por qué ese peso? · Evidencia de los puntajes |
|---|---:|:---:|:---:|:---:|---|
| 1 · Encaje | 15 | 4 | 5 | 5 | El equipo trabaja con TypeScript y React, por lo que necesita una herramienta fácil de integrar y aprender. |
| 2 · Cobertura | 15 | 5 | 4 | 5 | Debe probar Chrome en computadores y Safari en iPhone, porque ambos son utilizados por sus clientes. |
| 3 · Estabilidad | 20 | 3 | 3 | 4 | Es el criterio más importante: los falsos positivos pueden detener entre 5 y 10 despliegues diarios. |
| 4 · Diagnóstico | 15 | 3 | 5 | 4 | No hay testers dedicados; los desarrolladores necesitan identificar rápidamente las causas de los errores. |
| 5 · Velocidad | 15 | 3 | 4 | 5 | Las pruebas deben ejecutarse en menos de 10 minutos para no retrasar las entregas. |
| 6 · Integración | 5 | 4 | 4 | 4 | Debe conectarse fácilmente al pipeline de integración continua. |
| 7 · Comunidad y futuro | 5 | 5 | 4 | 4 | Conviene elegir una herramienta con documentación, actualizaciones y soporte de la comunidad. |
| 8 · Costo total | 10 | 5 | 5 | 5 | No hay presupuesto para servicios de automatización de pago. |
| **Total ponderado** (máx. 5,00) | **100** | **3,8** | **4,2** | **4,55** | Gana: Playwright |

## Prueba de sensibilidad

- Criterio que subimos 10 puntos: Cobertura y Velocidad (se lo bajamos a: Integración y Costo)
- ¿Cambió el ganador? ☐ No ☐ Sí → ahora gana: No cambió
- Lo que esto nos dice de nuestra decisión:

## Ganador de la matriz

**Playwright** con 4,55 puntos sobre 5,00.
¿Coincide con lo que habríamos elegido antes de medir?
Coincide con lo que habíamos eledigo.
