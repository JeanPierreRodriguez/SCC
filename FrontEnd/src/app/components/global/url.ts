// tslint:disable-next-line:no-var-keyword
export var URL = {
  url: '//localhost/SCC/WS_SCC/',
  // url: '../SCC/WS_SCC/', // Cuando se compila el proyecto de prueba
  // url:'../SCC_2/WS_SCC/', // Cuando se compila el proyecto en vivo
  // url: 'http://192.168.1.200/SCC/WS_SCC/', // Cuando se utiliza la PC principal
  // url: 'https://genussolucionesti.com/SCC/WS_SCC/', // En caso no funcione localmente el PHP
                                                       // Los cambios deben hacerse directamenre en el hosting
};

export var URLIMAGENES = {
  urlimages: URL.url+'file/upload.php',
  carpeta: URL.url+'uploads/',
};