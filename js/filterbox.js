(function( $ ){
    function itemize(location, custom){ 
//Insert items into an array of jQuery objects and return it.
        var items = location.find($(".filterbox-item")); //Find filterbox-items by class
        var itemList = [];

        if(custom){
            for(i = 0; i <= items.length - 1; i++){
                if($(items[i]).data("filterbox-category")){ //Only if it contains the category shall we include it
                    var element = {
                        "category":{
                            name:$(items[i]).data("filterbox-category"),
                            id:$(items[i]).data("filterbox-id"),
                            value:$(items[i]).html(),
                            parent:$(items[i]).data("filterbox-parent"),
                            children:[],
                        }
                    }
                    itemList.push(element); //Insert to array
                }
            }
        } else {
            for(i = 0; i <= items.length - 1; i++){
                if($(items[i]).data("filterbox-category")){ //Only if it contains the category shall we include it
                    var element = {
                        "category":{
                            name:$(items[i]).data("filterbox-category"),
                            id:i,
                            value:$(items[i]).html(),
                            parent:$(items[i]).data("filterbox-parent"),
                            children:[],
                        }
                    }
                    itemList.push(element); //Insert to array
                }
            }
        }

        

        return itemList;
    }

//Create a new array of categories with their children and subchildren.
    function categorize(items){

        var hierarchy = []; //Copy items to hierarchy
        
        for(i = 0; i <= items.length - 1; i++){ //CHILD

            for(p = 0; p <= items.length - 1; p++){ //LOOKING FOR PARENT

                if(p != i){ // IF THEY ARE NOT THE SAME
                    
                    if(items[p].category.name == items[i].category.parent){ //If one items parent is equal to one items name
                        items[p].category.children.push(items[i]); //Push the child to parent
                        hierarchy.push(i);

                    } else if(p == items.length - 1){
                        //Final, no more parents


                    }

                }

            }

        }



        for(i = 0; i <= hierarchy.length - 1; i++){
            items.splice(hierarchy[i]-i, 1);
        }

        return items;
    }

function displayCodeGenerator(items, ran, code){
    var code ="";
    for(var i = 0; i <= items.length - 1; i++){
        
        var child = items[i].category.children;

        if(!ran){ //If code didnt run before, set parent
            code += "<li class='filterbox-categories-parent'>"
            var parent = items[i].category.name;
        
            code += parent;
            code += "<ul>";
        } else { //Else set child
            var parent = items[i].category.name;

            if(child != undefined && parent != undefined){
                code += "<li class='filterbox-categories-child'>";
                code += parent;
                code += "<ul>";
            } else if (child != undefined && parent == undefined){
                code += "<li class='filterbox-categories-parent'>";
                code += parent;
                code += "<ul>";
            } else if(child = undefined && parent != undefined){
                code += "<li class='filterbox-categories-parent'>";
                code += parent;
                code += "</ul>";
            }
        }

        if(child.length - 1 > 0){
            code += displayCodeGenerator(child, true); //If there are more children, repeat process
        } else if (child.length - 1 == 0){ //If the last child is left
            code += "<li class='filterbox-categories-child'>"+child[0].category.name+"</li>";
            code += "</ul>";
        } else {
            code += "</ul>";
        }
        code += "</li>";
    }
    code += "</ul>";
    return code;

}
function display(items){

        //Generate html based on categorized items
        
        if($("#filterbox").find($("#filterbox-categories")).length > 0){
            var filterbox = $("#filterbox").find($("#filterbox-categories"));
            $(filterbox).html("<ul>"+displayCodeGenerator(items)+"</ul>");

        } else console.error("#filterbox-categories not found. Cannot display categories.");

}
//Main

/* 
Settings:
    cache: true/false (default true)

    -------------------------------------------

    pregenerated: true/false (default true) - This option will allow you to use a previously generated json category file. This will save load/cpu times. Use with caution.
*/
    $.fn.filterbox = function(settings, file){

        var categories = categorize(itemize($(this)), true);
        
        var download = "<a href='data:application/json;base64,"+btoa(JSON.stringify(categories))+"'>Your categories are ready to download.</a>";
        //Setting default values
        if(settings){
            if(settings.export == undefined){
                settings.export = false;
            }else {
                $("body").html("<code>"+JSON.stringify(categories)+"</code>");
                return;
            }

            if(settings.display == undefined){
                settings.display = true;
            } 

            if(settings.returnCategories == undefined){
                settings.returnCategories = true;
            }

            if(settings.customId == undefined){
                settings.customId = false;
            }

        } else {
            var settings = {
                display:true,
                returnCategories:true,
                customId:false
            }
        }


        if(settings.display)
            display(categories);


        if (settings.returnCategories){
            return categories;
        } else return $(this);
    }
})( jQuery );