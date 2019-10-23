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

function displayCodeGenerator(items, ran){
    var code = "";
    for(var i = 0; i <= items.length - 1; i++){ //For each item
        if(items[i].category.children.length > 0){ //There are more children
            code += "<li>"+items[i].category.name+"<ul>";
            code += displayCodeGenerator(items[i].category.children)+"</ul></li>"; //Recursive call so it can loop through all children
        } else { //There are no more children
            code += "<li>"+items[i].category.name+"</li>";
        }
    }

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

    $.fn.filterbox = function(settings, file){

        var categories = categorize(itemize($(this)), true);

        //Setting default values
        if(settings){
            if(settings.export == undefined || file){
                settings.export = false;
            }else {
                $("body").html("<code>"+JSON.stringify(categories)+"</code>");
                return this;
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

        if(file){
            $.ajax({
                url:file,
                async:false,
                dataType:"json",
                success:function(data){
                    categories = data;
                },
                error:function(data){
                    console.error("Something went wrong. Heres the data:");
                    console.error(data);
                },
            });
        }

        if(settings.display)
            display(categories);

        if (settings.returnCategories){
            return categories;
        } else return $(this);
    }
})( jQuery );