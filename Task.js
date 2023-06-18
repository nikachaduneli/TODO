class Task {
  constructor(id, task, done) {
    this.id = id;
    this.task = task;
    this.done = done;
  }

  save() {
    savedTaskList.push(this);
    updateLocalStorage();
  }
}
