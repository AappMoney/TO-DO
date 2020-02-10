class TODO {
    constructor() {
        this.tasks = [];
    }

    addAvtiveClass(elem){
        const active = document.querySelector(".active");
        if(active) {
            active.classList.remove("active")
            elem.classList.add("active")
        }else {
            elem.classList.add("active");
        }
    }

    showLength() {
        this.tasks.forEach(elem => {
            const lengthSpan = document.querySelectorAll("#lengthSub");
            lengthSpan.forEach(item => {
                item.innerHTML = `(${elem.subTask.length})`
            })
        });
    }

    renderCard() {
        const btnshowAll = document.querySelector("#showAllTaskBtn");
        this.addAvtiveClass(btnshowAll);

        const taskBlock = document.getElementById("task-list_block");
        taskBlock.innerHTML = ""
        this.tasks.forEach(elem => {
        const divBlock = document.createElement("div")
        divBlock.classList = "card-item";
        divBlock.dataset.cardId = elem.id;

        const cantentBlock = `
        <span class="card-title-block">
            <i class="bg uk-margin-small-right" style="background-color: ${elem.color}"></i>
                <span class="title">${elem.title} <span id="lengthSub"></span></span>
        </span> 
        <span class="close-btn" uk-icon="icon: close;ratio: .8"></span>
        `
        divBlock.innerHTML = cantentBlock;
        taskBlock.appendChild(divBlock);        
        });
    }

    selectPopularColor(){
       const colorItem = document.querySelectorAll(".color-block");
       colorItem.forEach(colorI => {
           colorI.addEventListener("click", e => {
               e.preventDefault();
               document.querySelector(".active-color").classList.remove("active-color");
               colorI.classList.add("active-color");
           });
       });

       document.forms["show-input"].addEventListener("submit", e => {
           e.preventDefault();
           this.dataPush();
       });
    }

    dataPush() {
        const input = document.getElementById("input-title");
        const activeColor = document.querySelector(".active-color").getAttribute("data-hex");
        const dataNow = new Date().toISOString();

        this.tasks.push({
            title: input.value,
            id: this.generateID(),
            color: activeColor,
            subTask: [],
            createDate: dataNow
        });
        input.value = ""

        this.renderCard();
        this.showallTask();
        this.showLength();
        console.log(this.tasks)
    }
    removeCard() {
        const spanBtn = document.querySelectorAll(".close-btn");
        spanBtn.forEach(btn => {
            btn.addEventListener("click", e => {
                e.preventDefault();
                console.log(btn.parentNode)
                const cloneTasks = [...this.tasks];
                this.tasks = cloneTasks.filter(elem => elem.id != btn.parentNode.getAttribute("data-card-id"));

                this.renderCard();
                this.showallTask();
                this.showLength();
            });
        });

        const cards = document.querySelectorAll(".card-item");
        cards.forEach(card => {
            card.addEventListener("click", e => {
                e.preventDefault();
                if(e.target.classList == "title" || e.target.id == "lengthSub" || e.target.classList == "bg" || e.target.classList == "card-item" || e.target.classList == "card-title-block") {
                    this.addAvtiveClass(card);
                    const elementTS = this.tasks.filter(elem => elem.id === card.getAttribute("data-card-id"));
                    this.showItem(elementTS[0]);
                    return;
                }
            });
        })
    }

    showItem(elem) {
        const secontContent = document.getElementById("contentSecont");
        secontContent.innerHTML = "";

        const aLink = document.createElement('a');
        aLink.classList = "uk-link-reset tasks-link uk-margin-top";
        const aLinkContent = `
        <h2 class="tasks-title" style="color: ${elem.color}">
        ${elem.title}
        <span class="uk-icon tasks-icon" uk-icon="icon: pencil"></span>
        </h2>
        `

        const subTaskContent = document.createElement("div");
        subTaskContent.classList = "class", "tasks-item uk-margin-top";
        subTaskContent.dataset.subId = elem.id;

        aLink.innerHTML = aLinkContent;
        secontContent.appendChild(aLink);
        secontContent.appendChild(subTaskContent);

        if(elem.subTask.length > 0) {
            this.addSubTask(elem);
        }

        this.addForm(elem, secontContent);
        

        document.forms["all-task-form"].addEventListener("submit", e => {
            e.preventDefault();
            this.showallTask();
        });
    }

    showallTask(){
        const btnshowAll = document.querySelector("#showAllTaskBtn");
        this.addAvtiveClass(btnshowAll);
        const secontContent = document.getElementById("contentSecont");
        secontContent.innerHTML = "";
        this.addTitle();

        this.removeCard();
        // this.showItem();
    }

    addTitle() {
        const secontContent = document.getElementById("contentSecont");

        this.tasks.forEach(elem => {
        const aLink = document.createElement('a');
        aLink.classList = "uk-link-reset tasks-link uk-margin-top";
        const aLinkContent = `
        <h2 class="tasks-title" style="color: ${elem.color}">
        ${elem.title}
        <span class="uk-icon tasks-icon" uk-icon="icon: pencil"></span>
        </h2>
        `

        const subTaskContent = document.createElement("div");
        subTaskContent.classList = "tasks-item uk-margin-top";
        subTaskContent.dataset.subId = elem.id;

        aLink.innerHTML = aLinkContent;
        secontContent.appendChild(aLink);
        secontContent.appendChild(subTaskContent);

        if(elem.subTask.length > 0) {
            this.addSubTask(elem);
        }

        this.addForm(elem,secontContent);
        });
    }

    addSubTask(elem) {
        const subTaskBlock = document.querySelector(`${elem.id}`);
        subTaskBlock.innerHTML = ""
        elem.subTask.forEach(sub => {
            for(let i = 0 ; i < sub.length; i++) {
                const taskItem = document.createElement("div")
                taskItem.classList = "tasks-block uk-margin-bottom";
    
                const taskSubTasks = `
                <div class="checkbox">
                <input class="task-input" id="tasks-input" type="checkbox">
                <label class="label-check" for="tasks-input">
                <span class="label-check-icon" uk-icon="icon: check; ratio: 1"></span>
                </label>
                </div>
                <p class="tasks-text uk-margin-small-left">${sub[i].title}</p>
                <div class="uk-flex uk-flex-row tasks-item_row">
                <div>
                <span class="tasks-edit_icon" uk-icon="icon: pencil; ratio: .8"></span>
                </div>
                <div>
                <span class="tasks-deleted_icon" uk-icon="icon: trash; ratio: .8"></span>
                </div>
                </div>
            `
    
                taskItem.innerHTML = taskSubTasks;
                subTaskBlock.appendChild(taskItem);
            }
        });
    }

    addForm(elem,secontContent) {
        const formBlock = document.createElement("div")
        formBlock.classList = "tasks-form_new uk-flex uk-flex-row uk-flex-middle uk-margin-top";
        formBlock.dataset.forId = elem.id;

        const formTextContent = `
            <span id="btnshow" class="tasks-form_show">
            <span uk-icon="icon: plus; ratio: 1.1"></span>
            New challenge
            </span>
            `
        formBlock.innerHTML = formTextContent;
        secontContent.appendChild(formBlock);
        return;
    }

    generateID() {
        return Math.random().toString(36).substr(2,9);
    }
}


window.addEventListener("DOMContentLoaded", () => {
    const todo = new TODO();
    todo.selectPopularColor();
});