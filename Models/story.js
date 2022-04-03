const Ajv = require('ajv')
const ajv = new Ajv()


const storyModel = {
    type: 'object',
    properties: {
        Titulo: {type: 'string'},
        Escolhas: {
            type: 'array',
            minItems: 0,
            items:  {
                type: 'object',
                properties: {
                    id: {type: 'number'},
                    História: {type: 'string'},
                    Opções: {
                        type: 'array',
                        minItems: 0,
                        items: {
                            type: 'object',
                            properties: {
                                id: {type: 'number'},
                                Texto: {type: 'string'},
                                link: {type: ['number', 'null']}
                            }
                        }
                    }
                },
                required: ['id', 'História', 'Opções']
            }
        },
        owner: {type: 'number'}
    },
    required: ['Titulo', 'Escolhas']
}

const validate = ajv.compile(storyModel)

module.exports = { validate }