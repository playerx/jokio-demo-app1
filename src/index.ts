import { run } from 'jokio'
import { graphql, LocalSchema } from 'jokio-graphql';
import { db } from './db';

const caseSchema: LocalSchema = {
	typeDefs: `
    extend type Query {
	  allCases: [ICase]
	}

	interface ICase {
		number: String
		type: String
	}

	type Case implements ICase {
		number: String
		type: String
	}
  `,
	resolvers: {
		Query: {
			allCases: () => db.Cases
		},
		ICase: {
			__resolveType(obj, context, info) {
				if (obj.money) {
					return 'SocialCase';
				}

				if (obj.items) {
					return 'ConstructionCase';
				}

				return null;
			},
		}
	}
}


const socialSchema: LocalSchema = {
	typeDefs: `
    extend type Query {
		allSocialCases: [SocialCase]
	}

	type SocialCase implements ICase {
		number: String
		type: String
		money: Float
	}
  `,
	resolvers: {
		Query: {
			allSocialCases: () => db.Cases.filter(x => x.type === '1')
		}
	}
}


const constructionSchema: LocalSchema = {
	typeDefs: `
    extend type Query {
		allConstructionCases: [ConstructionCase]
	}

	type ConstructionCase implements ICase {
		number: String
		type: String
		items(date: Int): [Item]
	}

	type Item {
		id: ID
		name: String
		case: ConstructionCase
	}
  `,
	resolvers: {
		Query: {
			allConstructionCases: () => db.Cases.filter(x => x.type === '2')
		},
		ConstructionCase: {
			items: (obj, props) => [{ id: 1, name: 'ezeki' + props.date }]
		},
		Item: {
			case: (obj, props, context) => db.Cases[0]
		}
	}
}


const localSchemas = [
	caseSchema,
	socialSchema,
	constructionSchema
]


run(
	graphql({ localSchemas })
)
