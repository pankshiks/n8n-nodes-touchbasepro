import {
	INodeExecutionData,
	INodeInputConfiguration,
	INodeOutputConfiguration,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	IExecuteFunctions
} from 'n8n-workflow';
import {
	sendSmartEmail,
	getSmartEmailOptions,
	getMergeFieldOptions,
} from './operations/TransactionalEmail';
// import { createList } from './operations/List';
// import { addOrUpdateSubscriber } from './operations/Subscriber';
// import { addToSuppressionList } from './operations/Suppression';

export class TouchBasePro implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TouchBasePro',
		name: 'touchBasePro',
		icon: 'file:logo.svg',
		group: ['output'],
		version: 1,
		description: 'Interact with TouchBasePro API',
		subtitle: '={{$parameter["operation"] || "Select an Operation"}}',
		defaults: {
			name: 'TouchBasePro',
		},
		credentials: [
			{
				name: 'touchBaseProApi',
				required: true,
			},
		],
		inputs: ['main'] as (NodeConnectionType | INodeInputConfiguration)[],
		outputs: ['main'] as (NodeConnectionType | INodeOutputConfiguration)[],
		properties: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'options',
				typeOptions: { searchable: true },
				options: [
					{ name: 'Transactional Email Actions', value: 'transactionalEmail' },
					{ name: 'List Actions', value: 'list' },
					{ name: 'Subscriber Actions', value: 'subscriber' },
					{ name: 'Suppression Actions', value: 'suppression' },
				],
				default: '', // No automatic selection
				description: 'Select the category of actions to perform',
			},
			// Operation for Transactional Email Actions
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				typeOptions: { searchable: true },
				displayOptions: {
					show: { category: ['transactionalEmail'] },
				},
				options: [
					{ name: 'Send Transactional Smart Email', value: 'Send Smart Email' },
				],
				default: '', // No automatic selection
			},
			// Operation for List Actions (commented out)
			/*
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				typeOptions: { searchable: true },
				displayOptions: {
					show: { category: ['list'] },
				},
				options: [
					{ name: 'Create List', value: 'Create List' },
				],
				default: '',
			},
			*/
			// Operation for Subscriber Actions (commented out)
			/*
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				typeOptions: { searchable: true },
				displayOptions: {
					show: { category: ['subscriber'] },
				},
				options: [
					{ name: 'Add/Update Subscriber', value: 'Add/Update Subscriber' },
				],
				default: '',
			},
			*/
			// Operation for Suppression Actions (commented out)
			/*
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				typeOptions: { searchable: true },
				displayOptions: {
					show: { category: ['suppression'] },
				},
				options: [
					{ name: 'Add to Suppression List', value: 'Add to Suppression List' },
				],
				default: '',
			},
			*/
			// Smart Email Template dropdown
			{
				displayName: 'Smart Email Template',
				name: 'smartEmailId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getSmartEmailOptions',
					searchable: true,
				},
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: '',
				required: true,
				description: 'Choose from your TouchBasePro smart transactional email templates',
			},
			// Recipients
			{
				displayName: 'To',
				name: 'to',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: {},
				options: [
					{
						name: 'recipients',
						displayName: 'Recipients',
						values: [
							{ displayName: 'Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Email', name: 'email', type: 'string', default: '' },
						],
					},
				],
			},
			// CC recipients
			{
				displayName: 'CC',
				name: 'cc',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: {},
				options: [
					{
						name: 'recipients',
						displayName: 'CC Recipients',
						values: [
							{ displayName: 'Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Email', name: 'email', type: 'string', default: '' },
						],
					},
				],
			},
			// BCC recipients
			{
				displayName: 'BCC',
				name: 'bcc',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: {},
				options: [
					{
						name: 'recipients',
						displayName: 'BCC Recipients',
						values: [
							{ displayName: 'Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Email', name: 'email', type: 'string', default: '' },
						],
					},
				],
			},
			// Attachments (not implemented)
			{
				displayName: 'Attachments',
				name: 'attachments',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: {},
				options: [
					{
						name: 'attachments',
						displayName: 'Attachments',
						values: [
							{ displayName: 'Name', name: 'name', type: 'string', default: '' },
							{ displayName: 'Type', name: 'type', type: 'string', default: '' },
							{ displayName: 'Data', name: 'data', type: 'string', default: '' },
						],
					},
				],
			},
			// Merge Fields
			{
				displayName: 'Merge Fields',
				name: 'mergeFields',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: {},
				options: [
					{
						name: 'field',
						displayName: 'Field',
						values: [
							{
								displayName: 'Field Name',
								name: 'fieldName',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getMergeFieldOptions',
									loadOptionsDependsOn: ['smartEmailId'],
								},
								default: '',
							},
							{
								displayName: 'Value',
								name: 'fieldValue',
								type: 'string',
								default: '',
							},
						],
					},
				],
			},
			// Flags (not implemented)
			{
				displayName: 'Allow Tracking',
				name: 'allowTracking',
				type: 'boolean',
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: true,
			},
			{
				displayName: 'Ignore Suppression List',
				name: 'ignoreSuppressionList',
				type: 'boolean',
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: true,
			},
			{
				displayName: 'Add Recipient To List',
				name: 'addRecipientToList',
				type: 'boolean',
				displayOptions: {
					show: {
						category: ['transactionalEmail'],
						operation: ['Send Smart Email'],
					},
				},
				default: true,
			},
			// Test Input field for other categories
			{
				displayName: 'Test Input',
				name: 'testInput',
				type: 'string',
				displayOptions: {
					show: {
						category: ['list', 'subscriber', 'suppression'],
					},
				},
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Mapping of category and operation to functions
		const operationFunctionMap: { [key: string]: { [key: string]: Function } } = {
			'transactionalEmail': {
				'Send Smart Email': sendSmartEmail,
			},
			// Uncomment and add mappings as needed
			// 'list': {
			// 	'Create List': createList,
			// },
			// 'subscriber': {
			// 	'Add/Update Subscriber': addOrUpdateSubscriber,
			// },
			// 'suppression': {
			// 	'Add to Suppression List': addToSuppressionList,
			// },
		};

		for (let i = 0; i < items.length; i++) {
			const category = this.getNodeParameter('category', i) as string;
			const operation = this.getNodeParameter('operation', i) as string;

			const func = operationFunctionMap[category]?.[operation];
			if (func) {
				const response = await func.call(this, i);
				returnData.push({ json: response });
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`Operation "${operation}" not implemented for category "${category}"`,
					{ itemIndex: i }
				);
			}
		}

		return [returnData];
	}

	methods = {
		loadOptions: {
			getSmartEmailOptions,
			getMergeFieldOptions,
		},
	};
}