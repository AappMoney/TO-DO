const addDom = (() => {
    const tasks = [];

    document.forms["show-input"].addEventListener("submit", e => {
        e.preventDefault();
        dataPush();
        document.querySelector(".uk-drop-close").click();
    });

    document.forms["all-task-form"].addEventListener("submit", e => {
        e.preventDefault();
        showAllItem(tasks);

        const btn = document.querySelector("#showAllTaskBtn")
        addActiveClassController(btn);
    });

    const addActiveClassController = btn => {
        const active = document.querySelector(".active");
        if (active) {
            active.classList.remove("active")
            btn.classList.add("active");
        } else {
            btn.classList.add("active");
        }
    }

    const activeColor = () => {
        const allBgItem = document.querySelectorAll(".color-block");
        allBgItem.forEach(i => {
            i.addEventListener("click", e => {
                e.preventDefault();
                document.querySelector(".active-color").classList.remove("active-color");
                i.classList.add("active-color");
            });
        });

        const active = document.querySelector(".active-color").getAttribute("data-hex");
        return active;
    }
    activeColor();

    const dataPush = () => {
        const cerateDate = new Date().toISOString();
        const inp = document.querySelector("#input-title");
        tasks.push({
            title: inp.value,
            id: generateID(),
            color: activeColor(),
            subTask: [],
            date: cerateDate
        });
        inp.value = ""

        renderCard(tasks);
        showAllItem(tasks);
    }

    const renderCard = (data) => {
        const tasksBlock = document.querySelector("#task-list_block");
        tasksBlock.innerHTML = "";

        for (let key of data) {
            const divBlock = document.createElement("div")
            divBlock.classList = "card-item"
            divBlock.dataset.cardId = key.id
            divBlock.addEventListener("click", e => {
                e.preventDefault();
                if (e.target.classList == "title" || e.target.id == "lengthSub" || e.target.classList == "bg" || e.target.classList == "card-item" || e.target.classList == "card-title-block") {
                    showItem(divBlock.getAttribute("data-card-id"))
                }
            });

            const contentDiv = `
            <span class="card-title-block">
            <i class="bg uk-margin-small-right" style="background-color: ${key.color}"></i>
            <span class="title">${key.title} <span id="lengthSub">(${key.subTask.length})</span></span>
            </span>
            `
            const btnRemove = document.createElement("span")
            btnRemove.setAttribute("uk-icon", "icon: close;ratio: .8");
            btnRemove.classList = "close-btn";
            btnRemove.addEventListener("click", () => removeCard(btnRemove.parentNode.getAttribute("data-card-id")));

            divBlock.innerHTML = contentDiv;
            divBlock.appendChild(btnRemove);
            tasksBlock.appendChild(divBlock);
        }
    }

    const removeCard = id => {
        const control = confirm("Do you really want to delete it?")
        if (control) {

            // const cloneTask = [...tasks];
            // tasks = cloneTask.filter(elem => elem.id != id);
            for (let elem of tasks) {
                if (elem.id === id) {
                    tasks.splice(tasks.indexOf(elem), 1);
                }
            }
            renderCard(tasks);
            showAllItem(tasks);
            // console.log(tasks)
        }
    }

    const showItem = (id) => {
        const ferstBlock = document.querySelectorAll(".card-item");
        for (let btn of ferstBlock) {
            if (btn.getAttribute("data-card-id") === id) {
                addActiveClassController(btn);
            }
        }
        showAllItem(tasks.filter(elem => elem.id === id))
    }

    const showAllItem = (data) => {
        const contentSecont = document.querySelector("#contentSecont");
        contentSecont.innerHTML = ""


        for (let key of data) {
            addTitle(key, contentSecont);
            if (key.subTask.length > 0) {
                addSubTask(key);
            }
            addFormBlock(key, contentSecont);
        }
    }

    const addTitle = (key, contentSecont) => {
        const aLink = document.createElement("a");
        aLink.classList = "uk-link-reset tasks-link uk-margin-top"
        aLink.dataset.id = key.id;
        aLink.addEventListener("click", e => {
            e.preventDefault();
            if (e.target.classList == "tasks-title") {
                showItem(aLink.getAttribute("data-id"))
            }
        });

        const hTwoTitle = document.createElement("h2");
        hTwoTitle.classList = "tasks-title";
        hTwoTitle.style.color = key.color;
        hTwoTitle.textContent = key.title;

        const editPencil = document.createElement("span");
        editPencil.classList = "uk-icon tasks-icon uk-margin-small-left";
        editPencil.setAttribute("uk-icon", "icon: pencil");
        editPencil.addEventListener("click", () => editTitlt(editPencil));

        const dateCard = document.createElement("span");
        dateCard.className = "uk-text data-item";
        dateCard.id = "date-card";
        // const dateRevers = key.data
        dateCard.textContent = key.date.slice(0, 10);


        hTwoTitle.appendChild(editPencil)
        hTwoTitle.appendChild(dateCard)
        aLink.appendChild(hTwoTitle);
        contentSecont.appendChild(aLink);
        const subTaskDiv = document.createElement("div");
        subTaskDiv.classList = "tasks-item uk-margin-top";
        subTaskDiv.dataset.subId = key.id;
        contentSecont.appendChild(subTaskDiv);
    }

    const editTitlt = iconPath => {
        const id = iconPath.parentNode.parentNode.getAttribute("data-id");
        tasks.filter(elem => {
            if (id === elem.id) {
                const prop = prompt("",elem.title);
                if (prop.length > 0) {
                    const active = document.querySelector(".active");
                    elem.title = prop
                    if (active.className == "show-all_card__btn active") {
                        const cardItem = document.querySelectorAll(".card-item");
                        cardItem.forEach(item => {
                            if (item.getAttribute("data-card-id") === id) {
                                const spanText = item.querySelector(".title");

                                spanText.innerHTML = `${elem.title} <span id="lengthSub">(${elem.subTask.length})</span>`
                                // item.textContent = elem.title;
                            }
                        });
                        showAllItem(tasks);
                    } else if (active.className == "card-item active") {
                        const cardItem = document.querySelectorAll(".card-item");
                        cardItem.forEach(item => {
                            if (item.getAttribute("data-card-id") === id) {
                                const spanText = item.querySelector(".title");

                                spanText.innerHTML = `${elem.title} <span id="lengthSub">(${elem.subTask.length})</span>`
                                // item.textContent = elem.title;
                            }
                        });
                        showItem(elem.id)
                    }
                }
            }
        })
    }

    const addSubTask = (key) => {
        let subTaskBlock;
        const tasksBlock = document.querySelectorAll(".tasks-item");
        for (let task of tasksBlock) {
            if (task.getAttribute("data-sub-id") === key.id) {
                subTaskBlock = task;
            }
        }

        subTaskBlock.innerHTML = "";

        for (let subTask of key.subTask) {
            const subDiv = document.createElement("div");
            subDiv.classList = "tasks-block uk-margin-bottom";
            subDiv.dataset.subtaskId = subTask.id;

            const divChek = document.createElement("div");
            divChek.classList = "checkbox";

            const divLabel = document.createElement("div");
            if (subTask.active) {
                divLabel.classList = "label-check active-label";
            } else if (!subTask.active) {
                divLabel.classList = "label-check";
            }
            divLabel.addEventListener("click", () => addActiveLabel(divLabel));

            const labelSpan = document.createElement("span")
            labelSpan.classList = "label-check-icon";
            labelSpan.setAttribute("uk-icon", "icon: check; ratio: 1");

            divLabel.appendChild(labelSpan);
            divChek.appendChild(divLabel);
            subDiv.appendChild(divChek);

            const contentP = document.createElement("p");
            contentP.classList = "tasks-text uk-margin-small-left";
            contentP.innerHTML = subTask.title;

            subDiv.appendChild(contentP);

            const divRow = document.createElement("div");
            divRow.classList = "uk-flex uk-flex-row tasks-item_row";
            divRow.dataset.btnId = subTask.id;

            const retentionDiv = document.createElement("div")
            const editSpan = document.createElement("span");
            editSpan.classList = "tasks-edit_icon";
            editSpan.setAttribute("uk-icon", "icon: pencil; ratio: .8");
            editSpan.addEventListener("click", () => editSubTask(editSpan.parentNode.parentNode.getAttribute("data-btn-id"), "edit"));

            const retentionDivTwo = document.createElement("div");
            const deleteSpan = document.createElement("span");
            deleteSpan.classList = "tasks-deleted_icon";
            deleteSpan.setAttribute("uk-icon", "icon: trash; ratio: .8");
            deleteSpan.addEventListener("click", () => editSubTask(deleteSpan.parentNode.parentNode.getAttribute("data-btn-id"), "deleted"));


            retentionDiv.appendChild(editSpan);
            retentionDivTwo.appendChild(deleteSpan);
            divRow.appendChild(retentionDiv)
            divRow.appendChild(retentionDivTwo);
            subDiv.appendChild(divRow);

            // subDiv.innerHTML = content;
            subTaskBlock.appendChild(subDiv);
        }
    }

    const addActiveLabel = div => {
        const itemID = div.parentNode.parentNode.parentNode.getAttribute("data-sub-id");
        const subID = div.parentNode.parentNode.getAttribute("data-subtask-id");
        tasks.filter(elem => {
            if (elem.id === itemID) {
                elem.subTask.filter(subelem => {
                    if (subelem.id === subID) {

                        if (div.classList[1] == "active-label") {
                            subelem.active = false;
                            addSubTask(elem);
                        } else if (div.classList[1] == undefined) {
                            subelem.active = true;
                            addSubTask(elem);
                        }

                    }
                })
            }
        })
    }

    const editSubTask = (id, control) => {
        // console.log(id)
        if (control === "edit") {
            for (let key of tasks) {
                key.subTask.filter(sub => {
                    if (sub.id === id) {
                        const textSub = prompt("", sub.title);
                        if (textSub.length > 0) {
                            sub.title = textSub;
                            // console.log(key);
                            addSubTask(key)
                        }
                    }
                });
            }
        } else if (control === "deleted") {
            for (let j of tasks) {
                for (let k of j.subTask) {
                    if (k.id === id) {
                        const controlT = confirm("Do you really want to delete it");
                        if (controlT) {
                            j.subTask.splice(j.subTask.indexOf(k), 1);
                            addSubTask(j)
                            const lenghtShowItem = document.querySelectorAll("#lengthSub");
                            for (let item of lenghtShowItem) {
                                if (item.parentNode.parentNode.parentNode.getAttribute("data-card-id") === j.id) {
                                    item.innerHTML = `(${j.subTask.length})`
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }

    }

    const addFormBlock = (key, contentSecont) => {
        const formDiv = document.createElement("div");
        formDiv.classList = "tasks-form_new uk-flex uk-flex-row uk-flex-middle uk-margin-top";
        formDiv.dataset.formId = key.id;

        const showFormBtn = document.createElement("span")
        showFormBtn.classList = "tasks-form_show";
        showFormBtn.id = "btnshow";
        showFormBtn.addEventListener("click", () => showForm(showFormBtn));
        const content = `
        <span uk-icon="icon: plus; ratio: 1.1"></span>
        New challenge
        `
        showFormBtn.innerHTML = content;
        formDiv.appendChild(showFormBtn);
        contentSecont.appendChild(formDiv);
    }

    const showForm = btn => {
        const btnParent = btn.parentNode;
        const id = btn.parentNode.getAttribute("data-form-id");

        const formelem = document.createElement("form");
        formelem.classList = "uk-flex uk-flex-column task-add_form__block";
        formelem.addEventListener("submit", e => {
            e.preventDefault();
            dataPushSubTask(id);
            hiddenForm(btnParent, id)
        });

        const content = `
        <input autofocus id="subInp" class="uk-input add-tasks_input uk-border-rounded" type="text" placeholder="text challange">
        <div class="uk-margin-small-top" id="btnGroup">
        <button class="tasks-add_btn">Add task</button>
        <button class="tasks-cancel_btn" type="click">Cancel</button>
        </div>
        `

        formelem.innerHTML = content;
        btnParent.innerHTML = ""
        btnParent.appendChild(formelem);

        const btnCancel = document.querySelector(".tasks-cancel_btn");
        btnCancel.addEventListener("click", e => {
            e.preventDefault();
            hiddenForm(btnParent)
        })

        window.addEventListener("mouseup", e => {
            if (!btnParent.contains(e.target)) {
                hiddenForm(btnParent);
            }
        });
    }
    const dataPushSubTask = id => {
        for (let task of tasks) {
            if (task.id === id) {
                const inp = document.querySelector("#subInp");

                task.subTask.push({
                    title: inp.value,
                    id: generateID(),
                    active: false
                });

                addSubTask(task);

                const lenghtShowItem = document.querySelectorAll("#lengthSub");
                for (let item of lenghtShowItem) {
                    if (item.parentNode.parentNode.parentNode.getAttribute("data-card-id") === id) {
                        item.innerHTML = `(${task.subTask.length})`
                        return;
                    }
                }
            }
        }
    }

    const hiddenForm = btn => {
        const showFormBtn = document.createElement("span")
        showFormBtn.classList = "tasks-form_show";
        showFormBtn.id = "btnshow";
        showFormBtn.addEventListener("click", () => showForm(showFormBtn));

        const content = `
        <span uk-icon="icon: plus; ratio: 1.1"></span>
        New challenge
        `

        showFormBtn.innerHTML = content;
        btn.innerHTML = ""
        btn.appendChild(showFormBtn);

    }

    const generateID = () => {
        return Math.random().toString(36).substr(2, 9);
    }

})();