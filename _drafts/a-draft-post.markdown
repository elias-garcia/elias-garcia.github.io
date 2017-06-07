---
title:  "Cambios en Angular 4"
## date: add a date when publishing
description: Work in progress
topic: angular
---

Hace una semana ha sido publicada la versión 4.0 de Angular, la cuál incluye mejoras
significativas en rendimiento, pero también incluye alguna novedad importante, las cuáles
trataremos en este post.

## Tabla de contenido

1. [Ciclos de vida](#ciclos-de-vida)
2. [Directiva `*ngIf`](#directiva-ngif)
3. [Paquete de animaciones](#paquete-de-animaciones)
4. [TypeScript 2.1](#typescript-21)
   1. [StrictNullChecks](#strict-null-checks)
5. [Angular Universal](#angular-universal)
6. [Comparación de rendimiento entre Angular 2 y Angular 4](#mejoras-en-rendimiento)
7. [Actualizando nuestro proyecto de Angular 2 a Angular 4](#actualizando-nuestro-proyecto-de-angular-2-a-angular-4)

## Ciclos de vida

En Angular 2 los ciclos de vida eran clases, las cuáles extendíamos en nuestros componentes,
por ejemplo:

```ts
@Component()
class SomeComponent extends OnInit {}
```

En la primera release candidate de Angular 4, ésto cambia. A partir de ahora, los ciclos de vida
son interfaces, por lo cual debemos reemplazar la palabra reservada `extends` por `implements`,
quedando el código de nuestros componentes de la siguiente forma:

```ts
@Component()
class SomeComponent implements OnInit {}
```

## Directiva *ngIf

A partir de ahora podemos utilizar una sintaxis del estilo `if/else` dentro de la directiva `*ngIf`. La sintaxis
queda de la siguiente forma: `*ngIf="<something> else <template>`. Como podéis observar, debemos especificar
un template para la parte del `else`, algo que es realmente útil y nos agilizará bastante el desarrollo.
También cabe destacar que ahora podemos asignar variables locales.

En este ejemplo se pueden ver dichos cambios:

```ts
<ng-template #loading>Loading...</ng-template>
<div *ngIf="userObservable | async; else loading; let user">
  {{ "{{ user.name " }}}}
</div>
```

## Paquete de animaciones

A partir de ahora las animaciones tendrán su propio paquete `@angular/animations`, de forma que si no utilizamos
las animaciones no se nos cargará todo su código en nuestros bundles de producción. Librerías que utilicen dicho
paquete, como `Angular Material`, al instalaralas vía NPM nos importarán de forma automática dicho paquete.

## TypeScript 2.1

Todo el código del framework se ha actualizado a la versión 2.1 de TypeScript.

> Es importante destacar que no proporciona compatibilidad hacia atrás con la versión 1.8 o anteriores de TypeScript.

### StrictNullChecks

## Angular Universal



## Comparación de rendimiento entre Angular 2 y Angular 4

## Actualizando nuestro proyecto a Angular 4