---
title:  "Angular CLI en detalle"
date:   2017-03-27
description: Agiliza tu workflow con Angular al máximo
topic: angular
---

## Tabla de contenido

1. ¿Qué es Angular CLI?
2. ¿Qué ventajas nos ofrece Angular CLI?
3. Instalando Angular CLI
4. Creando nuestro primer proyecto
   1. Estructura del proyecto generado
   2. Ejecutando las pruebas automatizadas
   3. Generando nuevos elementos
      1. Módulos
      2. Componentes
      3. Servicios
      4. Directivas
      5. Pipes
5. Otros comandos interesantes

## ¿Qué es Angular CLI?

Angular CLI es una interfaz de línea de comandos (Command Line Interface) publicada
bajo licencia MIT por Google, la cual nos permite crear aplicaciones con Angular 4
pre-configuradas y listas para ser ejecutadas.

## ¿Qué ventajas nos ofrece Angular CLI?

Comenzar el desarrollo de una aplicación web es un proceso muy tedioso que,
además, se dificulta a medida que crece el tamaño y la complejidad del proyecto.
Siempre cuesta empezar, y sobre todo, configurar el "esqueleto" del proyecto.

Angular CLI nos permite crear un proyecto totalmente configurado con un simple
comando, el cuál veremos a continuación. De momento me gustaría comentaros un
poco cuáles son sus ventajas, y, por qué después de varios meses utilizándola
pienso que es una herramienta indispensable en el desarrollo de cualquier
aplicación Angular, así que vamos allá:

