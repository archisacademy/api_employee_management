const {Pool} = require("pg")
const express = require ("express")
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors());

const pool = new Pool({
    "user": "postgres",
    "password" : "example",
    "host" : "localhost",
    "port" : 5432,
    "database" : "postgres"
})

app.get("/employees", async (req, res) => {
    const rows = await readEmployees();
    res.json(rows);
})

app.post("/employees", async (req, res) => {
    let result = {}
    try{
        const employeeData = req.body;
        result.success = await createEmployee(employeeData)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.json(result);
    }
})

app.put("/employees", async (req, res) => {
    let result = {}
    try{
        const employeeData = req.body;
        result.success = await updateEmployee(employeeData)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.json(result);
    }
})

app.delete("/employees/:id", async (req, res) => {
    let result = {}
    try{
        const { id } = req.params;
        result.success = await deleteEmployee(id)
    }
    catch(e){
        result.success=false;
    }
    finally{
        res.json(result);
    }
})


app.listen(3001, () => console.log("Web server is listening.. on port 3001"))

start()

async function start() {
    await connect();
}

async function connect() {
    try {
        await pool.connect(); 
    }
    catch(e) {
        console.error(`Failed to connect ${e}`)
    }
}

async function readEmployees() {
    try {
        const results = await pool.query("select * from employees");
        return results.rows;
    }
    catch(e){
        return [];
    }
}

async function createEmployee(employee){
    try {
        await pool.query("insert into employees (name, lastname) values ($1, $2)", [employee.name, employee.lastname]);
        return true
    }
    catch(e){
        return false;
    }
}

async function updateEmployee(employee){
    try {
        await pool.query("update employees SET name = $1, lastname = $2 where id = $3", [employee.name, employee.lastname, employee.id]);
        return true
    }
    catch(e){
        return false;
    }
}

async function deleteEmployee(id){
    try {
        await pool.query("delete from employees where id = $1", [id]);
        return true
    }
        catch(e){
        return false;
    }
}

