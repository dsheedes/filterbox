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

        /*

            Create a system that finds parents and assigns children to them.

            1. Take the n-th item
            2. Check if it has a parent
                NO - add the first item to the main object
                YES - proceed
            3. Check if the parent already exists in the main object
                NO - Save the parent and the child, repeat until no more parents, add to main object
                YES - Add the child to the parent
            4. Repeat 

        */

       var categories = [];
       for(i = 0; i <= items.length - 1; i++){
           var category = items[i].data("filterbox-category");

           var child = {
               "category":{
                   name:category,
                   id:i,
                   value:items[i].html(),
                   children:{}
               }
           }
           if(items[i].data("filterbox-parent")){ //If parent exists
                var childParent = items[i].data("filterbox-parent");
                
                if(jsonFind(parent, categories)){ //If parent found
                    var parent = jsonFind(childParent, categories); 
                    parent.child.push(child); //Add the child to the parent

                    //Now, let's see whether this parent has parents and so on
                    if(categoriesSearch(parent.name)){ //Find parent element in items list
                        if(categoriesSearch.data("filterbox-parent")){ //Find whether this parent has parents
                            var hasParent = true;
                            while(hasParent){
                                //Add all the parents to one element and push to main object./
                            }

                        } //If there are no parents do nothing
                    }

                } else { //If parent not found
                    var parent = {
                        "category":{
                            name:childParent,
                            id:i,
                            value:"",
                            children:{
                                child
                            }
                        }
                    }

                    //Let's find the parent in our database and assign it a value
                    for(i = 0; i <= items.length - 1; i++){
                        if(items[i].data("filterbox-parent") == childParent){
                            parent.category.value = items[i].html(); //Assign value to object
                        }
                    }
                }
           } else { //Parent does not exist, we can push to categories
                categories.push(child);
           }
       }
    }
//Main
    $.fn.filterbox = function(){
        var items = itemize($(this));
        categorize(items);
    }
})( jQuery );