- **Desarrollada por Google.** Así es, Angular CLI está desarrollada principalmente
por varios miembros del core team de Angular, por lo que cumple con la [gúia de estilo](https://angular.io/styleguide)
de Angular en todo momento.
- **Generación de elementos.** A través de un simple comando podremos crear boilerplate
de módulos (hasta con enrutado), componentes, directivas, pipes etc. Todo esto
automatizado y de forma muy sencilla.
- **Webpack.** Totalmente configurado, incluso si deseamos utilizar lazy loading
en nuestra aplicación, no tendremos que configurar nada de forma adicional
ni tendremos que pelearnos con webpack. También tenemos la opción de extraer la
configuración de Webpack con el comando `ng eject` y configurarla a nuestro gusto
a partir de la existente.
- **Pruebas unitarias con Karma.** Sin duda el framework por excelencia para llevar
a cabo este tipo de pruebas en aplicaciones de JavaScript. Pues bien, lo tendremos
totalmente configurado y listo para ejecutar nuestras pruebas con el comando `ng test`.
- **Pruebas e2e con Protractor.** De la misma forma que Karma, tendremos totalmente
configurado Protractor para ejecutar nuestras pruebas de integración o e2e, simplemente
ejecutando el comando `ng e2e`.
- **Servidor de desarrollo con LiveReload.** Podremos desarrollar nuestra aplicación al
mismo tiempo que sea ejecutada, de forma que cada vez que guardemos los cambios, la aplicación
volverá a generar los bundles de forma automática y será recargada en el navegador.
- **Compilación AOT en producción.** En la última versión, simplemente con el comando
`ng build --prod` podremos generar nuestra aplicación con la compilación AOT (Ahead Of Time) de
forma automática, una función muy importante en producción.

## Instalando Angular CLI

Para instalar Angular-CLI, el único requisito es tener instalado Node.js en su versión
6.9 o superior. Si todavía no lo tenéis instalado, podéis hacerlo siguiendo las instrucciones
en su [página web](https://nodejs.org/es/).

Una vez tengamos Node.js instalado, solo tendremos que ejecutar el siguiente comando para
instalar Angular CLI en nuestra máquina:

``` bash
$ npm install -g @angular-cli
```

> Es importante que el paquete a instalar sea `@angular-cli` y no `angular-cli`, ya que éste
último era el utilizado hasta una de las últimas betas y está `deprecated`.

## Creando nuestro primer proyecto

Crear nuestro primer proyecto y ejecutarlo es muy sencillo, solo tenemos que ejecutar el siguiente
comando en el directorio en el cual queramos generar nuestro proyecto:

``` bash
$ ng new <nombre-proyecto>
```

Una vez ejecutado, Angular CLI nos creará la extructura de nuestro proyecto con todos los archivos de
configuración, nos inicializará git y nos descargará automaticamente todas las dependencias. En caso
de que no queramos inicializar git podemos añadir al comando anterior la opción `--skip-git` y si
no queremos que se nos instalen las dependencias al momento podemos añadirle la opción `--skip-npm`.
También podemos especificar un directorio específico dentro del cual queramos generar nuestro proyecto
con la opción `--directory <nombre-directorio>`.

### Estructura del proyecto generado

El esqueleto del proyecto quedará de la siguiente forma:

```
e2e/
│   app.e2e-spec.ts
│   app.po.ts
└── tsconfig.e2e.json
node_modules/
src/
│   app/
│   │   app.component.css
│   │   app.component.html
│   │   app.component.spec.ts
│   │   app.component.ts
│   └── app.module.ts
│   assets/
│   environments/
│   │   environments.prod.ts
│   └── environments.ts
│   favicon.ico
│   index.html
│   main.ts
│   polyfills.ts
│   styles.css
│   test.ts
│   tsconfig.app.json
│   tsconfig.spec.json
└── typings.d.ts
.angular-cli.json
.editorconfig
.gitignore
.karma.conf.js
package.json
protractor.conf.js
README.md
tsconfig.json
tslint.json
```

Como podemos ver, tenemos un boilerplate de Angular totalmente configurado. En la
estructura del proyecto se pueden ver los archivos de configuración de TSLint, de
Karma, de Protractor, una carpeta `e2e` donde crearemos nuestros tests e2e y una
carpeta `src`, donde está el código de nuestra aplicación.

Además, si abrimos el archivo `package.json`, podemos ver que nos trae varios
scripts predefinidos como son el `ng serve`, `ng build`, `ng test` o el `ng-e2e`,
de forma que los podamos ejecutar con npm de forma sencilla y no tengamos que
recordar sus nombres.

Otro archivo importante que se crea, como seguro que os habréis dado cuenta,
es el `angular-cli.json`. Este archivo, nos permite editar de forma fácil y sencilla
la ruta o el nombre de los ficheros de configuración, el prefijo de la app etc.
De ésta forma, podremos modificar la estructura del proyecto generado a nuestro gusto.

### Ejecutando las pruebas automatizadas

A lo largo del desarrollo de nuestro proyecto iremos creando pruebas unitarias para
nuestros componentes, las cuales es necesario ejecutar cada vez que creamos una
o bien cada vez que finalizamos y modificamos un componente si seguimos un desarrollo
TDD (Test Driven Development).

Angular CLI nos facilita al máximo la ejecución de dichas pruebas. Bastará con ejecutar el
comando:

``` bash
$ npm test
```

Es equivalente a ejecutar `ng test`, solo que Angular CLI nos añade esta equivalencia al `package.json`
al crear un nuevo proyecto. Por defecto, se inicia con la opción `--watch true`, lo que significa
que se ejecutarán los tests con función de LiveReload, es decir, cada vez que hagamos un
cambio en un archivo de prueba `*.spec.ts`, se ejecutarán de nuevo las pruebas de forma
automática.

De forma adicional, podemos pasarle otras opciones como `--browsers`, `--colors`, `--reporters`,
`--port` o `--log-level`, las cuales serán pasadas directamente a Karma.

En algún momento, también crearemos pruebas e2e, las cuales podremos ejecutar simplemente con
el comando:

``` bash
$ npm run e2e
```

### Ejecutando nuestro proyecto

He mencionado anteriormente que una de las características principales de esta herramienta
es generar un proeyecto pre-configurado y **ejecutable** en cuestión de segundos. Bien,
pues sin tocar nada, ejecutamos el comando:

``` bash
$ npm start
```

En la consola podremos ver como se generan los bundles de la aplicación de forma casi inmediata.
A continuación abrimos en nuestro navegador la URL `http://localhost:4200` y podemos comprobar
que la aplicación funciona correctamente.

> Un consejo que os doy es cambiar el script `npm start` del archivo `package.json`. En vez de
tomar el comando `ng serve`, os recomiendo proporcionarle `ng serve --o true`. De esta forma,
no tendremos que abrir la URL `http://localhost:4200` a mano en nuestro navegador cada vez
que arranquemos nuestra aplicación, si no que se nos abrirá de forma automática nuestro
navegador con dicha URL y nos ahorrará mucho tiempo a la larga.

### Generando nuevos elementos

Aquí viene lo realmente interesante de Angular CLI, donde más nos facilita el desarrollo sin duda
alguna. Antes, el workflow común para crear un módulo o un componente por ejemplo, era crear
un archivo `*.module.ts` o `*.component.ts` y partir de cero. Otra opción era utilizar algún plugin
que nos proporcione un snippet, o un boilerplate. Aún así, tendríamos que crear el archivo a mano,
crear el archivo de routing en el caso de los módulos, añadir el componente al módulo en el caso
de los componentes etc.

#### Módulos

Crear un módulo es tan sencillo como ejecutar:

``` bash
$ ng g m <nombre-modulo> 
```

La `g` es un alias de `generate` y `m` de `module`, por lo que podemos sustituir dichos alias
indiferentemente. Si queremos crear un módulo con su correspondiente fichero de routing, bastará
con añadirle al comando la opción `--routing true`.

#### Componentes

Los componentes se generan de forma similar a los módulos, con el comando:

``` bash
$ ng g c <nombre-componente>
```

Al igual que antes, la `c` es un alias de `componente`. Al crear un componente, se nos crearán 4 archivos:

- <nombre-componente>.ts
- <nombre-componente>.spec.ts
- <nombre-componente>.html
- <nombre-componente>.css

Lo mejor es que dentro del fichero TypeScript tenemos ya la anotación `@Component` correctamente configurada,
enlazando al template `.html`, a los styles `.css`. También nos añade el prefijo de nuestra app al selector.

También podemos crear componentes dentro de un módulo, ya que Angular CLI nos permite introducir URL's relativas
a la carpeta `app` de nuestro proyecto, por ejemplo, de la siguiente manera:

``` bash
$ ng g c <nombre-modulo>/<nombre-componente>
```

Además de crear el componente, Angular CLI también lo añadirá a las declaraciones del módulo correspondiente.

#### Servicios

Crear un servicio es de lo más sencillo, simplemente ejecutamos el siguiente comando:

``` bash
$ ng g s <nombre-servicio>
```

Se nos crearán dos ficheros:

- <nombre-servicio>.ts
- <nombre-servicio>.spec.ts

Al igual que con los comandos anteriores, podemos utilizar rutas relativas también

> Hay que tener cuidado aquí, ya que al crear un componente dentro de un módulo lo añade a las declaraciones
> del mismo, pero con los servicios **no**. Tendremos que proveerlo donde lo necesitemos para utilizarlo.

#### Directivas

Igual de sencillo que los servicios, con el comando:

``` bash
$ ng g d <nombre-directiva>
```

En este caso, si creamos la directiva dentro de un módulo, ésta aparecerá referenciado dentro de la sección de
declaraciones del módulo

#### Pipes

Al igual que con los dos anteriores, sin mayor complicación:

``` bash
$ ng g  <nombre-pipe>
```

Al igual que con los componentes y las directivas, al crear el pipe dentro de un módulo aparecerá referenciado en
la sección de declaraciones del mismo.

## Otros comandos interesantes

Antes de finalizar el artículo me gustaría dejaros dos comandos que considero bastante útiles:

- `ng completion`, que nos proporcionará autocompletado para los comandos de Angular CLI en nuestra terminal.
- `ng doc <keyword>`, el cual nos abrirá un navegador con una búsqueda de la palabra clave especificada
en la documentación de Angular.

Y hasta aquí el artículo de hoy, espero que os haya sido de utilidad y nos vemos en el siguiente! 😄