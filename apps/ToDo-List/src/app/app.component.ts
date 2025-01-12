import { AfterViewInit, Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TodoItem } from './TodoItem';
import { HttpService } from './services/http.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox'
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button'

@Component({
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatButtonModule
  ],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {

  public tarefaForm!: FormGroup;
  public tarefas: TodoItem[] = [];

  public displayColumns : string[] = ['select', 'descricao', 'acoes'];
  public dataSource : MatTableDataSource<TodoItem> = new MatTableDataSource();
  public selection = new SelectionModel<TodoItem>(true,[]);

  @ViewChild(MatPaginator) paginator! : MatPaginator;

  private _fb = inject(FormBuilder);

  private _http = inject(HttpService);

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.tarefaForm = this._fb.group({
      tarefa: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.resgatarTarefas();
    this.paginator.page.subscribe(() => {
      this.resgatarTarefas()
      this.dataSource.paginator = this.paginator;
    })
  }

  public incluir() {
    const item: TodoItem = {
      descricao: this.tarefaForm.get('tarefa')?.value,
      concluido: false,
    };

    this._http.incluirTarefa(item).subscribe((x) => console.log(x));
  }

  public isAllSelected() {
    const numSelected = this.selection.select.length
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  public toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  public excluir(row?: TodoItem) {
    this._http.excluir(row?.id);
  }

  private resgatarTarefas() {
    const paginaAtual = this.paginator.pageIndex+1;
    const tamanhoPagina = this.paginator.pageSize;
    this._http.resgatarTarefas(paginaAtual, tamanhoPagina).subscribe((response) => {
      this.dataSource.data = response;
    });
  }

  //   todoList : TodoItem[] = [];
  //   newTask = ''

  //   addTask():void{
  //     if(this.newTask.trim() !== ''){

  //       const newTodoItem : TodoItem = {
  //         id : Date.now(),
  //         task : this.newTask,
  //         completed : false
  //       }

  //       this.todoList.push(newTodoItem)
  //       this.newTask = ''
  //     }
  //   }

  //   toggleCompleted(index:number):void{
  //     this.todoList[index].completed= !this.todoList[index].completed
  //   }

  //   deleteTask(id: number):void{
  //     this.todoList = this.todoList.filter(item => item.id !== id)
  //   }
}
