export interface FAQItem {
  question: string
  answer: string
  category: string
}

export const faqItems: FAQItem[] = [
  {
    question: "Como faço para editar um n° de telefone?",
    answer: `Para editar um número de telefone ou qualquer outra informação sobre um cliente, siga os passos abaixo:
    1. Acesse o menu "Cadastros" na barra lateral esquerda.
    2. Clique no ícone de uma caneta ao lado do cliente que deseja editar.
    3. No card que se abrir, ative a opção "Editar cliente".
    4. Realize as alterações necessárias e finalize clicando em "Editar beneficiário" ou "Editar cliente".`,
    category: "Clientes"
  },
  {
    question: "Como faço para incluir/excluir um processo?",
    answer: `Para incluir um processo individualmente, clique no ícone "Adicionar um processo" no canto superior direito e ative a opção "Novo cliente".
Se precisar incluir processos em massa, utilize o botão "Importar planilha". Primeiro, baixe o modelo de planilha disponível em "Baixar exemplo de planilha", preencha-o com os dados necessários e faça o upload no campo indicado.
Para excluir um processo, clique no ícone de lixeira vermelha ao lado do processo desejado.`,
    category: "Processos"
  },
  {
    question: "Como faço para ver as interações de quem está chamando a IVi?",
    answer: `Atualmente, ainda não é possível visualizar todas as interações diretamente no sistema. Mas não se preocupe! Essa funcionalidade está em desenvolvimento e será lançada em breve para facilitar o acompanhamento das interações.
Enquanto isso, caso precise consultar alguma interação específica, você pode solicitar essa informação ao seu gerente de contas, que estará disponível para ajudar.`,
    category: "Sistema"
  },
  {
    question: "O que significa 'Validando/Silêncio'?",
    answer: `• Validando: Este status é utilizado após o cadastro, enquanto enviamos a mensagem inicial ao cliente e aguardamos a primeira resposta.
• Silêncio: Indica que o cliente recebeu a mensagem inicial, mas ainda não se manifestou, ou seja, não aceitou nem recusou o envio de novidades.`,
    category: "Sistema"
  },
  {
    question: "O que é Secretariado Simples?",
    answer: `O serviço de Secretariado Simples é um serviço acionado quando o cliente tem uma dúvida específica que não conseguimos responder por falta de acesso à informação necessária. Exemplos:
• Valor do processo.
• Solicitação de contato com o advogado.
• Cadastro de um novo processo.
• Detalhes importantes do processo aos quais não temos acesso (ex.: resultado de um laudo pericial).
• Dúvidas de clientes que não estão cadastrados no sistema.`,
    category: "Serviços"
  },
  {
    question: "O que é 'Disparos de Iniciais'?",
    answer: `Os "Disparos de Iniciais" são as primeiras mensagens enviadas pela IVi aos clientes. Nelas, apresentamos nosso serviço, explicamos como podemos ajudar com dúvidas sobre o processo e perguntamos se o cliente aceita receber atualizações. Caso o cliente aceite, iniciamos o monitoramento das novidades do processo.`,
    category: "Comunicação"
  },
  {
    question: "O que é 'Lembretes de Monitoramento'?",
    answer: `Os "Lembretes de Monitoramento" são mensagens enviadas mensalmente aos clientes que não tiveram novidades no processo durante o período. O objetivo é tranquilizá-los, informando que a IVi continua monitorando o processo e que o advogado está trabalhando no caso. Assim que surgir uma novidade relevante, o cliente será avisado imediatamente.`,
    category: "Comunicação"
  },
  {
    question: "Como cadastrar um cliente que já possui cadastro?",
    answer: `Se o cliente já está cadastrado, você pode adicionar um novo processo no nome dele de forma rápida e simples:
    1. Clique em "Adicionar um processo".
    2. Selecione o cliente desejado na lista.
    3. Preencha as informações do processo e finalize subindo o arquivo correspondente.`,
    category: "Clientes"
  },
  {
    question: "Onde recebo o secretariado simples?",
    answer: `O secretariado simples é enviado no email do escritório contratante. Também é possível solicitar um email específico para que o envio seja feito. Para isso, basta entrar em contato com seu gerente de contas e indicar o email desejado.`,
    category: "Serviços"
  },
  {
    question: "A IVi comunica todos os andamentos processuais?",
    answer: `A IVi não envia informações sem relevância jurídica ou que possam levar a interpretações equivocadas, como:
• Decurso de prazo, quando não há necessidade de manifestação do advogado.
• Andamentos genéricos como "juntada de petição" ou "juntada de documentos diversos".
• Novidades sem impacto relevante no caso, como a juntada de procuração.
• Decisões do advogado que devem ser tratadas diretamente com o cliente, como em casos de revelia em audiência.`,
    category: "Processos"
  },
  {
    question: "Onde faço o meu login?",
    answer: `O acesso à sua "Área do Cliente" é enviado pelo seu gerente de contas. Assim que o contrato com a IVi for fechado, o gerente entrará em contato para fornecer a senha correta.`,
    category: "Sistema"
  },
  {
    question: "É possível diferenciar o acesso do meu colaborador do meu próprio acesso?",
    answer: `No momento, ainda não temos essa funcionalidade disponível. No entanto, nosso time de tecnologia já está trabalhando para implementar essa opção em breve, garantindo mais praticidade para você.`,
    category: "Sistema"
  },
  {
    question: "Com quem devo falar sobre assuntos financeiros?",
    answer: `Para qualquer assunto financeiro, como solicitação de boletos, chave PIX, alterações de data de vencimento, mudanças na forma de pagamento ou negociações de débitos, entre em contato com a Gleizi, responsável pelo setor financeiro, pelos seguintes canais:

• E-mail: financeiro@ivijur.com.br
• Telefone: (31) 99603-9912`,
    category: "Financeiro"
  },
  {
    question: "Como funciona o atendimento humano da Ivi?",
    answer: "A IVi conta com um time de bacharéis em Direito para fazer a gestão das dúvidas dos clientes. Além disso, nosso atendimento humano está disponível para realizar atendimentos por áudio, caso o cliente seja analfabeto ou necessite de suporte nesse formato.",
    category: "Serviços"
  },
  {
    question: "O que é a 'Mensagem de Golpe'?",
    answer: "Sabemos que podem ocorrer tentativas de golpe contra os clientes, e a IVi está preparada para ajudar. Você pode contratar, de forma avulsa, o disparo de mensagens para reforçar os canais oficiais do escritório (informando quais telefones e e-mails que os clientes podem confiar). Esse tipo de comunicação fortalece a confiança dos clientes no escritório e funciona como um importante reforço educacional, ajudando a prevenir fraudes.",
    category: "Comunicação"
  }
] 