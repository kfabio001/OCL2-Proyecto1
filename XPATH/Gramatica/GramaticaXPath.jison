/*definición léxica*/
%{
       //const rep_gram = require("./XPATH/reporte/reporteGramatica").reporteGramatica;
     /*   const pro = require("./XPATH/reporte/produccion").producion;
        const tree = require("./XPATH/ast/ast").tree;
        const nodoX = require("./XPATH/ast/nodo").nodo;*/
      // let p = new producion();
%}

%lex
%options case-insensitive

%%
"*"         return 'asterisk';
".."        return 'twoPoint';
"."         return 'point';
"("         return 'parIzq';
")"         return 'parDer';
"{"         return 'llaIzq';
"}"         return 'llaDer';
"::"        return 'doubleColon';
":"         return 'colon';
"|"         return 'barra';
"["         return 'corcheteIzq';
"]"         return 'corcheteDer';
";"         return 'ptcoma';
"+"         return 'add';
","         return 'comma';
"-"         return 'minus';
"=>"        return 'arrow';
"="         return 'equal';
"/""/"      return 'doubleSlash';
"/"         return 'slash';

"!="        return 'diferent';
"<"         return 'menor';
"<="        return 'menorIgual';
">"         return 'mayor';
">="        return 'mayorIgual';
"@"         return 'at';
"or"        return 'or';
"let"       return 'let';
"last"      return 'last';
"and"       return 'and';
"div"       return 'div';
"mod"       return 'mod';
"text"      return 'text';
"node"      return 'node';
"child"     return 'child';
"self"      return 'self';
"parent"    return 'parent';
"comment"   return 'comment';
"element"   return 'element';
"ancestor-or-self"   return 'ancestor_or_self';

"descendant-or-self" return 'descendant_or_self';
"following-sibling"  return 'following_sibling';
"preceding-sibling"  return 'preceding_sibling';
"processing-instruction" return 'processing_instruction';
"ancestor"  return 'ancestor';
"descendant" return 'descendant';
"namespace" return 'namespace';
"attribute" return 'attribute';
"preceding" return 'preceding';
"following" return 'following';
/*Espacios en blanco*/
[ \r\t]+     {}       
\n           {}    
[0-9]+                      return  'digits';
[0-9]+("."[0-9]+)?  return  'decimal';
(\"({EscapeQuot}|[^"])*\")|("'""({EscapeApos}|[^'])*""'") return 'cadena';
[A-Za-z_][A-Za-z_0-9]*	    return 'id';


<<EOF>>                 return 'EOF';
.       {
         console.error('Este es un error léxico: ' + yytext + ', en la linea: ' + yylloc.first_line + ', en la columna: ' + yylloc.first_column);
}
/lex

/* Asociación de operadores y precedencia */
%right 'equal'
%left 'or', 'barra'
%left 'and'
%left 'mayor', 'menor', 'mayorIgual', 'menorIgual', 'diferent'



%left 'add', 'minus' /*binary*/
%left 'asterisk', 'slash', 'mod'


%left 'doubleSlash'
%left 'parIzq', 'parDer', 'corcheteIzq', 'corcheteDer'



<
%start ini 
%% /*definicion de gramática*/
ini
        :XPATH EOF {/*console.log(p.getGramatica('ini'));*/ return new tree($1,p.getGramatica("ini"));}
        
;
XPATH
        :ENTRY LIST_STEP                     {$$=new nodo("xpath", new Array($1,$2),"");p.getGramatica("xpath")}
        |LIST_STEP                           {$$=new nodo("xpath", new Array($1),"");p.getGramatica("xpath")}
        |PANICO        
;

ENTRY
        :slash                               {$$=new nodo("entry", new Array(new nodo("entry",null,$1)),"");p.getGramatica("entry")}
        |doubleSlash                         {$$=new nodo("entry", new Array(new nodo("entry",null,$1)),"");p.getGramatica("entry") }
;
LIST_STEP
        :LIST_STEP SEPERATE STEP             {$$=new nodo("list_step", new Array($1,$2,$3),"");p.getGramatica("list_step")}
        |STEP                                {$$=new nodo("list_step", new Array($1),"");p.getGramatica("list_step")}
       
;
SEPERATE
        :barra ENTRY                         {$$=new nodo("seperate", new Array(new nodo("sep",null,$1),$2),"");p.getGramatica("seperate")}
        |barra                               {$$=new nodo("seperate", new Array(new nodo("sep",null,$1)),"");p.getGramatica("seperate")}
        |slash                               {$$=new nodo("seperate", new Array(new nodo("sep",null,$1)),"");p.getGramatica("seperate")}
        |doubleSlash                         {$$=new nodo("seperate", new Array(new nodo("sep",null,$1)),"");p.getGramatica("seperate")}
                               
