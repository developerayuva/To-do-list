const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const date = require(__dirname + "/date.js");

const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

mongoose.set("strictQuery", false);
// mongoose.connect("mongodb://localhost:27017/todolistDB");
mongoose.connect("mongodb+srv://admin-ayush:Test-123@cluster0.foufpno.mongodb.net/todolistDB");


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const itemsSchema = {
    name: String
};

const listSchema = {
    name: String,
    items: [itemsSchema]
};

const Item = mongoose.model('Item', itemsSchema);
const List = mongoose.model('List', listSchema);

const item1 = new Item({
    name: "Welcome to our To-do list"
});

const item2 = new Item({
    name: "Hit + to add item in To-do list"
});

const item3 = new Item({
    name: "<-- Hit this to delete item"
});

const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
    const formattedDate = date.getDate();
    Item.find((err, items) => {
        if(items.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if(err)
                    console.log(err);
            });
            res.redirect("/");
        }
        else {
            res.render('list', {
                listTitle: formattedDate,
                items: items
            });
        }
    });
});

app.get("/about", (req, res) => {
    res.render('about');
});

app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}, (err, foundList) => {
        if(err)
            console.log(err);
        else {
            if(!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect(`/${customListName}`);
            }
            else {
                res.render("list", {
                    listTitle: foundList.name,
                    items: foundList.items
                });
            }
        }
    });
});

app.post("/", (req, res) => {
    const item = new Item({
        name: req.body.newItem
    });
    const listTitle = req.body.submitButton;

    if(listTitle === date.getDate()) {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({name: listTitle}, (err, result) => {
            result.items.push(item);
            result.save();
            res.redirect(`/${listTitle}`);
        })
    }
});

app.post("/delete", (req, res) => {
    if(req.body.listTitle === date.getDate()){
        Item.findByIdAndRemove(req.body.checkbox, (err) => {
            if(err)
                console.log(err);
        });
        res.redirect("/");
    }
    else {
        List.findOneAndUpdate({name: req.body.listTitle}, {$pull: {items: {_id: req.body.checkbox}}}, (err) => {
            if(err)
                console.log(err);
        });
        res.redirect(`/${req.body.listTitle}`);
    }
});

app.use((req, res) => {
    res.status(404).render("404");
});

app.listen(port, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
})
