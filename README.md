# Parking-lot API
Parking-lot.api é uma API de serviço de controle de estacionamento para empresas.

## Tecnologias usadas
- [TypeScript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [TypeORM](https://typeorm.io/)
- [MySQL]()
- [Jest]()
- [class-validator](https://github.com/typestack/class-validator)

## Uso
Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina antes de prosseguir.

1. Clone o repositório:
```
git clone https://github.com/anti-duhring/parking-lot.api.git
```
2. Navegue até o diretório do projeto:
```
cd <NOME_DO_DIRETÓRIO>
```
3. Crie um arquivo .env:
Na raiz do projeto, crie um arquivo chamado .env.
Abra o arquivo .env em um editor de texto e defina as variáveis de ambiente necessárias.
```
DB_HOST=mysql
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=parking_dev

JWT_SECRET_KEY=GFncQO5wrS
```
4. Inicie os contêineres do Docker:
```
docker-compose up --build
```
5. Acesse a API:
Com os contêineres em execução, a API estará disponível em http://localhost:3000.

## Entidades
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/cm0mrmysulsfkq0b7jhy.png)

## Rotas 
- `localhost/api`: URL Base.

### ``/auth/signup`` - Cadastra uma nova empresa no sistema
- `POST`: Cadastra uma nova empresa no sistema
    - Body:
        ```json
        {
            "name": "Baz",
            "password": "123456789",
            "cnpj": "12345678912341",
            "address": "Rua Foo",
            "phone": "88221999",
            "parkingSpots": {
                "car": 40, // Vagas para carro
                "motocycle": 50  // Vagas para moto
            }
        }
        ```
    - Retorno:
        ```javascript
        {
            company: DADOS_DA_EMPRESA,
            accessToken: TOKEN_DE_ACESSO,
        };
        ```

### ``/auth/signin`` - Autentica a empresa
- `POST`: Autentica a empresa
    - Body:
        ```json
        {
            "cnpj": "12345678912341",
            "password": "123456789"
        }
        ```
    - Retorno:
        ```javascript
        {
            company: DADOS_DA_EMPRESA,
            accessToken: TOKEN_DE_ACESSO,
        };
        ```

### ``/company/:id`` - Gerencia dados da empresa
- `GET`: Obtém os dados de uma empresa
    - Retorno:
        ```javascript
        {
            id: 'UUID',
            name: 'Company A',
            cnpj: '123456789',
            password: 'XXXXXXXX',
            address: '123 Street',
            phone: '1234567890',
            createdAt: "2023-05-22T20:41:26.833Z",
            deletedAt: null,
            updatedAt: "2023-05-22T20:41:26.833Z",
            parkingLot: null,
            vehicles: [],
        };
        ```
- `PUT`: Atualiza os dados de uma empresa
    - `Requer token`
    - Body: 
        ```json
        {
            "name": "Baz",
            "cnpj": "12345678912341",
            "address": "Rua Foo",
            "phone": "88221999",
            "parkingSpots": {
                "car": 40, // Vagas para carro
                "motocycle": 50  // Vagas para moto
            }
        }
        ```
    - Retorno:
        ```javascript
        {
            id: 'UUID',
            name: 'Baz',
            cnpj: '12345678912341',
            address: 'Rua Foo',
            phone: '88221999',
            createdAt:"2023-05-22T20:41:26.833Z",
            deletedAt: null,
            updatedAt: "2023-05-22T20:41:26.833Z",
            parkingLot: null,
            vehicles: [],
        };
        ```
- `DELETE`: Deleta uma empresa
    - `Requer token`
    - Retorno:
        ```
        ```

### ``/parking-lot/:id`` - Gerencia dados de um estacionamento
- `GET`: Obtém os dados de um estacionamento
    - Retorno:
        ```javascript
        {
             id: 'UUID',
            company: 'DADOS_DA_EMPRESA',
            totalCarSpots: 10,
            totalMotorcycleSpots: 20,
            totalSpots: 30,
            parkingEvents: [],
            createdAt: "2023-05-22T20:41:26.833Z",
            updatedAt: "2023-05-22T20:41:26.833Z",
            deletedAt: null,
            avaliableCarSpots: 10,
            avaliableMotorcycleSpots: 20,
            totalAvaliableSpots: 30,
        };
        ```
- `PUT`: Atualiza os dados de um estacionamento
    - `Requer token`
    - Body:
        ```javascript
        {
            totalCarSpots: 15,
        };
        ```
    - Retorno:
        ```javascript
        {
            id: 'UUID',
            company: 'DADOS_DA_EMPRESA',
            totalCarSpots: 15,
            totalMotorcycleSpots: 20,
            totalSpots: 35,
            parkingEvents: [],
            createdAt: "2023-05-22T20:41:26.833Z",
            updatedAt: "2023-05-22T20:41:26.833Z",
            deletedAt: null,
            avaliableCarSpots: 15,
            avaliableMotorcycleSpots: 20,
            totalAvaliableSpots: 35,
        };
        ```
- `DELETE`: Deleta um estacionamento
    - `Requer token`
    - Retorno:
        ```
        ```
### ``/vehicle`` - Gerencia dados de um veículo
- `POST`: Cria um veículo
    - Body: 
        ```javascript
        {
            "brand": "Ford",
            "model": "Fiesta",
            "color": "white",
            "plate": "HRQ-3171",
            "type": "car",
            "companyId": "{{COMPANY_ID}}"
        }
        ```
    - Retorno:
        ```javascript
        {
            "model": "Fiesta",
            "brand": "Ford",
            "color": "white",
            "plate": "HRQ-3171",
            "type": "car",
            "company": 'DADOS_DA_EMPRESA',
            "deletedAt": null,
            "id": "UUID",
            "createdAt": "2023-05-22T20:41:26.833Z",
            "updatedAt": "2023-05-22T20:41:26.833Z"
        }
        ```
### ``/vehicle/:id`` - Gerencia dados de um veículo
- `PUT`: Atualiza um veículo
    - `Requer token`
    - Body: 
        ```javascript
        {
            "brand": "Ferrari",
        }
        ```
    - Retorno:
        ```javascript
        {
            "model": "Fiesta",
            "brand": "Ferrari",
            "color": "white",
            "plate": "HRQ-3171",
            "type": "car",
            "company": 'DADOS_DA_EMPRESA',
            "deletedAt": null,
            "id": "UUID",
            "createdAt": "2023-05-22T20:41:26.833Z",
            "updatedAt": "2023-05-22T20:41:26.833Z"
        }
        ```
- `GET`: Obtém dados de um veículo
    - Retorno:
        ```javascript
        {
            "model": "Fiesta",
            "brand": "Ford",
            "color": "white",
            "plate": "HRQ-3171",
            "type": "car",
            "company": 'DADOS_DA_EMPRESA',
            "deletedAt": null,
            "id": "UUID",
            "createdAt": "2023-05-22T20:41:26.833Z",
            "updatedAt": "2023-05-22T20:41:26.833Z"
        }
        ```
- `DELETE`: Deleta um veículo
    - `Requer token`
    - Retorno:
        ```
        ```
### ``/parking-event/entry`` - Cadastra uma entrada no estacionamento
- `POST`: Cadastra uma entrada no estacionamento
    - `Requer token`
    - Body: 
        ```javascript
       {
            "parkingLotId": "{{PARKING_LOT_ID}}",
            "vehicleId": "{{VEHICLE_ID}}",
            "vehicleType": "car"
        }
        ````
    - Retorno:
        ```javascript
        {
            "vehicleType": "car",
            "dateTimeEntry": "2023-05-22T17:47:21.313Z",
            "parkingLot": 'DADOS_DO_ESTACIONAMENTO',
            "vehicle": 'DADOS_DO_VEICULO',
            "dateTimeExit": null,
            "id": "UUID"
        }
        ```

### ``/parking-event/exit/:id`` - Cadastra uma saída do estacionamento
- `PUT`: Cadastra uma saída do estacionamento
    - `Requer token`
    - Retorno:
        ```javascript
        {
            "id": "UUID",
            "vehicleType": "car",
            "dateTimeEntry": "2023-05-22T17:47:21.000Z",
            "dateTimeExit": "2023-05-22T17:49:10.271Z"
        }
        ```