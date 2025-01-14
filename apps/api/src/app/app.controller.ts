import { Concluido } from './concluir';
import { Body, Controller, Get, Post, Param, Delete, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiParam } from '@nestjs/swagger';
import { ItemDto } from './item.dto';

@Controller('tasks')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':paginaAtual&:tamanhoPagina')
  @ApiParam({ name: 'paginaAtual', type: String, description: 'Pagina atual da grid' })
  @ApiParam({ name: 'tamanhoPagina', type: String, description: 'Número máximo de itens a ser buscado no banco' })
  buscarTodos(@Param() params: {paginaAtual : string; tamanhoPagina : string}
  ) {

    const paginaAtual = parseInt(params.paginaAtual, 10);
    const tamanhoPagina = parseInt(params.tamanhoPagina, 10);

    if (isNaN(paginaAtual) || isNaN(tamanhoPagina)) {
      throw new Error('Os parâmetros paginaAtual e tamanhoPagina devem ser números.');
    }

    return this.appService.resgatarTarefa(paginaAtual, tamanhoPagina);
  }

  @Post()
  async incluir(@Body() createItemDto : ItemDto) {
    return await this.appService.postData(createItemDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: String, description: 'ID da tarefa a ser excluída' })
  async excluir(@Param() params: { id:string } ){
    console.log(params.id)
    return await this.appService.excluir(params.id);
  }

  @Put()
  async editar(@Body() editarItemDto) {

    return await this.appService.editar(editarItemDto)

  }

  @Put("/concluir")
  async conlcuir(@Body() concluido : Concluido){
    return await this.appService.concluir(concluido.id);
  }
}
