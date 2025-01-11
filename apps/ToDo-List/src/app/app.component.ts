import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { FormsModule } from '@angular/forms';
import { NgClass, NgFor } from '@angular/common';

export interface TodoItem{
  id: number;
  task: string;
  completed: boolean;

}

@Component({
  imports: [NxWelcomeComponent, RouterModule,FormsModule, NgFor,NgClass],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {

  title = 'ToDo-List'

  todoList : TodoItem[] = [];
  newTask = ''

  addTask():void{
    if(this.newTask.trim() !== ''){

      const newTodoItem : TodoItem = {
        id : Date.now(),
        task : this.newTask,
        completed : false
      }

      this.todoList.push(newTodoItem)
      this.newTask = ''
    }
  }

  toggleCompleted(index:number):void{
    this.todoList[index].completed= !this.todoList[index].completed
  }

  deleteTask(id: number):void{
    this.todoList = this.todoList.filter(item => item.id !== id)
  }
}