;
PANICO
        
        :error                               {console.error('Error Sintactico: ' + yytext + ', linea: ' + @1.first_line + ',  columna: ' + @1.first_column);
                                                var er =new NodoError("Error Sintatico","Xpath Ascendente","No se esperaba el caracter: "+$1, @1.first_line,@1.first_column);
                                                 Errores.add(er); }
;                                               

STEP
        :id LIST_PREDICATE                   {$$=new nodo("step", new Array(new nodo("id",null,$1),$2),"");p.getGramatica("step")}
        |id                                  {$$=new nodo("step", new Array(new nodo("id",null,$1)),"");p.getGramatica("step")}
        |AXIS                                {$$=new nodo("step", new Array($1),"");p.getGramatica("step")}                         
        |WILDCARD                            {$$=new nodo("step", new Array($1),"");p.getGramatica("step")}
        
;
LIST_PREDICATE
        :LIST_PREDICATE PREDICATE             {$$=new nodo("list_pred", new Array($1,$2),"");p.getGramatica("list_pred")}
        |PREDICATE                            {$$=new nodo("list_pred", new Array($1),"");p.getGramatica("list_pred")}
;
PREDICATE
        :corcheteIzq LIST_E corcheteDer       {$$=new nodo("predicate", new Array(new nodo($1),$2,new nodo($2)),"");p.getGramatica("predicate")}    
;
LIST_E
        :LIST_E OP E                          {$$=new nodo("list_e", new Array($1,$2,$3),"");p.getGramatica("list_e")}
        |E                                    {$$=new nodo("list_e", new Array($1),"");p.getGramatica("list_e")}
;
OP
        :add                                  {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |minus                                {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |asterisk                             {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |div                                  {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |equal                                {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |diferent                             {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |menor                                {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |menorIgual                           {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |mayorIgual                           {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |mayor                                {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |or                                   {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |barra                                {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |and                                  {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |mod                                  {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        |slash                                {$$=new nodo("operador", new Array(new nodo("op",null,$1)),"");p.getGramatica("op")}
        
;
E
        :STEP                                 {$$=new nodo("E", new Array($1),"");p.getGramatica("e")}
        |ENTRY                                {$$=new nodo("E", new Array($1),"");p.getGramatica("e")}
        |decimal                              {$$=new nodo("E", new Array(new nodo("decimal",null,$1)),"");p.getGramatica("e")}
        |digits                               {$$=new nodo("E", new Array(new nodo("digits",null,$1)),"");p.getGramatica("e")}
        |cadena                               {$$=new nodo("E", new Array(new nodo("cadena",null,$1)),"");p.getGramatica("e")}
        |parIzq E parDer                      {$$=new nodo("E", new Array(new nodo($1),$2,new nodo($3)),"");p.getGramatica("e")}
        
;
AXIS
        :AXIS_NAME doubleColon STEP           {$$=new nodo("axis", new Array($1,$2,$3),"");p.getGramatica("axis")}
        |AXIS_NAME                            {$$=new nodo("axis", new Array($1),"");p.getGramatica("axis")}
;
AXIS_NAME
        :ancestor                             {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |ancestor_or_self                     {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |attribute                            {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |child                                {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |descendant                           {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |descendant_or_self                   {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |following                            {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |following_sibling                    {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |namespace                            {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |parent                               {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |preceding                            {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |preceding_sibling                    {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
        |self                                 {$$=new nodo("axis_name", new Array(new nodo("axis",null,$1)),"","");p.getGramatica("axis_name")}
;
WILDCARD
        :asterisk                             {$$=new nodo("wildcards", new Array(new nodo("wild",null,$1)),"");p.getGramatica("wild")}
        |point                                {$$=new nodo("wildcards", new Array(new nodo("wild",null,$1)),"");p.getGramatica("wild")}
        |twoPoint                             {$$=new nodo("wildcards", new Array(new nodo("wild",null,$1)),"");p.getGramatica("wild")}
        |at asterisk                          {$$=new nodo("wildcard", new Array(new nodo("wild",null,$1),new nodo("wild",null,$2)),"");p.getGramatica("wild") }
        |at id PREDICATE                      {$$=new nodo("wildcards", new Array(new nodo("wild",null,$1),new nodo("id",$2),new nodo($3)),"");p.getGramatica("wild")}
        |at id                                {$$=new nodo("wildcards", new Array(new nodo("wild",null,$1),new nodo("id",null,$2)),"");p.getGramatica("wild")}
        |node parIzq parDer                   {$$=new nodo("wildcards", new Array(new nodo($1),new nodo($2),new nodo($3)),"");p.getGramatica("wild")}
        |text parIzq parDer                   {$$=new nodo("wildcards", new Array(new nodo($1),new nodo($2),new nodo($3)),"");p.getGramatica("wild")}
        |last parIzq parDer                   {$$=new nodo("wildcard", new Array(new nodo("wild",$1),new nodo($2),new nodo($3)),"");p.getGramatica("wild")}
;
