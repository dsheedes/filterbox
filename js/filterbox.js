//data-filterbox-category
//data-filterbox-parent
(function( $ ){
    //Json searching function
    function jsonFind(item, object){

        for(i = 0; i <= object.length - 1; i++){
            console.log(i);
            if(object[i].length == 1){
                if(object[item]){
                    return true;
                }
            } else {
                if(jsonFind(item, object[i]))
                    return true;
            }
        }
        return false;
    }

    function itemize(location){ 

//Insert items into an array of jQuery objects and return it.
        var items = location.find($(".filterbox-item")); //Find filterbox-items by class
        var itemList = [];

        for(i = 0; i <= items.length - 1; i++){
            if($(items[i]).data("filterbox-category")){ //Only if it contains the category shall we include it
                itemList.push($(items[i])); //Insert to array
            }
        }

        return itemList;
    }

//Create a new array of categories with their children and subchildren.
    function categorize(items){ 
        var categories = [];
        var relations = [];
        var errors = [];

        for(i = 0; i <= items.length - 1; i++){
            var category = items[i].data("filterbox-category");
            //console.log("Category "+category);

            var element = {
                "category":{
                    "name":category,
                    "id":i,
                    "value":items[i].html();
                    "children":{}
                }
            }
            if(items[i].data("filterbox-parent")){ //If parent is set
                var parent = items[i].data("filterbox-parent");
                //console.log("Category "+category+" Parent "+parent);
                var parentIsSet = true;
                var hierarchy = [];

                
                newi = i;
                hierarchy.push(category);
                var searchParent = parent;

                
                while(parentIsSet){ //if the next parent is set

                    for(p = 0; p <= items.length - 1; p++){//Loop through all items
                        if(p != newi){ //If current item is not same as searching item
                            if(items[p].data("filterbox-category") == searchParent){ //Check if their categories are equal
                                if(items[p].data("filterbox-parent")){ //If there is a next parent
                                    hierarchy.push(searchParent);
                                    searchParent = items[p].data("filterbox-parent");
                                    newi = p;
                                    break;
                                } else { //if there are no more parents we can exit the for and while loop
                                    hierarchy.push(searchParent);
                                    parentIsSet = false; 
                                    break;
                                    }
                            } else if (p == items.length - 1){ //If their categories are not equal and it's the last item, add it to the hierarchy list and end loops
                                hierarchy.push(searchParent);
                                parentIsSet = false;
                                break;
                            }
                        }
                    }
                    
                }

                hierarchy = hierarchy.reverse();
                categories.push(hierarchy);
            } else { //If parent is not set / solo categories
                categories.push([category]);
            }
        }

        //Now that we've got all our relatons it's time to merge them.
        var previousRelation;
        var position;
        for(i = 0; i <= categories.length - 1; i++){
            if(i == 0){
                if(categories[i].length == 1){
                    relations[categories[i]] = {};
                } else {
                    for(p = 0; p <= categories[i].length - 1; p++){
                        if(p == 0){
                            relations[categories[i][p]] = {};
                            position = relations[categories[i][p]];
                        } else {
                            position[categories[i][p]] = {};
                            position = position[categories[i][p]];
                        }
                    }
                }
            }
        }
        console.log(relations);

        if( jsonFind("basecategory",relations) ){
            console.log("Basecategory found");
        } else console.log("Basecategory not found");
    }
//Main
    $.fn.filterbox = function(){
        var items = itemize($(this));
        categorize(items);
    }
})( jQuery );