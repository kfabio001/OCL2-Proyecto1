let ast;
i=0;
let  search;
function AnalizarXpath() {
    var ta = document.getElementById(get_vent());
    var contenido = ta.value;
    
    let p = new producion();
        
       // if (err) throw err;
        ast =gramaticaXPath.parse(contenido);
      // RecorrerAst2(ast.tree)
    console.log(ast.tree)
    //console.log(ast.tree.children[0]);
   // i=0;
}
function query(){
    search.RecorrerAst(ast.tree);
}
function ASTXPATH(){
    graficar();
    i=0;

}