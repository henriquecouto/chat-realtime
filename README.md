# MW Chat

A aplicação faz uso do <font size=5>*Express*</font>, para o gerenciamento de end-points, do <font size=5>*Socket.io*</font>, para as conexões em tempo real, e do <font size=5>*MongoDB*</font>, para armazenar as informações. 

A pasta <font size=5>*backend*</font> contém o código que faz todo o gerenciamento dos dados, enquanto a pasta <font size=5>*frontend*</font> possui um exemplo de implementação para uso da ferramenta, feito usando <font size=5>*HTML*</font>, <font size=5>*CSS*</font>, <font size=5>*Javascript*</font> e o <font size=5>*socket.io-client*</font>.

# End-points
Essa seção descreve todos os end-points existentes na aplicação

## */users* 
- **POST** */users* &rarr; Criar novo usuário.
> ### Parâmetros
> - *(String) name* &rarr; Nome do usuário a ser cadastrado. 

- **GET** */users* &rarr; Carregar os usuários cadastrados

## */activities*
- **GET** */activities/{userId}* &rarr; Carregar todas as atividades de um usuário específico.
## */messages*
- **POST** */* &rarr; Carregar todas as mensagens entre dois usuários. 
> ### Parâmetros
> - *(String) userId* &rarr; O id do usuário que está realizando a requisição;
> - *(String) partnerId* &rarr; O id do usuário parceiro.
## */groups*
- **POST** */groups* &rarr; Criar um novo grupo.
> ### Parâmetros
> - *(String) name* &rarr; Nome do grupo a ser cadastrado;
> - *(String) creator* &rarr; Id do usuário criador do grupo;
> - *(Array) users* &rarr; Lista de usuários que serão adicionados ao grupo;

- **PUT** */groups* &rarr; Atualizar algum grupo já existente.
> ### Parâmetros
> - *(String) id* &rarr; Id do grupo a ser atualizado;
> - **[opcional]** *(String) name* &rarr; Nome do grupo a ser cadastrado;
> - **[opcional]** *(Array) users* &rarr; Lista de usuários que serão adicionados ao grupo.

- **GET** */groups/{userId}* &rarr; Carregar os grupos em que um usuário está inserido.
- **GET** */groups/{groupId}/info* &rarr; Carregar dos dados do grupo
- **GET** */groups/{groupId}/messages* &rarr; Carregar as mensagens de um grupo específico.

# Socket.io

Essa seção descreve os eventos que devem ser utilizados quando se deseja atualizar dados em tempo real. Ao se **"cadastrar"** em um evento a aplicação passa a receber tudo relacionado a esse evento.

## Conexão
A conexão deve ser realizada através da biblioteca **Cliente** do *Socket.io*
> ### Parâmetros
> - *(String) id* &rarr; Id do usuário que está tentando se conectar;

> ### Exemplo
> ```javascript
> const baseUrl = "http://localhost:3030";
> const socket = io(baseUrl, {
> 	query: { _id: userId },
> });
> ```

## Interações
Existem dois tipos de interação: 
- ***emit*** &rarr; utilizada para transmitir uma mensagem em um evento;
- ***on*** &rarr; utilizada para receber o que for transmitido em algum evento.

## Atividades
- **emit** *update activity* &rarr; Atualizar a atividade que está sendo realizada por um usuário.
> ### Parâmetros
> - *(String) userId* &rarr; Id do usuário;
> - *(String) activity* &rarr; Nome da atividade;
> ### Exemplo
> ```javascript
> socket.emit("update activity", userId, activity);
> ```

- **emit** *receive activities* &rarr; Abrir a conexão para receber as atividades de um usuário.
> ### Parâmetros
> - *(String) partnerId* &rarr; Id do usuário do qual se deseja receber as atividades;
> ### Exemplo
> ```javascript
> socket.emit("receive activities", parterId);
> ```

- **on** *update activities* &rarr; Receber as atividades de um usuário cadastrado.

> ### Pré-requisitos
> **emit** *receive activities*
> ### Exemplos
> - Chamada do evento
> ```javascript
> socket.on("update activities", async ({ userId, activity }) => {
> 	console.log(userId, activity)
> })
> ```
> - Resposta
> ```json
> {
> 	"5efb390fff58a54ca1cf676e": {
>		"socket": "emRjoWCa_hGRc-WaAAAF",
>		"status": "online",
>		"_id": "5efb390fff58a54ca1cf676e",
>		"name": "Henrique Couto",
>		"registrationDate": "2020-06-30T13:07:27.121Z"
>	},
>	"5efb3914ff58a54ca1cf676f": {
>		"socket": "7OQ8H6g6_6mGdg-aAAAG",
>		"status": "online",
>		"_id": "5efb3914ff58a54ca1cf676f",
>		"name": "Neo Ferreira",
>		"registrationDate": "2020-06-30T13:07:32.297Z"
>	}
> }
> ```

## Conversas Privadas

- **emit** *open chat* &rarr; Abrir a conexão para receber mensagens de um usuário.
> ### Parâmetros
> - *(String) partnerId* &rarr; Id do usuário;
> ### Exemplo
> ```javascript
> socket.emit("open chat", partnerId);
> ```

