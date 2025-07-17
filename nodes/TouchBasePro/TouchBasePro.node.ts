import type {
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class TouchBasePro implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TouchbasePro',
		name: 'touchbasepro',
		icon: 'file:logo.svg',
		group: [],
		version: 1,
		description: 'Touchbase Pro Node',
		defaults: {
			name: 'TouchbasePro',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		requestDefaults: {
			baseURL: 'https://dummyjson.com/',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		usableAsTool: true,
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Transectional Email',
						value: 'transectionalEmail',
					},
				],
				default: 'transectionalEmail',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: {
					show: {
						resource: [
							'transectionalEmail',
						],
					},
				},
				options: [
					{
						name: 'Get',
						value: 'get',
						action: 'Get a random quote',
						description: 'Get a random quote',
						routing: {
							request: {
								method: 'GET',
								url: '/quotes/random',
							},
						},
					},
				],
				default: 'get',
			},
		],
	};
}
