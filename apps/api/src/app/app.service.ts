
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { CreateItemDto } from './create-item.dto';

@Injectable()
export class AppService {

  constructor(private readonly prisma: PrismaService) {}

  async buscar() {
    return await this.prisma.tarefa.findMany();
  }

  async resgatarTarefa(paginaAtual : number, tamanhoPagina : number) {

    return await this.prisma.tarefa.findMany({
      skip: (paginaAtual-1)* tamanhoPagina,
      take: tamanhoPagina
    })
  }

  async postData(item: CreateItemDto) {
    return await this.prisma.tarefa.create({
      data: {
        descricao: item.descricao,
        concluido: false
      }
    })
  }

  async excluir(id: string) {
    await this.prisma.tarefa.delete({
      where: {
        id:id
      }
    })
  }

}
