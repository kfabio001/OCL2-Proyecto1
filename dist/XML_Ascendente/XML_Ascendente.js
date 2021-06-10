"use strict";
var cont = 0;
var tablaGeneral = [];
var entornoAnterior = "Global";
var simboloAnterior;
let entornoGlobal;
let guardarTabla;
///////// PRUEBA DE BUSQUEDA TIPO----> //titulo
function recorreTabla(objeto, tabla) {
    if (tabla != undefined) {
        tabla.forEach((element) => {
            if (element.id == objeto) { //SI LO ENCUENTRA
                if (element.id == element.EtiquetaCierre) { // SI EL ELEMENTO ES DOBLE TIPO <TITULO>"TEXTO"</TITULO>
                    //if(element.tablaSimbolos.length!=0){// SI EL ELEMENTO TIENE MAS ENTORNOS EN SU INTERIOR
                    //}else{// SI EL ELEMENTO NO TIENE MAS ENTORNO EN SU INTERIOR
                    if (element.texto != "") { // SI EL ELEMENTO NO TIENE MAS ENTORNOS EN SU INTERIOR <---- DOBLE VALIDACION 
                        if (element.tablaSimbolos.length != 0) { //SI EL ELEMENTO TIENE ATRIBUTOS
                        }
                        else { // SI EL ELEMENTO NO TIENE ATRIBUTOS
                        }
                        console.log("<" + element.id + ">" + element.texto + "</" + element.EtiquetaCierre + ">");
                    }
                    else { //SI EL ELEMENTO TIENE MAS ENTORNOS EN SU INTERIOR <---- DOBLE VALIDACION
                    }
                    // } 
                }
                else { // SI EL ELEMENTO ES TIPO <TITULO --PARAMETROS-- />
                    if (element.tablaSimbolos.length > 0) { //SI EL ELEMENTO TIENE ATRIBUTOS
                    }
                    else { // SI EL ELEMENTO NO TIENE ATRIBUTOS
                        //AQUI NO DEBERIA ENTRAR JAJA CREO QUE SERIA ERROR SINTACTICO
                        // console.log("<"+element.id+">"+element.texto+"</"+element.EtiquetaCierre+">")
                    }
                }
                // recorreTabla()
                // console.log(element.tablaEntornos)
            }
            else { //SI NO LO ENCUENTRA PASA AL SIGUIENTE ENTORNO
                recorreTabla(objeto, element.tablaEntornos);
            }
        });
    }
}
///////////////////////////---> PRUEBA FUNCION PARA BUSQUEDAS TIPO /BIBLIOTECA/LIBROS
function llenarElementos(tabla) {
    if (tabla != undefined) {
        tabla.forEach((element) => {
            if (element.id == element.EtiquetaCierre) {
                if (element.tablaSimbolos.length != 0) { // SI EL ELEMENTO TIENE MAS ENTORNOS EN SU INTERIOR
                }
                else {
                    if (element.texto != "") {
                        console.log("<" + element.id + ">" + element.texto + "</" + element.EtiquetaCierre + ">");
                    }
                }
            }
            else {
            }
        });
    }
}
function agregarTablaSimbolos3(result) {
    entornoGlobal = new Entorno(null);
    result.forEach((element) => {
        if (element.id == element.EtiquetaCierre || element.EtiquetaCierre == 'Unica') {
            let entornoObjeto = new Entorno(null);
            if (element.listaAtributos.lenght != 0) {
                element.listaAtributos.forEach((atributo) => {
                    if (atributo != undefined) {
                        let simbolo = new SimboloXML("ATRIBUTO", atributo.id, atributo.linea, atributo.columna, atributo.valor, entornoAnterior);
                        entornoObjeto.agregar(simbolo.id, simbolo);
                    }
                });
            }
            element.entorno = entornoObjeto;
            if (element.listaObjetos.lenght != 0) {
                entornoAnterior = element.id;
                element.listaObjetos.forEach((objeto) => {
                    if (objeto != undefined) {
                        let simbolo = new SimboloXML("OBJETO", objeto.id, objeto.linea, objeto.columna, objeto.texto, entornoAnterior);
                        entornoObjeto.agregar(simbolo.id, simbolo);
                        agregarTablaSimbolos3(objeto.listaObjetos);
                    }
                });
            }
            if (element != undefined) {
                let simbolo = new SimboloXML("OBJETO", element.id, element.linea, element.columna, element.texto, "Global");
                entornoGlobal.agregar(simbolo, element, simbolo);
            }
            // agregarTablaSimbolos3(element.listaObjetos)
        }
        else {
            console.log("error semantico" + element.id);
        }
    });
}
function agregarTablaSimbolos(element) {
    for (let index = 0; index < element.length; index++) {
        if (element[0].tablaEntornos.length == 0) {
            let simbolo = new SimboloXML("OBJETO", element[index].id, element[index].linea, element[index].columna, element[index].texto, entornoAnterior);
            llenar(simbolo);
        }
    }
    for (let index = 0; index < element.length; index++) {
        if (element[index].tablaEntornos.length != 0) {
            let simbolo = new SimboloXML("OBJETO", element[index].id, element[index].linea, element[index].columna, element[index].texto, entornoAnterior);
            llenar(simbolo);
        }
        if (element[index].tablaSimbolos != undefined) {
            element[index].tablaSimbolos.forEach((atributo) => {
                let simbolo = new SimboloXML("ATRIBUTO", atributo.id, atributo.linea, atributo.columna, atributo.valor, entornoAnterior);
                llenar(simbolo);
            });
        }
    }
    for (let index = 0; index < element.length; index++) {
        if (element[index].tablaEntornos.length != 0) {
            simboloAnterior = new SimboloXML("OBJETO", element[index].id, element[index].linea, element[index].columna, element[index].texto, entornoAnterior);
            entornoAnterior = element[index].id;
            agregarTablaSimbolos(element[index].tablaEntornos);
        }
    }
}
var tabla = "";
function llenar(TablaSimbolos) {
    tabla += "<tr> \n";
    tabla += "<th scope=\"row\">" + TablaSimbolos.id + "</th> \n";
    tabla += "<td>" + TablaSimbolos.tipo + "</td><td>" +
        TablaSimbolos.valor + "</td><td>" +
        TablaSimbolos.linea + "</td><td>\n" +
        TablaSimbolos.columna + "</td><td>\n" +
        TablaSimbolos.Entorno + "</td>\n";
    tabla += "</tr>\n";
}
