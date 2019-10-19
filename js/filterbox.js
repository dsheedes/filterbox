//data-filterbox-category
//data-filterbox-parent
(function( $ ){
    function itemize(location){ 

//Insert items into an array of jQuery objects and return it.
        var items = location.find($(".filterbox-item")); //Find filterbox-items by class
        var itemList = [];

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

function displayCodeGenerator(items, ran){
    var code = "";
    for(var i = 0; i <= items.length - 1; i++){
    
        if(!ran){ //If code ran before set parent
            code += "<div class='filterbox-categories-parent'>"
            var parent = items[i].category.name;

            code += parent
        } else { //Else set child
            code += "<div class='filterbox-categories-child'>"
            var parent = items[i].category.name;

            code += parent
        }

        var child = items[i].category.children;
        if(child.length - 1 > 0){

            code += displayCodeGenerator(child, true); //If there are more children, repeat process
        } else if (child.length - 1 == 0){ //If the last child is left
            code += "<div class='filterbox-categories-child'>"+child[0].category.name+"</div>";
        }
        code += "</div>";
    }

    return code;

}
function display(items){

        //Generate html based on categorized items
        
        if($("#filterbox").find($("#filterbox-controls-categories")).length > 0){
            var filterbox = $("#filterbox").find($("#filterbox-controls-categories"));
            $(filterbox).html(displayCodeGenerator(items));

        } else console.error("#filterbox-controls-categories not found. Cannot print.")

}
//Main

/* 
Settings:
    display:true/false, (default false)
    returnCategories:true/false, (default true)
    logErrors: true/false, (default true)
    customID: true/false, (default false)
    cache: true/false (default true)

    -------------------------------------------

    pregenerated: true/false (default true) - This option will allow you to use a previously generated json category file. This will save load/cpu times. Use with caution.
*/
    $.fn.filterbox = function(settings){
        
        var categories = categorize(itemize($(this)));

        display(categories);

        return $(this);
    }
})( jQuery );