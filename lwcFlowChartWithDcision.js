import { LightningElement,api } from 'lwc';
import { loadScript,loadStyle } from 'lightning/platformResourceLoader';
import flowmincss from '@salesforce/resourceUrl/flowmincss';
import someApexMethod from '@salesforce/apex/someApexClass.someApexMethod';
import jquery from '@salesforce/resourceUrl/jquery';
export default class CdCmpStageMasterFlowTest5 extends LightningElement {


    initialized = false;
        @api  recordId;
        markupArray =  [""];
        dataMap = new Map();
    renderedCallback() {
        if (this.initialized) return;
        this.initialized = true;

        Promise.all([
               loadScript(this, jquery),
               loadStyle(this, flowmincss)
            ])
                .then(response=> {
                    this.intializeData();
                })
                .catch((error) => {
                    this.error = error;
                });
    }

    intializeData(){
           someApexMethod({recordId : this.recordId })
           .then(result => {
            if(result != undefined && result != null){
             const dataFromApex = JSON.parse(result);
             console.log('dataFromApex',dataFromApex);
             if(dataFromApex.dataLst != undefined && dataFromApex.dataLst != null ){
                for (let i = 0; i < dataFromApex.dataLst.length; i++) {
                 this.dataMap.set(dataFromApex.dataLst[i].sfdcId,dataFromApex.dataLst[i]);
               }
             }
             console.log('dataMap',this.dataMap);
             if(dataFromApex != undefined && dataFromApex != null ){
              // you can use data from return here. We are just using harcoded child itema
             //var items = dataFromApex.childRecords;
                 var items =[
      {
         "name":"India",
         "Id":"1",
          Parent = ""
      },
      {
         "Parent":"1",
         "name":"Karnataka",
         "Id":"2",
      },
      {
         "name":"Bangalore",
         "parent":"2",
         "Id": "3"
      }
   ]
             
             var data1 = this.unflatten(items);
              //Child Object
              const child = {
              name: 'Start',
              children: data1,
              };
              //Assign child to parent
             const data = {
               parent: child, 
              };
             console.log('data from vs',JSON.stringify(data));

             this.createList(data);
             this.markupArray.push("</ol>");
             const container = this.template.querySelector('.container');
             const CONTAINER_HTML = "<div class='flow-decision-tree' style='padding-left:10%'>"+this.markupArray.join("")+"</div>";
             const regex = /<([^>]+)\s*>\s*<\/\1\s*>/g;
             const finalCONTAINER_HTML = CONTAINER_HTML.replaceAll(regex,'');
             console.log(finalCONTAINER_HTML); //This is html file generated dynamically using javascript
             container.innerHTML= finalCONTAINER_HTML;
             }
            }
           })
           .catch(error => {
                 console.log('error',error);
           });
           };


               string_between_strings(startStr, endStr, str) {
                   let pos = str.indexOf(startStr) + startStr.length;
                   return str.substring(pos, str.indexOf(endStr, pos));
               }



               createList = (items) => {
              console.log('items',items);
                switch ($.type(items)) {
                   case "object":
                     this.getItems(items);
                     break;

                               }
               };

                   // get items in the object
               getItems = (items) => {

                           debugger;
                                 for (const item in items) {
                                   this.markupArray.push(`<li>`);
                                   // fetch the parent object
                                   let details = items[item];
                                   this.getDetails(details);
                                   // push the closing tag for parent
                                   this.markupArray.push("</li>");
                                 }
                           };




               unflatten(items) {
                 var tree = [],
                 mappedArr = {}
                  items.forEach(function(item) {
                   var id = item.Id;
                   if (!mappedArr.hasOwnProperty(id)) { // in case of duplicates
                     mappedArr[id] = item; // the extracted id as key, and the item as value
                     mappedArr[id].children = [];  // under each item, add a key "children" with an empty array as value
                   }
                   })

                 // Loop over hash table
                 for (var id in mappedArr) {
                   if (mappedArr.hasOwnProperty(id)) {
                     var mappedElem = mappedArr[id];
                   if (mappedElem.Parent) {
                       var parentId = mappedElem.Parent;
                       const obj1  = {
                         child: mappedElem, // property name may be an identifier
                        };
                       mappedArr[parentId].children.push(obj1);
                     }// If the element is at the root level, directly push to the tree
                     else {
                         const obj  = {
                           child: mappedElem, // property name may be an identifier
                          };
                       tree.push(obj);
                     }
                   }
                 }

                 return tree;
               }


                     // change class to decision if its decision and if its start and end use class terminator
                   // get details
                                   getDetails = (details) => {
                                       debugger;
                                     // iterate over the detail items of object
                                     for (const detail in details) {
                                       // fetch the value of each item
                                       if (detail == "children" && details[detail] != undefined && details[detail] != null) {
                                         this.markupArray.push("<ul>");
                                         details[detail].forEach((element) => {
                                           this.getItems(element);
                                         });

                                         this.markupArray.push("</ul>");
                                       } else {
                                           if(detail == "name"){
                                            const substr1 = this.string_between_strings('href="/', '">',details[detail]);
                                            console.log(substr1);
                                            console.log(this.dataMap.get(substr1));
                                            this.markupArray.push(`<span style='background-color: #f1f4fa;outline:solid 1px;' class='process'> ${details[detail]} </span>`);
                                            }
                                       }
                                     }
                                   }

           }
