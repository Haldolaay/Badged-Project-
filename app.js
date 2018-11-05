//Budget controller
var budgetController = (function(){
  

})();
//UI controller
var UIcontroller = (function(){


    var DOMstrings ={
 inputType : '.add__type',
 inputDiscription: '.add__description',
 inputValue: '.add__value',
 inputBtn: '.add__btn',
    };
return {
    getInput:function(){ 
        return{
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
        discription: document.querySelector(DOMstrings.inputDiscription).value,
        value : document.querySelector(DOMstrings.inputValue).value,
        };
    },
    getDOMstrings: ()=> DOMstrings,
}


})();
//GLOBAL APP Controller
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListner = function(){
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress', function(event){
            if (event.keyCode ===13 || event.which ===13){
                ctrlAddItem();
            }
             })
            
    }

    
    var ctrlAddItem = function(){
     //get the field input data
     var input = UICtrl.getInput();
     console.log(input);
     // add the item to the budget controller
     // add a new item to the user interface
     //calculate the budget
     // display the budget on the UI
    
    }
    return {
        init: function(){
            setupEventListner();
        }
    }
 
 

})(budgetController,UIcontroller);
controller.init();