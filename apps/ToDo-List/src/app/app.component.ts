import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
  ChangeDetectorRef
} from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon'

@Component({
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule
  ],
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  public tarefaForm!: FormGroup;
  public tarefas: TodoItem[] = [];
  public editarForm!: FormGroup;

  public displayColumns: string[] = ['select', 'descricao', 'acoes'];
  public dataSource: MatTableDataSource<TodoItem> = new MatTableDataSource();
  public selection = new SelectionModel<TodoItem>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private _fb = inject(FormBuilder);

  private _http = inject(HttpService);

  private cdr = inject(ChangeDetectorRef);

  private idEdit? = '';

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.tarefaForm = this._fb.group({
      tarefa: ['', Validators.required],
    });

    this.editarForm = this._fb.group({
      tarefa: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.resgatarTarefas();
    this.paginator.page.subscribe(() => {
      this.atualizarGrid();
    });
  }

  public incluir() {
    if (!this.tarefaForm.get('tarefa')?.value) {
      return;
    }

    const item: TodoItem = {
      descricao: this.tarefaForm.get('tarefa')?.value,
      concluido: false,
    };

    this._http.incluirTarefa(item).subscribe(() => {
      this.atualizarGrid();
      this.tarefaForm.get('tarefa')?.reset();
    });
  }

  public isAllSelected() {
    const numSelected = this.selection.select.length;
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
    this._http.excluir(row?.id).subscribe(() => {
      this.atualizarGrid();
    });
  }

  public preencherInputEditar(row?: TodoItem){
    this.editarForm.get('tarefa')?.setValue(row?.descricao)
    this.idEdit = row?.id
  }

  public editar() {
    if (!this.editarForm.get('tarefa')?.value) {
      return;
    }

    const descricaoAtualizada = this.editarForm.get('tarefa')?.value;
    this._http.editar(descricaoAtualizada, this.idEdit).subscribe(() => {
      this.atualizarGrid();
    });
  }

  public concluir(row?: TodoItem) {
    this._http.concluir(row?.id).subscribe(() => {
      this.atualizarGrid();
    });
  }

  private resgatarTarefas() {
    const paginaAtual = this.paginator.pageIndex + 1;
    const tamanhoPagina = this.paginator.pageSize;
    this._http
      .resgatarTarefas(paginaAtual, tamanhoPagina)
      .subscribe((response) => {
        this.dataSource.data = response;
      });
  }

  private atualizarGrid() {
    this.resgatarTarefas();
    this.dataSource.paginator = this.paginator;
  }
}
