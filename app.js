const express = require("express");
const pool = require("./db");

const app = express()

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
});

app.use(express.urlencoded({extended: true}));
app.use(express.json()) 

// register view engine
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.sendFile('/public/home.html', {root : __dirname});
});

app.get('/create_course', (req, res) => {
    res.sendFile('/public/create_course.html', {root : __dirname});
});



app.get('/display/:table_name', async(req, res) => {
    
    try {
        const table = req.params;
        pool.connect(async (error, client, release) => {
            let resp = await client.query(`select * from ${table.table_name}`);
            res.render('home.ejs', {revs: resp.rows, keys: Object.keys(resp.rows[0]) , tablename: table.table_name});

        })
    } catch (error) {
        console.log(error)
    }
    
});

app.get('/search', async(req, res) => {
    
    try {
        
        res.sendFile('/public/search.html', {root : __dirname});
    } catch (error) {
        console.log(error)
    }

})

app.post('/search', async(req, res) => {
    
    //console.log(req.body)
    //console.log(req.body.search)
    const string = `select * from course where category_name = '${req.body.search}'`;
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(string);

            if (resp.rows.length != 0) {
                res.render('search.ejs', {revs: resp.rows, keys: Object.keys(resp.rows[0]) });
            } else {
                res.render('search.ejs', {revs: resp.rows, keys: [] });
            }
            

        })
    } catch (error) {
        console.log(error)
    }

})

app.post("/create_course", (req, res) => {

    /*console.log(req.body)
    console.log(req.body.Cid)
    console.log(typeof(req.body))*/

    const string = `insert into course 
            (courseid, title, url, avg_rating, description, createdon, headline, no_of_students, no_of_lectures, category_name) 
            values ('${req.body.Cid}', '${req.body.Ctitle}','${req.body.url}' ,${req.body.rating} , '${req.body.description}', '${req.body.Create}', '${req.body.head}', ${req.body.No_of_students}, ${req.body.No_of_lectures}, '${req.body.Category_name}');` ;

    //console.log(string)
    
    try {
        pool.connect(async (error, client, release) => {
            
            let data = await client.query(string);
        })
    } catch (error) {
        console.log(error)
    }
    
    res.redirect("/")
});

app.get('/sort', (req, res) => {

    try {
        
        res.sendFile('/public/sort.html', {root : __dirname});
    } catch (error) {
        console.log(error)
    }
})

app.get('/sort/:Category', (req, res) => {

    const category = req.params
    const query = `select price.cost,course.title from price,course where price.courseid=course.courseid and course.category_name='${category.Category}' order by price.cost;`
    try {
        
        pool.connect(async (error, client, release) => {
            let resp = await client.query(query);
            res.render('sort.ejs', {revs: resp.rows, keys: Object.keys(resp.rows[0]) });

        })
        

    } catch (error) {
        console.log(error)
    }
})

app.get('/delete', (req, res) => {

    try {
        
        res.sendFile('/public/delete.html', {root : __dirname});
    } catch (error) {
        console.log(error)
    }
})


app.post('/delete', async(req, res) => {
    
    //console.log(req.body)
    //console.log(req.body.search)
    //const string = `select * from course where category_name = '${req.body.search}'`;
    const string = `delete from course where course.title='${req.body.search}';`
    try {
        pool.connect(async (error, client, release) => {
            let resp = await client.query(string);

            res.render('delete.ejs');

        })
    } catch (error) {
        console.log(error)
    }
    res.redirect("/");
})



app.use((req, res) => {
    res.send("404 page not found!!");
});