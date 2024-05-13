import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule, //biblioteca de formulários do Angular
    ReactiveFormsModule, //biblioteca de formulários do Angular
    CommonModule //biblioteca de funções básicas do Angular
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  endpoint: string = 'http://localhost:5128/api/produtos/';

  produtos: any[] = [];

  //variável para exibir mensagem de sucesso ao cadastrar uma tarefa
  mensagemCadastro: string = '';
  mensagemConsulta: string = ''; //texto de mensagem

  //objeto para capturar os campos do formulário
  formConsulta = new FormGroup({
    dataInicio: new FormControl('', [Validators.required]), //campo data de início
    dataFim: new FormControl('', [Validators.required]) //campo data de fim
  });


  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
    descricao: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(250)]),
    preco: new FormControl('', [Validators.required]),
    quantidade: new FormControl('', [Validators.required]),
    dataHora: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required])
  });


  //objeto para capturar os campos do formulário de edição
  formEdicao = new FormGroup({
    id: new FormControl(''),
    nome: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]),
    descricao: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(250)]),
    preco: new FormControl('', [Validators.required]),
    quantidade: new FormControl('', [Validators.required]),
    dataHora: new FormControl('', [Validators.required]),
    estado: new FormControl('', [Validators.required])
  });

  get fConsulta() {
    return this.formConsulta.controls;
  }
  //função auxiliar para que possamos exibir as
  //mensagens de erro de validação do formCadastro
  get fCadastro() {
    return this.formCadastro.controls;
  }

  //função auxiliar para que possamos exibir as
  //mensagens de erro de validação do formEdicao
  get fEdicao() {
    return this.formEdicao.controls;
  }

  //método construtor
  constructor(
    private httpClient: HttpClient
  ) { }


  pesquisarProduto(): void {
    //capturar as datas preenchidas em variáveis
    const dataInicio = this.formConsulta.value.dataInicio;
    const dataFim = this.formConsulta.value.dataFim;
    //fazendo a requisição para a API GET: /api/tarefas
    this.httpClient
      .get(this.endpoint + dataInicio + "/" + dataFim)
      .subscribe({ //aguardando a resposta da API
        next: (dados) => { //capturando resposta de sucesso
          //armazenar na variável do componente os dados obtidos da API
          this.produtos = dados as any[];
          //verificando se alguma tarefa foi encontrada
          if (this.produtos != null && this.produtos.length > 0) {
            this.mensagemConsulta = 'Quantidade de produtos obtidos: ' + this.produtos.length;
          }
          else {
            this.mensagemConsulta = 'Nenhum produto foi encontrado para o período selecionado.';
          }
        },
        error: (e) => { //capturando resposta de erro
          console.log(e.error);
        }
      });
  }

  //função para executar o cadastro do produto
  cadastrarProduto(): void {
    //requisição POST para a API cadastrar o produto
    this.httpClient.post(this.endpoint, this.formCadastro.value)
      .subscribe({ //aguardando a resposta da API
        next: (data) => { //capturando a resposta de sucesso
          this.mensagemCadastro = 'Produto cadastrado com sucesso';
          //limpando os campos do formulário..
          this.formCadastro.reset();
        },
        error: (e) => { //capturando a resposta de erro
          console.log(e.error);
        }
      });
  }


  //função para excluir a tarefa
  excluirProduto(id: string): void {
    //pedindo confirmação do usuário
    if (confirm('Deseja realmente excluir o produto selecionado?')) {
      //excluindo a tarefa
      this.httpClient.delete(this.endpoint + id)
        .subscribe({
          next: (data: any) => { //capturando a resposta de sucesso
            alert('Produto excluído com sucesso');
            this.pesquisarProduto(); //fazendo a consulta das tarefas
          },
          error: (e) => { //capturando a resposta de erro
            console.log(e.error);
          }
        });
    }
  }


  obterProduto(produto: any): void {

    this.formEdicao.controls['id'].setValue(produto.id);
    this.formEdicao.controls['nome'].setValue(produto.nome);
    this.formEdicao.controls['descricao'].setValue(produto.descricao);
    this.formEdicao.controls['preco'].setValue(produto.preco);
    this.formEdicao.controls['quantidade'].setValue(produto.quantidade);
    this.formEdicao.controls['dataHora'].setValue(produto.dataHora.substring(0, 16));
    this.formEdicao.controls['estado'].setValue(produto.estado);

  }

  //função para atualizar a tarefa quando o usuário
  //clicar no botão SUBMIT do formulário de edição
  editarProduto(): void {
    //requisição PUT para a API cadastrar a tarefa
    this.httpClient.put(this.endpoint, this.formEdicao.value)
      .subscribe({ //aguardando a resposta da API
        next: (data) => { //capturando a resposta de sucesso
          //console.log(data);
          alert('Produto atualizado com sucesso.');
          this.pesquisarProduto();
        },
        error: (e) => { //capturando a resposta de erro
          console.log(e.error);
        }
      });
  }
}
