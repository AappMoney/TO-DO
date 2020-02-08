class Tasks {

    constructor() {
        this.tasks = [];
    }

    showLenght() {
        const allCard = document.querySelectorAll("#numSub");
        allCard.forEach(card => {
            card.innerHTML = ""
            const targetId = card.parentNode.parentNode.parentNode.id;
            for (let i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i].id === targetId) {
                    card.innerHTML = `(${this.tasks[i].subTask.length})`
                }
            }
        })
    }

    addForm(i, secontItemContent) {
        const formBlock = document.createElement("div")
        formBlock.setAttribute("class", "tasks-form_new uk-flex uk-flex-row uk-flex-middle uk-margin-top");
        formBlock.setAttribute("id", this.tasks[i].id)

        const formTextContent = `
            <span id="btnshow" class="tasks-form_show">
            <span uk-icon="icon: plus; ratio: 1.1"></span>
            New challenge
            </span>
            `
        formBlock.innerHTML = formTextContent;
        secontItemContent.appendChild(formBlock);
    }

    addSubTask(i, elem) {
        elem.innerHTML = ""
        for (let j = 0; j < this.tasks[i].subTask.length; j++) {
            const taskItem = document.createElement("div")
            taskItem.setAttribute("class", "tasks-block uk-margin-bottom")

            const taskSubTasks = `
            <div class="checkbox">
            <input class="task-input" id="tasks-input" type="checkbox">
            <label class="label-check" for="tasks-input">
            <span class="label-check-icon" uk-icon="icon: check; ratio: 1"></span>
            </label>
            </div>
            <p class="tasks-text uk-margin-small-left">${this.tasks[i].subTask[j].title}</p>
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
            elem.appendChild(taskItem);
        }
    }

    showALink(linkbtn) {
        console.log(linkbtn)
    }

    addTitle(i, secontItemContent) {
        const aLink = document.createElement('a');
        aLink.setAttribute("class", "uk-link-reset tasks-link uk-margin-top");
        const aLinkContent = `
        <h2 class="tasks-title" style="color: ${this.tasks[i].color}">
        ${this.tasks[i].title}
        <span class="uk-icon tasks-icon" uk-icon="icon: pencil"></span>
        </h2>
        `
        aLink.innerHTML = aLinkContent;
        secontItemContent.appendChild(aLink);
        const subTaskContent = document.createElement("div");
        subTaskContent.setAttribute("class", "tasks-item uk-margin-top");
        subTaskContent.setAttribute("id", this.tasks[i].id);
        secontItemContent.appendChild(subTaskContent);

        const allLink = document.querySelectorAll(".tasks-title")
        allLink.forEach(linkbtn => {
            linkbtn.addEventListener(`click`, () => {
                this.showALink(linkbtn);
            })
        });
    }



    showItem() {
        const cardItemall = document.querySelectorAll(".card-item");
        cardItemall.forEach(elem => {
            elem.addEventListener("click", () => {
                document.querySelector(".active").classList.remove("active");
                elem.classList.add("active");

                const cardId = elem.id;

                for (let i = 0; i < this.tasks.length; i++) {
                    if (this.tasks[i].id === cardId) {
                        const secontItemContent = document.getElementById("contentSecont");
                        secontItemContent.innerHTML = ""

                        this.addTitle(i, secontItemContent);

                        if (this.tasks[i].subTask.length > 0) {
                            const elem = document.querySelector(".tasks-item ")
                            this.addSubTask(i, elem)
                        }

                        this.addForm(i, secontItemContent);
                    }
                }
                // return;
                // this.showForm();
            });
        });

        document.forms["all-task-form"].addEventListener("submit", e => {
            e.preventDefault()
            this.showAllTasks();
        });

    }


    showAllTasks() {
        const secontItemContent = document.getElementById("contentSecont");
        secontItemContent.innerHTML = ""
        document.querySelector(".active").classList.remove("active");
        const showAllBtn = document.querySelector("#showAllTaskBtn");
        showAllBtn.classList.add("active")

        for (let i = 0; i < this.tasks.length; i++) {
            this.addTitle(i, secontItemContent)

            if (this.tasks[i].subTask.length > 0) {
                const taskBlock = secontItemContent.querySelector(`#${this.tasks[i].id}`)
                this.addSubTask(i, taskBlock);
            }
            this.addForm(i, secontItemContent);
        }
        // this.showForm();
    }


    generateID() {
        return Math.random().toString(36).substr(2, 9);
    }

    selectPopularColor() {
        const selectColorItem = document.querySelectorAll(".color-block");
        selectColorItem.forEach(elem => {
            elem.addEventListener("click", e => {
                e.preventDefault()
                document.querySelector(".active-color").classList.remove("active-color");
                elem.classList.add("active-color");
            });
        });

        document.forms["show-input"].addEventListener("submit", e => {
            e.preventDefault();
            this.dataPush();
        });

    }
    deleteTask = (id) => {
        
        const preTasks = [...this.tasks];
        this.tasks = preTasks.filter((item) => item.id !== id);
        console.log(document.getElementById("showAllTaskBtn"));
        this.showLenght();
        this.showAllTasks();
        this.renderTaskList();
    }

    renderTaskList = () => {
        const tasks = this.tasks;
        const taskList = document.getElementById("task-list_block");
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {

            const cardItem = document.createElement("div");
            cardItem.setAttribute("class", "card-item");
            cardItem.setAttribute("id", task.id);
            cardItem.dataset.cardId = task.id;

            const contentList = `
                <span class="card-title-block" >
                <i id="${task.color}" class="bg uk-margin-small-right"></i>
                <span class="title">${task.title} <span id="numSub">()</span></span>
                </span> 
            
            `;

            const closeBtn = document.createElement("span");
            closeBtn.classList = 'close-btn';
            closeBtn.setAttribute("uk-icon", "icon: close;ratio: .8");
            closeBtn.addEventListener("click", () => this.deleteTask(task.id));

            cardItem.innerHTML = contentList;
            cardItem.appendChild(closeBtn);
            taskList.appendChild(cardItem);
        });
    }

    dataPush() {
        const formInput = document.getElementById("input-title");
        const activeColor = document.querySelector(".active-color");
        const hex = activeColor.getAttribute("data-hex");
        const date = new Date().toISOString();

        this.tasks.push({
            title: formInput.value,
            id: this.generateID(),
            color: hex,
            subTask: [],
            createDate: date
        });
        formInput.value = ""

        const lastElemTasks = this.tasks[this.tasks.length - 1];

        const taskList = document.getElementById("task-list_block");
        const cardItem = document.createElement("div");
        cardItem.setAttribute("class", "card-item");
        cardItem.setAttribute("id", lastElemTasks.id);

        cardItem.dataset.cardId = lastElemTasks.id; // unique id for cardItem data-card-id=""
        // cardItem.dataset["card-id"] = lastElemTasks.id; // unique id for cardItem data-card-id=""


        const contentList = `
        <span class="card-title-block" >
        <i id="${activeColor.id}" class="bg uk-margin-small-right"></i>
        <span class="title">${lastElemTasks.title} <span id="numSub">()</span></span>
        </span> 
        
        `
        // <span class="close-btn" uk-icon="icon: close;ratio: .8" onclick="${this.deleteTask.bind(this, lastElemTasks.id)}" ></span>
        const closeBtn = document.createElement("span");
        closeBtn.classList = 'close-btn';
        closeBtn.setAttribute("uk-icon", "icon: close;ratio: .8");
        closeBtn.addEventListener("click", () => this.deleteTask(lastElemTasks.id));


        cardItem.innerHTML = contentList;
        cardItem.appendChild(closeBtn);
        taskList.appendChild(cardItem);
        this.showLenght()
        this.showAllTasks();
        this.showItem();

        document.querySelector('.uk-drop-close').click(); // TODO: please refactor this

        console.log(this.tasks);

    }

}

document.addEventListener("DOMContentLoaded", e => {
    const tasks = new Tasks();
    tasks.selectPopularColor();
});