- **emit** *send message* &rarr; Enviar mensagem para um usuário.
> ### Parâmetros
> - *(String) partnerId* &rarr; Id do usuário que receberá a mensagem;
> - *(String) message* &rarr; Mensagem a ser enviada;
> ### Exemplo
> ```javascript
> socket.emit("send message", partnerId, message);
> ```

- **on** *update messages* &rarr; Receber as mensagens de uma conversa ativa com outro usuário.

> ### Pré-requisitos
> - **emit** *open chat*
> ### Exemplos
> - Chamada do evento
> ```javascript
> socket.on("update messages", async ({ userId, message, type }) => {
>   // O atributo type pode conter um desses valores: "sended", "received"
>	// O atributo userId refere-se ao id do parceiro da conversa
> 	console.log(userId, message, type)
> })
> ```
> - Resposta
> ```json
> {
>	"type": "sended",
>	"userId": "5efb3914ff58a54ca1cf676f",
>	"message": {
>		"_id": "5efb3dddff58a54ca1cf6783",
>		"emitter": "5efb390fff58a54ca1cf676e",
>		"receptor": "5efb3914ff58a54ca1cf676f",
>		"text": "has",
>		"registrationDate": "2020-06-30T13:27:57.962Z"
>	}
> }
> ```

## Grupos

- **emit** *open group* &rarr; Abrir a conexão para receber mensagens de um grupo.
> ### Parâmetros
> - *(String) groupId* &rarr; Id do grupo;
> ### Exemplo
> ```javascript
> socket.emit("open group", groupId);
> ```

- **emit** *send group message* &rarr; Enviar mensagem para um grupo.
> ### Parâmetros
> - *(String) groupId* &rarr; Id do grupo;
> - *(String) message* &rarr; Mensagem a ser enviada;
> ### Exemplo
> ```javascript
> socket.emit("send group message", groupId, message);
> ```

- **emit** *update groups* &rarr; Informar que os usuários devem receber uma atualização dos grupos.
> ### Exemplo
> ```javascript
> socket.emit("update groups");
> ```

- **on** *update groups* &rarr; Indicar que a lista de grupos deve ser atualizada.

> ### Exemplo
> - Chamada do evento
> ```javascript
> socket.on("update groups", async () => {
>   // Deve ser executada alguma função que carrega os grupos em que o usuário está inserido
> })
> ```

- **on** *update group messages* &rarr; Receber as mensagens de uma conversa de grupo ativa.

> ### Pré-requisitos
>	- **emit** *open group*
> ### Exemplos
> - Chamada do evento
> ```javascript
> socket.on("update group messages", async ({ groupId, message, type, emitter }) => {
>   // O atributo type pode conter um desses valores: "sended", "received"
> 	console.log(userId, message, type)
> })
> ```
> - Resposta
> ```json
> {
>	"type": "sended",
>	"groupId": "5efb3fcdff58a54ca1cf6784",
>	"message": {
>		"_id": "5efb429aff58a54ca1cf6786",
>		"emitter": "5efb390fff58a54ca1cf676e",
>		"group": "5efb3fcdff58a54ca1cf6784",
>		"text": "opj",
>		"registrationDate": "2020-06-30T13:48:10.109Z"
>	}
> }
> ```

- **emit** *update group users* &rarr; Informar que os usuários devem receber uma atualização dos grupos.
> ### Parâmetros
> - *(String) groupId* &rarr; Id do grupo;
> ### Exemplo
> ```javascript
> socket.emit("update groups", groupId);
> ```

- **on** *update group users* &rarr; Indicar que a lista de usuários de uma conversa de grupo ativa deve ser atualizada.

> ### Exemplo
> - Chamada do evento
> ```javascript
> socket.on("update group users", async (groupId) => {
>   // Deve ser executada alguma função que carrega os usuários do grupo
> 	console.log(groupId)
> })
> ```

##  Usuários
- **on** *update users* &rarr; Receber a lista de usuários para saber quem está *online* e *offline* e a atividade que está sendo executada, se houver.
> ### Exemplos
> - Chamada do evento
> ```javascript
> socket.on("update users", async (users) => {
> 	console.log(users)
> })
> ```
> - Resposta
> ```json
> {
> 	"5efb390fff58a54ca1cf676e": {
>		"socket": "emRjoWCa_hGRc-WaAAAF",
>		"status": "online",
>		"_id": "5efb390fff58a54ca1cf676e",
>		"name": "Henrique Couto",
>		"registrationDate": "2020-06-30T13:07:27.121Z"
>	},
>	"5efb3914ff58a54ca1cf676f": {
> 		activity: "Criando Matéria"
>		"socket": "7OQ8H6g6_6mGdg-aAAAG",
>		"status": "online",
>		"_id": "5efb3914ff58a54ca1cf676f",
>		"name": "Neo Ferreira",
>		"registrationDate": "2020-06-30T13:07:32.297Z"
>	}
> }
> ```




