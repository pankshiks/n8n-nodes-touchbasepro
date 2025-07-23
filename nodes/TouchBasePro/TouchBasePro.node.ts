import {
	INodeExecutionData,
	INodeInputConfiguration,
	INodeOutputConfiguration,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	IExecuteFunctions,
} from 'n8n-workflow';
import {
	sendSmartEmail,
	getSmartEmailOptions,
	getMergeFieldOptions,
} from './operations/TransactionalEmail';
import { createList } from './operations/List';
import {
	addOrUpdateSubscriber,
	getCustomFields,
	getSubscriberOptions,
} from './operations/Subscriber';
import { getListOptions } from './operations/List';
import { addToSuppressionList, getSuppressionListOptions, getSuppressionEmailsOptions } from './operations/Suppression';

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
				options: [{ name: 'Send Transactional Smart Email', value: 'sendSmartEmail' }],
				default: '', // No automatic selection
			},
			// Operation for Subscriber Actions (moved from List)
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				typeOptions: { searchable: true },
				displayOptions: {
					show: { category: ['subscriber'] },
				},
				options: [{ name: 'Add/Update Subscriber', value: 'addOrUpdateSubscriber' }],
				default: '',
			},
			{
				displayName: 'List',
				name: 'listId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getListOptions',
					searchable: true,
					refreshOnChange: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: { category: ['subscriber'], operation: ['addOrUpdateSubscriber'] },
				},
			},
			{
				displayName: 'Action',
				name: 'subOperation',
				type: 'options',
				options: [
					{ name: 'Add', value: 'add' },
					{ name: 'Update', value: 'update' },
				],
				default: 'add',
				displayOptions: {
					show: { category: ['subscriber'], operation: ['addOrUpdateSubscriber'] },
				},
			},
			// Then fields for add vs. update:
			{
				displayName: 'Email',
				name: 'email',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						category: ['subscriber'],
						operation: ['addOrUpdateSubscriber'],
						subOperation: ['add'],
					},
				},
			},
			{
				displayName: 'Current Email',
				name: 'currentEmail',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getSubscriberOptions',
					loadOptionsDependsOn: ['listId'],
					searchable: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: {
						category: ['subscriber'],
						operation: ['addOrUpdateSubscriber'],
						subOperation: ['update'],
					},
				},
			},
			{
				displayName: 'New Email',
				name: 'email',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						category: ['subscriber'],
						operation: ['addOrUpdateSubscriber'],
						subOperation: ['update'],
					},
				},
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						category: ['subscriber'],
						operation: ['addOrUpdateSubscriber'],
					},
				},
			},
			{
				displayName: 'Re‑subscribe',
				name: 'reSubscribe',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						category: ['subscriber'],
						operation: ['addOrUpdateSubscriber'],
					},
				},
			},
			{
				displayName: 'Consent To Track',
				name: 'consentToTrack',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						category: ['subscriber'],
						operation: ['addOrUpdateSubscriber'],
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'Active' },
					{ name: 'Unsubscribed', value: 'Unsubscribed' },
					{ name: 'Bounced', value: 'Bounced' },
					{ name: 'Unconfirmed', value: 'Unconfirmed' },
					{ name: 'Deleted', value: 'Deleted' },
				],
				default: 'Active',
				displayOptions: {
					show: {
						category: ['subscriber'],
						operation: ['addOrUpdateSubscriber'],
					},
				},
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: {
						category: ['subscriber'],
						operation: ['addOrUpdateSubscriber'],
					},
				},
				default: {},
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{
								displayName: 'Field',
								name: 'fieldMeta',
								type: 'options',
								typeOptions: {
									loadOptionsMethod: 'getCustomFields',
									loadOptionsDependsOn: ['listId'],
								},
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
								description:
									"Enter the value for the selected field (format must match the field's type)",
							},
						],
					},
				],
			},

			// Operation for Suppression Actions (commented out)
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				typeOptions: { searchable: true },
				displayOptions: {
					show: { category: ['suppression'] },
				},
				options: [
					{ name: 'Add Email(s) to Suppression List', value: 'addToSuppressionList' },
				],
				default: '',
			},
			{
				displayName: 'List',
				name: 'suppressionListId',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getSuppressionListOptions',
					searchable: true,
					refreshOnChange: true,
				},
				default: '',
				required: true,
				displayOptions: {
					show: { category: ['suppression'], operation: ['addToSuppressionList'] },
				},
			},
			{
				displayName: 'Emails to Suppress',
				name: 'suppressionEmails',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getSuppressionEmailsOptions',
					loadOptionsDependsOn: ['suppressionListId'],
					searchable: true,
				},
				default: [],
				required: true,
				displayOptions: {
					show: { category: ['suppression'], operation: ['addToSuppressionList'] },
				},
			},
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
						operation: ['sendSmartEmail'],
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
						operation: ['sendSmartEmail'],
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
						operation: ['sendSmartEmail'],
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
						operation: ['sendSmartEmail'],
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
						operation: ['sendSmartEmail'],
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
						operation: ['sendSmartEmail'],
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
						operation: ['sendSmartEmail'],
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
						operation: ['sendSmartEmail'],
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
						operation: ['sendSmartEmail'],
					},
				},
				default: true,
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				typeOptions: { searchable: true },
				displayOptions: {
					show: { category: ['list'] },
				},
				options: [{ name: 'Create List', value: 'createList' }],
				default: '',
			},
			{
				displayName: 'List Name',
				name: 'listName',
				type: 'string',
				required: true,
				displayOptions: {
					show: { category: ['list'], operation: ['createList'] },
				},
				default: '',
			},
			{
				displayName: 'Custom Fields',
				name: 'customFields',
				type: 'fixedCollection',
				typeOptions: { multipleValues: true },
				displayOptions: {
					show: { category: ['list'], operation: ['createList'] },
				},
				default: {},
				options: [
					{
						displayName: 'Field',
						name: 'field',
						values: [
							{
								displayName: 'Field Name',
								name: 'fieldName',
								type: 'string',
								required: true,
								default: '',
							},
							{
								displayName: 'Field Type',
								name: 'fieldType',
								type: 'options',
								required: true,
								default: 'text',
								options: [
									{ name: 'Text', value: 'text' },
									{ name: 'Number', value: 'number' },
									{ name: 'Date', value: 'date' },
									{ name: 'Select One', value: 'select' },
									{ name: 'Select Many', value: 'multiSelect' },
								],
							},
							{ displayName: 'Required', name: 'required', type: 'boolean', default: false },
							{ displayName: 'Visible', name: 'visible', type: 'boolean', default: true },
							{
								displayName: 'Unique Identifier',
								name: 'uniqueId',
								type: 'boolean',
								required: false,
								default: false,
							},
							{
								displayName: 'Options',
								name: 'options',
								type: 'string',
								default: '',
								description: 'Comma-separated options (for Select One/Many)',
							},
						],
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Mapping of category and operation to functions
		const operationFunctionMap: { [key: string]: { [key: string]: Function } } = {
			transactionalEmail: {
				sendSmartEmail: sendSmartEmail,
			},
			subscriber: {
				addOrUpdateSubscriber: addOrUpdateSubscriber,
			},
			list: {
				createList: createList,
			},
			suppression: {
				addToSuppressionList: addToSuppressionList,
			},
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
					{ itemIndex: i },
				);
			}
		}

		return [returnData];
	}

	methods = {
		loadOptions: {
			getSmartEmailOptions,
			getMergeFieldOptions,
			getListOptions,
			getCustomFields,
			getSubscriberOptions,
			getSuppressionListOptions,
			getSuppressionEmailsOptions,
		},
	};
}
