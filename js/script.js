let form = document.querySelector('.form');
let inputTask = document.querySelector('.form__input');
let listOfTasks = document.querySelector('.list');
let emptyList = document.querySelector('.list__empty');
let cleaner = document.querySelector('.main__subtitle--right');

let tasks = [];

//localstorage
if (localStorage.getItem('tasks')) {
   tasks = JSON.parse(localStorage.getItem('tasks'));

   tasks.forEach(task => {
      renderTask(task);
   });

   saveStatus();
}

form.addEventListener('submit', createTask);
listOfTasks.addEventListener('click', removeTask);
listOfTasks.addEventListener('click', markTask);
listOfTasks.addEventListener('click', editTask);
cleaner.addEventListener('click', clearAll);

function createTask(event) {
   event.preventDefault();

   if (inputTask.value === '') return;

   let newTask = {
      id: Date.now(),
      text: inputTask.value,
      done: false,
   };

   tasks.push(newTask);

   saveToLocalStorage();

   renderTask(newTask);

   inputTask.value = '';
   inputTask.focus();

}

function removeTask(event) {

   if (event.target.closest('.item__del')) {
      let parent = event.target.closest('.item');

      tasks.forEach((el, index) => el.id === +parent.id ? tasks.splice(index, 1): el);
      parent.remove();

      saveToLocalStorage();
   }

   if (!listOfTasks.contains(document.querySelector('.item'))) {
      emptyList.classList.remove('hide');
   }
}

function markTask(event) {
   if (!event.target.closest('.item__done')) return;

   let parent = event.target.closest('.item');
   let titleOfTask = parent.querySelector('.item__title');
   let btnCheck = parent.querySelector('i');
   let task = tasks.find(el => el.id === +parent.id);

   titleOfTask.classList.toggle('item__title--done');
   btnCheck.classList.toggle('hide');
   task.done = !task.done;

   saveToLocalStorage();
}

function editTask(event) {
   let btnCorrect = event.target.closest('.item__correct');

   if (btnCorrect) {

      let parent = event.target.closest('.item');
      let nameTask = parent.querySelector('.item__title');
      let editor = parent.querySelector('.item__edit');
      let inputEdit = editor.querySelector('.item__edit--input');
      let btnEdit = editor.querySelector('.item__edit--btn');
      let btnDone = parent.querySelector('.item__done');
      let btnDel = parent.querySelector('.item__del');

      btnDone.classList.add('hide');
      btnDel.classList.add('hide');
      nameTask.classList.add('hide');
      editor.classList.remove('hide');
      btnCorrect.classList.add('hide');

      inputEdit.value = nameTask.textContent;

      btnEdit.addEventListener('click', function (event) {
         event.preventDefault();

         if (inputEdit.value === '') return;

         nameTask.textContent = inputEdit.value;

         let task = tasks.find(el => el.id === +parent.id);
         task.text = inputEdit.value;

         saveToLocalStorage();


         nameTask.classList.remove('hide');
         editor.classList.add('hide');
         btnCorrect.classList.remove('hide');
         btnDone.classList.remove('hide');
         btnDel.classList.remove('hide');

      });
   }
}

function clearAll() {
   listOfTasks.replaceChildren()

   tasks.length = 0;
   saveToLocalStorage();

   emptyList.classList.remove('hide');
   listOfTasks.append(emptyList);
}

function saveToLocalStorage() {
   localStorage.setItem('tasks', JSON.stringify(tasks));
}

function saveStatus() {
   let statusCheck = document.querySelectorAll('.item__done i');
   for (let i = 0; i < statusCheck.length; i++) {
      if (tasks[i].done) {
         statusCheck[i].classList.remove('hide');
      }
   }
}

function renderTask(task) {
   let taskHTML = document.createElement('li');
   taskHTML.setAttribute('id', `${task.id}`);
   taskHTML.classList.add('item');

   let cssClass = task.done ? 'item__title item__title--done' : 'item__title';

   taskHTML.innerHTML = `
      <div class='item__btns'>
         <button class="item__done" type="button">
            <i class="fa-solid fa-check fa-2xl hide" style="color: #14431c;"></i>
         </button>
      </div>
      <span class="${cssClass}">${task.text[0].toUpperCase() + task.text.slice(1)}</span>
      <form class='item__edit hide'>
         <input class='item__edit--input' type='text' name='task'>
         <button class='item__edit--btn' type='submit'>OKEY</button>
      </form>
      <div class='item__btns'>
         <button class="item__correct" type="button">
            <i class="fa-solid fa-pencil fa-2xl" style="color: #113616;"></i>
         </button>
         <button class="item__del" type="button">
            <i class="fa-solid fa-trash-can fa-2xl" style="color: #143918;"></i>
         </button>
      </div>
   `;

   listOfTasks.insertAdjacentElement('beforeend', taskHTML);

   emptyList.classList.add('hide');
}

