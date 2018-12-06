//Budget controller
var budgetController = (function(){
  var Expense = function(id, description,value){
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
  }
  Expense.prototype.calcPercentage = function(totalIncome){
      if (totalIncome>0){
        this.percentage = Math.round((this.value/totalIncome)*100);
      }
      else {
          this.percentage = -1
        }
   
  };
  Expense.prototype.getPercentage = function(){
      return this.percentage;
  }
  var Income = function(id, description,value){
    this.id = id;
    this.description = description;
    this.value = value;
}
    var calculateTotal = function(type){
        var sum= 0;
        data.allItems[type].forEach(function(cur){
            sum=sum+cur.value;
        });
        data.totals[type]=sum;
    };
var data = {
    allItems:{
        exp:[],
        inc:[]
    },
    totals:{
        exp:0,
        inc:0,
    },
    budget: 0,
    percentage: -1,
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
    deleteItem: function(type,id){
            var ids, index;
            //if id = 6
            //and the array is ids =[1,2,4,6,8]
            // we need the index of id =3
             ids =data.allItems[type].map(function(current){
                return current.id
            });
            index = ids.indexOf(id);
            if (index !== -1){
                data.allItems[type].splice(index,1);

            }
            
    },
    calculateBudget: function(){
        //calculate total income and expenses
        calculateTotal('inc');
        calculateTotal('exp');
        //calculate the budget: income-expenses
        data.budget = data.totals.inc - data.totals.exp;
        //calculate the percentage of income spend
        if(data.totals.inc> 0 ){
        data.percentage= Math.round((data.totals.exp/ data.totals.inc)*100);
        } else{
            data.percentage = -1
        }
        
    
    },
    calculatePercentages: function(){
        data.allItems.exp.forEach(function(cur){
             cur.calcPercentage(data.totals.inc);
        });



    },
    getPercentages: function(){
      var allPerc =   data.allItems.exp.map(function(cur){
          return cur.getPercentage();
      });
      return allPerc;
    },
    testing: function(){
        return(data);
    },
    getBudget: function(){
        return{
            budget: data.budget,
            totalInc: data.totals.inc,
            totalExp: data.totals.exp,
            percentage: data.percentage,
        }

    },
}
            
})();







