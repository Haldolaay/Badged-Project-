//Budget controller
var budgetController = (function(){
  var Expense = function(id, description,value){
      this.id = id;
      this.description = description;
      this.value = value;
  }
  var Income = function(id, description,value){
    this.id = id;
    this.description = description;
    this.value = value;
}
var data = {
    allItems:{
        exp:[],
        inc:[]
    },
    totals:{
        exp:0,
        inc:0,
    }
};
return {
    addItem:function(type, des, val){
            var newItem, id;
            //create new id
            if(data.allItems[type].length>0){
            id = data.allItems[type][data.allItems[type].length-1].id+1; //id should be id = id +1
            } else{
                id=0;
            }
            //create new item based on 'inc' or 'exp' type 
            if (type ==='exp'){
                newItem = new Expense(id,des,val);
            }else if (type ==='inc'){
                newItem = new Income(id,des,val);
            }
            //push it into data
            data.allItems[type].push(newItem);
            //return our new element
            return newItem;
    },
    testing: function(){
        return(data);
    }
}
            
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
    addListItem:function(obj, type){
        var html;
            //create HTML string with placeholder text
            if(type ==='inc'){
            
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            } else if (type ==='exp'){
                html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
                //replace the placeholder text with some actual data
            // insert the HTML into the DOM
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
        var input, newItem;
     //get the field input data
      input = UICtrl.getInput();
     
     // add the item to the budget controller
     newItem=budgetCtrl.addItem(input.type,input.description,input.value);
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