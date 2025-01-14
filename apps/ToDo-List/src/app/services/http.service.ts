import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TodoItem } from '../TodoItem';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root',})
export class HttpService {
  private http = inject(HttpClient)

  private apiUrl = "http://localhost:3000/api/tasks"

  public incluirTarefa(item : TodoItem){
  return this.http.post(`${this.apiUrl}`, item)
  }

  public resgatarTarefas(paginaAtual : number, tamanhoPagina : number): Observable<TodoItem[]> {
    return this.http.get<TodoItem[]>(`${this.apiUrl}/${paginaAtual}&${tamanhoPagina}`) ;
  }

  public excluir(id?: string) {
    return this.http.delete(`${this.apiUrl}/${id}`)
  }

  public editar( descricao : string, id?: string ) {
    const tarefa = {
      id : id,
      novaDescricao : descricao
    }
    return this.http.put(`${this.apiUrl}`, tarefa);
  }

  public concluir(id: string | undefined) {
    const data = {
      id : id
    }
    return this.http.put(`${this.apiUrl}/concluir`, data);
  }

}
