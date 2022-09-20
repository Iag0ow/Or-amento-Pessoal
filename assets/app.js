//classes
class Despesas {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }
    validarDados() {
        for (const key in this) {
            if (this[key] == '' || this[key] == null || this[key] == undefined) {
                return true
            }
        }
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }
    getProximoId() {
        let proximoId = localStorage.getItem('id')
        proximoId = Number(proximoId) + 1
        return proximoId
    }
    gravar(d) {
        let id = this.getProximoId()
        localStorage.setItem(`${id}`, JSON.stringify(d))
        localStorage.setItem('id', id)
    }
    listaCompleta() {
        let despesas = Array()
        let id = localStorage.getItem('id')
        for (let index = 1; index <= id; index++) {
            let despesa = JSON.parse(localStorage.getItem(index))
            if (despesa === null) {
                continue
            }
            despesa.id = index
            despesas.push(despesa)
        }
        return despesas
    }
    pesquisar(despesa) {
        let listaFiltrada = Array()
        listaFiltrada = this.listaCompleta()
        if (despesa.ano != '') {
            listaFiltrada = listaFiltrada.filter(d => d.ano == despesa.ano)
        }
        if (despesa.mes != '') {
            listaFiltrada = listaFiltrada.filter(d => d.mes == despesa.mes)
        }
        if (despesa.dia != '') {
            listaFiltrada = listaFiltrada.filter(d => d.dia == despesa.dia)
        }
        if (despesa.tipo != '') {
            listaFiltrada = listaFiltrada.filter(d => d.tipo == despesa.tipo)
        }
        if (despesa.descricao != '') {
            listaFiltrada = listaFiltrada.filter(d => d.descricao == despesa.descricao)
        }
        if (despesa.valor != '') {
            listaFiltrada = listaFiltrada.filter(d => d.valor == despesa.valor)
        }

        return listaFiltrada
    }
    removerItem(id) {
        localStorage.removeItem(id)
    }
}
//instanciamento do banco para armazenar o id
let bd = new Bd()

function cadastrarDespesas() {
    //selecionando inputs
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    //Definindo classes


    //Instanciando a classe Despesa
    let despesas = new Despesas(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    // validando dados
    if (despesas.validarDados()) {
        document.querySelector('.modal-body').innerHTML = 'Existem campos em branco que não foram preenchidos!!'
        let exemplo = document.getElementById('exampleModalLabel')
        exemplo.innerHTML = 'Atenção!!'
        exemplo.className = 'modal-title text-danger'
        let botao = document.getElementById('botao')
        botao.innerHTML = 'Voltar e Corrigir'
        botao.className = 'btn btn-danger'

        $('#mensagem').modal('show')
    } else {
        bd.gravar(despesas)
        document.querySelector('.modal-body').innerHTML = 'Registro salvo com sucesso!!'
        let exemplo = document.getElementById('exampleModalLabel')
        exemplo.innerHTML = 'Sucesso!!'
        exemplo.className = 'modal-title text-success'
        let botao = document.getElementById('botao')
        botao.innerHTML = 'Fechar'
        botao.className = 'btn btn-success'
        $('#mensagem').modal('show')
    }

    //Limpando os campos
    document.getElementById('ano').value = ''
    document.getElementById('mes').value = ''
    document.getElementById('dia').value = ''
    document.getElementById('tipo').value = ''
    document.getElementById('descricao').value = ''
    document.getElementById('valor').value = ''
}

function carregarListaDespesas(despesas = Array(), filtro = false) {
    if (despesas.length == 0 && filtro == false) {
        despesas = bd.listaCompleta()
    }

    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''

    despesas.forEach(function (d) {
        let linha = listaDespesas.insertRow()
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        switch (d.tipo) {
            case '1': d.tipo = 'Alimentação'
                break
            case '2': d.tipo = 'Educação'
                break
            case '3': d.tipo = 'Saúde'
                break
            case '4': d.tipo = 'Transporte'
                break
        }
        linha.insertCell(1).innerHTML = `${d.tipo}`
        linha.insertCell(2).innerHTML = `${d.descricao}`
        linha.insertCell(3).innerHTML = `${d.valor}`
        let btn = document.createElement('button')
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `despesa_${d.id}`
        btn.onclick = function remover() {
            let id = this.id.replace('despesa_', '')
            bd.removerItem(id)
            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    let despesa = new Despesas(ano, mes, dia, tipo, descricao, valor)
    let filtro = bd.pesquisar(despesa)
    carregarListaDespesas(filtro, true)
}