//UI controller
var UIcontroller = (function(){


    var DOMstrings ={
 inputType : '.add__type',
 inputDescription: '.add__description',
 inputValue: '.add__value',
 inputBtn: '.add__btn',
 incomeContainer: '.income__list',
 expensesContainer: '.expenses__list',
 budgetLabel: '.budget__value',
 incomeLabel: '.budget__income--value',
 expenseLabel: '.budget__expenses--value',
 percentageLabel: '.budget__expenses--percentage',
 container: '.container ',
 expensesPercLabel:'.item__percentage',
 dateLabel: '.budget__title--month',
    };
   var formatNumber= function(num,type){
        var splitNum, int, dec,sign;
    /* + or - before the number depending on type
        also add two decimal points after the number
        and add a comma supperating the thousands 
        ex: 2345.54343==> +2,345.54
        2000 ==>2,000.00
    */
   num =Math.abs(num);
   num = num.toFixed(2);
   splitNum = num.split('.');
   int = splitNum[0];
  
   if (int.length>3){
     int=  int.substr(0,int.length-3)+','+int.substr(int.length-3,int.length)// if input 2345 then the result would be 2,345
   }
   dec= splitNum[1];
   return (type ==='exp'?'-':'+')+' '+ int+'.'+dec;
};
var nodeListForEach = function(list, callback){
    for (var i =0; i<list.length;i++){
         callback(list[i],i)
    }

};
return {
    getInput:function(){ 
        return{
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value :parseFloat( document.querySelector(DOMstrings.inputValue).value),
        };
    },
    addListItem:function(obj, type){
        var html, newHtml, element;
            //create HTML string with placeholder text
            if(type ==='inc'){
                element = DOMstrings.incomeContainer;
                html = `<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`
            } else if (type ==='exp'){
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">10%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
                //replace the placeholder text with some actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%',formatNumber(obj.value,type))
            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

                deleteListItem: function(selectorID){
             // we first got the parantNode, then from there we put the childnode id , it looks complicated but it's not 
             //document.getElementById(selectorID).parentNode.removeChild(document.getElementById(selectorID))
                    var el = document.getElementById(selectorID);
                    el.parentNode.removeChild(el);
                },

        clearFields: function(){
            var fields,fieldsArr;
            fields=document.querySelectorAll(DOMstrings.inputDescription +', '+ DOMstrings.inputValue)
            
             fieldsArr=Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current,index,array){
                current.value = "";
            });
            fieldsArr[0].focus();
        },


            displayBudget: function(obj){
                var type;
                obj.budget>0?type='inc': type='exp'
                    document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
                    document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc,'inc');
                    document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp,'exp');
                    if(obj.percentage > 0){
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                    } else{
                        document.querySelector(DOMstrings.percentageLabel).textContent = '---'; 
                    }
                },
                displayPercentages: function(percentages){
                  var fields =  document.querySelectorAll(DOMstrings.expensesPercLabel)
                  nodeListForEach(fields,function(current,index){
                      if (percentages[index]>0){
                          current.textContent=percentages[index] +'%';
                      }else{
                          current.textContent='---';
                      }
                  })
                },
                displayMonth: function(){
                    var now,month,months, year;
                     now =new Date(); 
                    // var christmas = new Date(2018,11,25) months are 0-11 it's a zero based array
                     months= ["January","February","March","April","May","June","July",
                    "August","September","October","November","December"];
                    year = now.getFullYear();
                    month = now.getMonth();
                    document.querySelector(DOMstrings.dateLabel).textContent = months[month]+" "+year;
                },
                changedType: function(){
                    var fields;
                    fields = document.querySelectorAll(
                        DOMstrings.inputType+','+
                        DOMstrings.inputDescription+','+
                        DOMstrings.inputValue
                    );
                    nodeListForEach(fields,function(cur){
                        cur.classList.toggle('red-focus');
                    });
                    document.querySelector(DOMstrings.inputBtn).classList.toggle('red')

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
             });
             document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem)
             document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType)
            
    }
    var updateBudget = function(){
            //calculate the budget
            budgetCtrl.calculateBudget();
            // return the budget
            var budget = budgetCtrl.getBudget();
     // display the budget on the UI
     UICtrl.displayBudget(budget);
    }
    var updatePercentages = function(){
        // calculate percentages
        budgetCtrl.calculatePercentages();
        // read the percentages from the budget controller
        var percentages = budgetCtrl.getPercentages();
        // update the UI with the new percentages
        UICtrl.displayPercentages(percentages);
    }
    
    var ctrlAddItem = function(){
        var input, newItem;
     //get the field input data
      input = UICtrl.getInput();
     if (input.description !==""&& !isNaN(input.value) && input.value >0){
     // add the item to the budget controller
     newItem=budgetCtrl.addItem(input.type,input.description,input.value);
     // add a new item to the user interface
        UICtrl.addListItem(newItem,input.type)
        //cleaer the fields by calling the clearField method
        UICtrl.clearFields();
        //calculate and update budget
        updateBudget();
        // calculate and update percentages
        updatePercentages();
     }
    }
    var ctrlDeleteItem = function(event){
        var itemID, splitID,type,ID;
            itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if(itemID){
                    splitID = itemID.split('-');
                    type = splitID[0];
                    ID= parseInt(splitID[1]);
                    // delete the item from the data structure
                    budgetCtrl.deleteItem(type,ID);
                    // delete the item from the user interface
                    UICtrl.deleteListItem(itemID)
                    // update and show the new budget
                    updateBudget();
                    // update and show the new percentages
                    updatePercentages();
            }

    };
    return {
        init: function(){
            setupEventListner(),
            UICtrl.displayMonth(),
            UICtrl.displayBudget({ 
                budget:0,
                totalInc:0,
                totalExp:0,
                percentage:0,
            });
        }
    }
 
 

})(budgetController,UIcontroller);
controller.init();