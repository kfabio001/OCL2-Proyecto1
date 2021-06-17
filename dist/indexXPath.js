let ast;

i=0;
<<<<<<< HEAD
let search;
=======

>>>>>>> 1b12fdc6b8708bf62b9047fc6ed7149c10d406d5
function AnalizarXpath() {
    
    var ta = document.getElementById(get_vent());
    var contenido = ta.value;
<<<<<<< HEAD
    contenidoErrores="";
            Errores.clear();
        try{
            let p = new producion();
            ast =gramaticaXPath.parse(contenido);
            if(!Errores.Vacio())
                console.log("no se encontraron errores")
            else
                contenido.Errores = Errores.mostrar_Lista()
        }
        catch(error){
            console.log(error)
        }
      // RecorrerAst2(ast.tree)
    //console.log(ast.reporte)
    //console.log(ast.tree.children[0]);
   // i=0;
=======

    let p = new producion();

    // if (err) throw err;
    ast = gramaticaXPath.parse(contenido);
    // RecorrerAst2(ast.tree)
    console.log(ast.tree)
        //console.log(ast.tree.children[0]);
        // i=0;
>>>>>>> 1b12fdc6b8708bf62b9047fc6ed7149c10d406d5
}



function query() {
    busqueda.recorrerAst(ast.tree);


}

function ASTXPATH() {
    graficar();
    i = 0;

}