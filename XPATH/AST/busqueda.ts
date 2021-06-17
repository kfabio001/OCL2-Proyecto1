class busqueda{
    
    //list_nodos:Array<nodo>;
    
    tabla:Array<EntornoXML>;
    tabla2:Array<EntornoXML>;
    elementoActual:any
    bandera=false;
    query:Array<any>//cadena de query
    query2:Array<nodo>
     x=0;
     cadenaDouble=""
    constructor(tabla:Array<EntornoXML>){
      //  this.list_nodos=new Array();
        this.tabla = tabla;
        this.tabla2 = tabla;
        this.query=[];
        this.query2=[];
        
    }
    prueba(nodito:nodo, tabla:Array<EntornoXML>){
        console.log(nodito.name)
        if(tabla!=undefined){
        }
    }
    RecorrerAst(padre:nodo){
        
        if (padre.name!=null){
            for (const n in padre.children){//si el nodo padre tiene hijos
                this.RecorrerChildren(padre.children[n],this.tabla)
            }
        }
       //this.recorrerT(this.tabla)
        //this.cons(this.tabla,0)
        this.search(this.tabla,this.x,false)
       
    }
    

    RecorrerChildren(actual:nodo,tablaActual:Array<EntornoXML>){
        
        if(actual.children !=undefined){//tiene hijos
           for(const child in actual.children){
                this.RecorrerChildren(actual.children[child],tablaActual)
            }
        }else{
            this.query2.push(actual)
            this.query.push(actual.value)
        }
        
        

    }
    recorrerT(tablaActual:Array<EntornoXML>){
        if(tablaActual!=undefined){
            for(let t=0; t<tablaActual.length; t++){
                var e=tablaActual[t]
                if(e.tablaEntornos.length!=0){//mas entornos
                    console.log(e.id)
                    this.recorrerT(e.tablaEntornos)
                }else{
                    console.log(e.id)
                }
            }
        }
    }
    cons(tablaActual:Array<EntornoXML>,x:number):string{
        
        if(tablaActual!=undefined){
            for(let t=0; t<tablaActual.length; t++){
                var e=tablaActual[t]
                if(e.tablaEntornos.length!=0){//mas entornos
                    console.log(e.id)
                    if(e.id==this.query2[this.x].value)
                    this.recorrerT(e.tablaEntornos)
                }else{
                    console.log(e.id)
                }
            }
        }
        return "j"
    }
    consulta(tablaActual:Array<EntornoXML>,x:number):string{
        var cadena=""
        if(this.query2[x].name=="entry" ){
            cadena=this.entry(tablaActual,x)
        }else if(this.query2[x].name=="axis"){
            //entrar axis
        }else if(this.query2[x].name=="sep" ){
            x++
            cadena=this.step(tablaActual,x)
        }else{
            this.id(tablaActual,x)
            
        }
        console.log(cadena)
        return cadena
    }
    entry(tablaActual:Array<EntornoXML>,x:number):string{
        var cadena=""
        if(this.query2[x].value=="/"){
            x++
            
            cadena=this.slash(tablaActual,x)
        }else if(this.query2[x].value=="//"){
           // this.doubleSlash(tablaActual)
        }
        return cadena
    }
    id(tablaActual:Array<EntornoXML>,x:number):string{
        var cadena=""
        for(let t=0; t<tablaActual.length; t++){
            var e=tablaActual[t]
            if(this.query2[x].value==e.id){
                cadena=this.recorrerTablaId(this.query2[x].value,tablaActual)
            }
        }
        return cadena
    }
     slash(tablaActual:Array<EntornoXML>,x:number):string{
        var cadena=""
        
            if(this.query2[x].value=="*"){

            }else if(this.query2[x].value=="@"){
                
            }else{
               var find=false
                for(let t=0; t<tablaActual.length; t++){
                    var e=tablaActual[t]
                    if(this.query2[x].value==e.id){
                        find=true
                        cadena+=this.id(tablaActual,x)
                    }
                }
                if(find==false){
                    for(let t=0; t<tablaActual.length; t++){
                        var e=tablaActual[t]
                        cadena+=this.id(e.tablaEntornos,x)
                    }
                }
            
            }
            return cadena
        
    }
    step(tablaActual:Array<EntornoXML>,x:number):string{
        var cadena=""
        
        if(this.query2[x].name=="id"){
            cadena=this.id(tablaActual,x)
        }
        return cadena
    }
    search(tablaActual:Array<EntornoXML>,x:number,imprimir:boolean){
        var cadena=""
        if(tablaActual!=undefined){
            for(let t=0; t<tablaActual.length; t++){//recorrer tabla o entorno actual
               var  e=tablaActual[t]
                while(x<this.query.length){
                    if(this.query[x]=="/"){
                       x++;
                       if(this.query[x]=="@"){ 
                         cadena= this.getAttrb(tablaActual,x)
                         if(x+1==this.query.length && imprimir==false){
                            
                            console.log(cadena)
                            imprimir=true
                        }
                           this.getAttrbFather(x+1, this.tabla)
                       }
                    }else if(this.query[x]=="//"){
                        x++
                        if(this.query[x]=="@"){
                           cadena= this.getAttrb(tablaActual,x)
                           if(x+1==this.query.length && imprimir==false){
                            console.log(cadena)
                            imprimir=true
                        }
                       }else{
                            if(this.query[x]==e.id){//si es id retonar contenido
                                cadena = this.recorrerTablaId(this.query[x],tablaActual)
                            }else{
                                x++
                                cadena= this.doubleSlash(x,e, tablaActual)
                                if(x+1==this.query.length && imprimir==false){
                                    console.log(cadena)
                                    imprimir=true
                                }
                                x++;
                                if (x)
                                for(let t=0; t<e.tablaEntornos.length; t++){
                                    this.search(e.tablaEntornos[t].tablaEntornos,x+1,imprimir)
                                }

                            }
                       }
                        
                    }
                    else{
                        if (this.query[x]==e.id){//id
                           cadena = this.recorrerTablaId(this.query[x],tablaActual)
                            if(x+1==this.query.length && imprimir==false){
                                console.log(cadena)
                                imprimir=true
                            }
                                 
                            this.search(e.tablaEntornos,x+1,imprimir)
                            break;
                        }else{
                            if(t+1<tablaActual.length){
                                break
                            }else{
                                x++;
                            }
                        }
                    }
                }     
            }
        }
    }
    doubleSlash(x:number,e:EntornoXML, tablaActual:Array<EntornoXML>):string{
        var cadena="";
        if(tablaActual!=undefined){
            for(let t=0; t<tablaActual.length; t++){
                var e=tablaActual[t]
                if(this.query[x]==e.id){
                    cadena+= this.recorrerTablaId(this.query[x],tablaActual);
                    break
                 }else{
                    cadena +=this.doubleSlash(x,e, e.tablaEntornos)
                 }
            }
        }
        
           return cadena

    
    }
    recorrerTablaId(objeto:any, tablaActual:Array<EntornoXML>):any{
        var cadena=""
        tablaActual.forEach((element)=>{
            if(element.id==objeto){//encontró el entorno
               
                if(element.id==element.EtiquetaCierre){
                    cadena+="<"+element.id+">\n "
                    if(element.tablaSimbolos.length!=0){// SI EL ELEMENTO TIENE MAS ENTORNOS EN SU INTERIOR
                        cadena+=this.recorrerAttrb(element.tablaSimbolos)
                    }else{
                        if(element.texto!="")
                            cadena+=element.texto
                        else
                            cadena+=this.getContenido(element.tablaEntornos)
                        cadena+="</"+element.EtiquetaCierre+">\n"
                    }
                   
                }else{
                    cadena+="<"+element.id
                     if(element.tablaSimbolos.length!=0){// SI EL ELEMENTO TIENE MAS ENTORNOS EN SU INTERIOR
                        cadena+=this.recorrerAttrb(element.tablaSimbolos)+"/>"
                    }else
                        cadena+=this.getContenido(element.tablaEntornos)+"/>"
                }
            }
        })
       return cadena
    }
    getContenido(tablaActual:Array<EntornoXML>):string{
        var cadena=""
        if(tablaActual!=undefined){
            tablaActual.forEach((element)=>{
                if(element.id==element.EtiquetaCierre){
                    cadena+="<"+element.id+"> "
                     if(element.tablaSimbolos.length!=0){// SI EL ELEMENTO TIENE MAS ENTORNOS EN SU INTERIOR
                        cadena+=this.recorrerAttrb(element.tablaSimbolos)
                    }else{
                            if(element.texto!=""){
                                cadena+=element.texto
                            }else
                                cadena+=this.getContenido(element.tablaEntornos)
                        }
                        cadena+="</"+element.EtiquetaCierre+">\n"
                }else{
                    cadena+="<"+element.id
                     if(element.tablaSimbolos.length!=0){// SI EL ELEMENTO TIENE MAS ENTORNOS EN SU INTERIOR
                        cadena+=this.recorrerAttrb(element.tablaSimbolos)
                    }else
                        cadena+=this.getContenido(element.tablaEntornos)
                }
        
            })
        }
        return cadena
    }
    recorrerAttrb(tabla:Array<SimboloXML>):string{
        var cadena=" "
        tabla.forEach((element)=>{
            cadena +=element.id+"="+element.valor+" "
        })
        cadena+=" "
        return cadena
    }
    getAttrbFather(x:number, tablaActual:Array<EntornoXML>):string{
        var cadena=""
        if(this.query[x]=="*"){
            tablaActual.forEach((e)=>{
                if(e.tablaSimbolos.length!=0){
                    if(this.query[x-3]==e.id)
                     cadena += this.recorrerAttrb(e.tablaSimbolos)
                     
                }
            })
        }
        return cadena
    }
    getAttrb(tabla:Array<EntornoXML>,x:number):string{
        var cadena="";
        if(this.query[x]=="*"){
            tabla.forEach((e)=>{
                if(e.tablaSimbolos.length!=0)// SI EL ELEMENTO TIENE MAS ENTORNOS EN SU INTERIOR
                    cadena+=this.recorrerAttrb(e.tablaSimbolos)
                cadena+=this.getAttrb(e.tablaEntornos,x)
            });
        }
        
        return cadena
    }
    getId(x:number, tablaActual:Array<EntornoXML>, imprimir:boolean, e:EntornoXML, t:number){
        var cadena=""
        if (this.query[x]==e.id){//id
            cadena = this.recorrerTablaId(this.query[x],tablaActual)
             if(x+1==this.query.length && imprimir==false){
                 console.log(cadena)
                 imprimir=true
             }
                  
             this.search(e.tablaEntornos,x+1,imprimir)
            // break;
         }else{
             if(t+1<tablaActual.length){
                 return
             }else{
                 x++;
             }
         }
    }
    printAllAttr(entPadre:Array<EntornoXML>, attr:string):string{//padrelibro
        var cadena=""
            for(let t=0; t<entPadre.length; t++){//
                entPadre.forEach((e)=>{//e = libro[0]==autor
                    if(attr==attr){
                        cadena+=this.recorrerAttrb(e.tablaEntornos)//fechaNa
                    }
                })
            }
        return cadena
    }
   
}