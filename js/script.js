

document.addEventListener('DOMContentLoaded', function() {
    // here we will put the code of our application


    function randomString() {
        var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
        var str = '';
        for (let i = 0; i < 10; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    }




    function generateTemplate(name, data, basicElement) {
        var template = document.getElementById(name).innerHTML;
        var element = document.createElement(basicElement || 'div');

        Mustache.parse(template);
        element.innerHTML = Mustache.render(template, data);

        return element;
    }

    function Column(name) {
        let self = this;
        this.id = randomString();
        this.name = name;
        this.index = 'list';
        this.element = generateTemplate('column-template', { name: this.name, id: this.id, length:this.count });


        this.element.querySelector('.column').addEventListener('click', function (event) {
           event.stopPropagation();

            if (event.target.classList.contains('btn-delete')) {
                self.removeColumn();
            }

            if (event.target.classList.contains('add-card')) {
                event.stopPropagation();
                event.preventDefault();
                this.title =  prompt("Enter the name of the card");
                this.description = prompt('Enter description card');
                self.addCard(new Card(this.title,this.description));

            }
        });
    }

    Column.prototype = {
        addCard: function(card) {
            this.element.querySelector('ul').appendChild(card.element);
        },
        removeColumn: function() {
            this.element.parentNode.removeChild(this.element);
        }
    };

    function Card(title, description) {
        const self = this;
        console.log(self)
        this.id = randomString();
        this.description = description;
        this.class = 'has';
        this.element = generateTemplate('card-template', { title: title,  description: this.description, id : this.id, class: this.class }, 'li');
        this.element.querySelector('.card').addEventListener('click', function (event) {
            event.stopPropagation();

            if (event.target.classList.contains('btn-delete')) {
                self.removeCard();
            }

        });
    }

    Card.prototype = {
        removeCard: function() {
            this.element.parentNode.removeChild(this.element);
        }
    };

    const board = {
        values: [],
        name: 'Kanban Board',
        addColumn: function(column) {
            this.values.push(column);
            this.count = this.values.length;
            this.hasChildren = document.querySelectorAll('.column-card-list').length;
            this.element.appendChild(column.element);
            initSortable(column.id); //About this feature we will tell later
         },
         getCountColumn : function() {
            return this.count;
          },
         getExistPost : function() {
           return this.hasChildren;
        },
        element: document.querySelector('#board .column-container'),

    };
        console.log(board)


    function initSortable(id) {
        let el = document.getElementById(id);
        if (el) {
            let sortable = '';
            sortable = Sortable.create(el, {
                group: 'kanban',
                sort: true
            });
        }

    }

    document.querySelector('#board .create-column').addEventListener('click', function(event) {
        let name = prompt('Enter a column name');
        let column = new Column(name);
        board.addColumn(column);
    });


    // CREATING COLUMNS
    let todoColumn = new Column('To do');
    let doingColumn = new Column('In progress');
    let doneColumn = new Column('Done');

    // ADDING COLUMNS TO THE BOARD
    board.addColumn(todoColumn);
    board.addColumn(doingColumn);
    board.addColumn(doneColumn);
    document.getElementById('count').innerHTML = ' Number column '+ board.getCountColumn() + ' exist card list '+board.getExistPost();
    console.log(document.querySelectorAll('.card').length)

    // CREATING CARDS
    let card1 = new Card('New task','New task ab. company');
    let card2 = new Card('Create kanban boards','Progress kanban');

// ADDING CARDS TO COLUMNS
    todoColumn.addCard(card1);
    doingColumn.addCard(card2);

});