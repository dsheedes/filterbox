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
//Main
    $.fn.filterbox = function(settings){
        var categories = categorize(itemize($(this)));

        console.log(categories);
    }
})( jQuery );