const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const _ =require('lodash');

const app=express();




app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://usernik:Nikhil@cluster0.eor7bkr.mongodb.net/todolistDB");

app.set("view engine","ejs");

const itemschema=new mongoose.Schema({
    name:String
});

const item=mongoose.model("item",itemschema);

const item1=new item({
    name:"item1"
});

const item2=new item({
    name:"item2"
});
const item3=new item({
    name:"item3"
});

const defaultitems=[item1,item2,item3]

const listschema=new mongoose.Schema({
name:String,
items:[itemschema]
});

const list=mongoose.model('list',listschema);





app.get("/",function(req,res){

    item.find({})
      .then(foundItems => {
        if(foundItems.length===0){
            item.insertMany(defaultitems).then(function(err){
                if(!err){
                    console.log("successful");
               }
           });  
        }else{ res.render("index", {list_title: "Today", newListItems: foundItems});}
          
    })
      .catch(err => {
          console.log(err);
      })
    
});
app.post("/delete",function(req,res){
const checkeditem=req.body.checkbox;
const listname=req.body.listname;
if(listname==='Today'){
    item.findByIdAndRemove(checkeditem).then(Element=>{
        console.log("successfully removed");
        res.redirect('/');
    })
    .catch(err=>{
        console.log(err);
    })
}else{
   list.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkeditem}}}).then(function(foundlist){
    
        res.redirect('/'+listname);
    
   })
}

});

app.post("/",function(req,res){
    let itemName=req.body.addeditem;
    const listname=req.body.list;
    const Item=new item({
        name:itemName
    });

    if(listname==="Today"){
        Item.save();
        res.redirect('/');
    }else{
        list.findOne({name:listname}).then(function(foundlist){
            foundlist.items.push(Item);
            foundlist.save();
            res.redirect('/'+listname);
        })
        .catch(function(err){
            console.log(err);
        })
    }
   
});


app.get('/:customlistname',function(req,res){
    const customlistname=_.capitalize(req.params.customlistname);

   
    list.findOne({name:customlistname}).then(function(foundlist){
      
            if(!foundlist){
                const List=new list({
                    name:customlistname,
                    items:defaultitems
                        });
                        List.save();
                        res.redirect("/"+ customlistname);
                    
            }else{
                 res.render("index", {list_title: foundlist.name, newListItems: foundlist.items});
            }
        }
    )
    .catch(function(err){
        console.log(err);
    })

   
});




app.get("/about",function(req,res){
    res.render("about");
})


app.listen(3000,function(){
    console.log("server is functioning on port 3000");
});