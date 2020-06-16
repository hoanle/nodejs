console.log('Hello World from Node');
console.log(process.argv);

const fs = require("fs");
const yargs = require("yargs");
const chalk = require("chalk");
const loadTodos = () => {
    try {
        const buffer = fs.readFileSync("data.json");
        const dataJSON = buffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}

const addTodo = (title, complete) => {
    const currentData = loadTodos();
    let id = 1;
    if (currentData.length > 0) {
        id = currentData[currentData.length-1].id + 1;
    } 
    const newTodo = {
        id: id,
        "todo": title,
        complete: complete
    }

    const data = JSON.stringify([...currentData, newTodo]);
    fs.writeFileSync("data.json", data);
}

const updateTodo = (id, complete) => {
    const currentData = loadTodos();
    const existed = currentData.find(x => x.id === id) !== undefined;
    if (existed) {
        const maps = currentData.map(x => {
            if (x.id === id) {
                x.complete = complete;
            }
            return x;
        })
        const data = JSON.stringify([...maps]);
        fs.writeFileSync("data.json", data);
    } else {
        console.log(chalk.red(`Item id ${id} could not be found`));
    }
}

const listTodo = (complete) => {
    const list = loadTodos();
    list.map(x => {
        if (complete === undefined) {
            printRecord(x, x.complete)
        } else {
            if (x.complete === complete) {
                printRecord(x, x.complete);
            }
        }
    }); 
}

const deleteAllTasks = (complete) => {
    if (complete !== undefined) {
        const list = loadTodos();
        const maps = list.filter(x => x.complete !== complete).slice();
        const data = JSON.stringify(maps);
        fs.writeFileSync("data.json", data);
    } else {
        const data = JSON.stringify([]);
        fs.writeFileSync("data.json", data);
    }
}

const printRecord = (x, complete) => {
    if (complete === true) {
        console.log(chalk.green(`${x.todo} : ${x.complete} `));
    } else {
        console.log(chalk.red(`${x.todo} : ${x.complete} `));
    }
}
if (process.argv[2] === "add") {
    yargs.command({
        command: "add",
        describe: "Add a new todo",
        builder: {
            todo: {
                describe: "Todo content",
                demandOption: true,
                type: "string"
            },
            complete: {
                describe: "Todo status",
                demandOption: true,
                type: "boolean",
                default: false
            }
        },
        handler: function (argv) {
            console.log("lala");
            console.log(argv.todo, argv.complete);
            addTodo(argv.todo, argv.complete)
        }
    });
    yargs.parse()
} else if (process.argv[2] === "list") {
    yargs.command({
        command: "list",
        describe: "List all items of a status",
        builder: {
            complete: {
                describe: "Todo status",
                demandOption: false,
                type: "boolean"
            }
        },
        handler: function (argv) {
            listTodo(argv.complete)
        }
    });
    yargs.parse()
} else if (process.argv[2] === "toggle") {
    yargs.command({
        command: "toggle",
        describe: "Toogle a task",
        builder: {
            id: {
                describe: "Todo id",
                demandOption: true,
                type: "number"
            },
            complete: {
                describe: "Todo status",
                demandOption: true,
                type: "boolean",
                default: false
            }
        },
        handler: function (argv) {
            updateTodo(argv.id, argv.complete)
        }
    });
    yargs.parse()
} else if (process.argv[2] === "delete_all") {
    yargs.command({
        command: "delete_all",
        describe: "Delete all task",
        builder: {
            complete: {
                describe: "Todo status",
                demandOption: false,
                type: "boolean"
            }
        },
        handler: function (argv) {
            deleteAllTasks(argv.complete);
        }
    });
    yargs.parse()
} else {
    console.log(chalk.blue("Hello world!"));
    console.log(chalk.red("Hello world!"));
    console.log(chalk.green("Hello world!"));
    console.log(chalk.red.bold("Hello world!"));
}