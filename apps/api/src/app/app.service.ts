import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ItemDto } from './item.dto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async buscar() {
    return await this.prisma.tarefa.findMany();
  }

  async resgatarTarefa(paginaAtual: number, tamanhoPagina: number) {
    return await this.prisma.tarefa.findMany({
      skip: (paginaAtual - 1) * tamanhoPagina,
      take: tamanhoPagina,
    });
  }

  async postData(item: ItemDto) {
    return await this.prisma.tarefa.create({
      data: {
        descricao: item.descricao,
        concluido: false,
      },
    });
  }

  async excluir(id: string) {
    await this.prisma.tarefa.delete({
      where: {
        id: id,
      },
    });
  }

  async editar(editarItemDto) {
    console.log(editarItemDto);
    console.log(editarItemDto.novaDescricao);

    const data = {
      descricao: editarItemDto.novaDescricao,
      concluido: false,
    };

    console.log(data);

    try {
      return await this.prisma.tarefa.updateMany({
        where: {
          id: editarItemDto.id,
        },
        data,
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }

  async concluir(idTarefa: string) {
    console.log(idTarefa)
    try {
      const tarefa = await this.prisma.tarefa.findFirstOrThrow({
        where: {
          id: idTarefa
        }
      });

      console.log(tarefa)
      const data = {
        descricao : tarefa.descricao,
        concluido : !tarefa.concluido
      }
      return await this.prisma.tarefa.update({
        where: {
          id: idTarefa,
        },
        data,
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      throw error;
    }
  }
}
