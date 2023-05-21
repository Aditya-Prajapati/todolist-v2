const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

const app = express();

// const items = ["item1", "item2", "item3"]; // new items can be pushed in const arrays, only whole new array can't be formed.
// const workItems = [];

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")); // serves-up static files such as css

app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://adityaprajapati:Asdf%401234@cluster0.loih2fs.mongodb.net/todolistDB");

const itemsSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
    name: "Welcome to your to do list!"
})

const item2 = new Item({
    name: "Hit + icon to add a new item."
})

const item3 = new Item({
    name: "<-- Hit this to delete an item."
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

const List = mongoose.model("List", listSchema);

app.get("/", function(req, res){

    // let day = date.getDate();
    Item.find({}).then((items)=>{
        // console.log(items);

        if (items.length === 0){
            Item.insertMany(defaultItems).then(()=>{
                console.log("Successfully saved default items to database.")
            }).catch((err)=>{
                console.log("There was an error inserting items.")
            })
        }

        res.render("list", {listTitle: "Today", items: items});
        
    }).catch((err)=>{
        console.log("There was an error");
    })
})

app.post("/", function(req, res){

    const itemName = req.body.newItem;
    const listName = req.body.list;
    
    const newItem = new Item ({
        name: req.body.newItem
    })

    if (listName == "Today"){
        newItem.save();
        res.redirect("/");
    }
    else {
        List.findOne({name: listName}).then((foundList)=>{
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/" + listName);
        })
    }
})

app.post("/delete", function(req, res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (listName == "Today"){ // default list
        Item.findByIdAndRemove(checkedItemId).then(()=>{
            console.log("Item is successfully deleted from default list.")
        }).catch((err)=>{
            console.log("An error occured while deleting item.")
        })   

        res.redirect("/");
    }
    else { // custom list
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(()=>{
            console.log("Successfully deleted from custom list.");
        }).catch((err)=>{
            console.log("There is an error while deleting from custom list.");
        })
        
        res.redirect("/" + listName);
    }
})

app.get("/:listName", function(req, res){
    const listName = _.capitalize(req.params.listName);

    List.findOne({name: listName}).then(async (foundList)=>{
        if (foundList == null){
            const list = new List({
                name: listName,
                items: defaultItems
            })

            await list.save();
            res.redirect("/" + listName);
        }
        else{
            res.render("list", {listTitle: foundList.name, items: foundList.items});
        }
    }).catch((err)=>{
        console.log("Error in finding list.");
    })
})

app.get("/about", function(req, res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("Server started successfully on port: 3000");
})