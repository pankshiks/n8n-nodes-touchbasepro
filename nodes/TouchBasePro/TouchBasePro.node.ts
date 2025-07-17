import type { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

export class TouchBasePro implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TouchBasePro',
		name: 'touchbasepro',
		icon: 'file:logo.svg',
		group: [],
		version: 1,
		description: 'TouchBase Pro Node',
		defaults: {
			name: 'TouchBasePro',
		},
		credentials: [
			{
				name: 'touchBaseProApi',
				required: true,
			},
		],
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		requestDefaults: {
			baseURL: 'https://api.touchbasepro.io/email',
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
				options: [{ name: 'Transactional Email', value: 'transactionalEmail' }],
				default: 'transactionalEmail',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				displayOptions: { show: { resource: ['transactionalEmail'] } },
				options: [
					{
						name: 'Get All',
						value: 'getAll',
						action: 'Get all transactional emails',
						description: 'Retrieve list of smart emails',
						routing: {
							request: {
								method: 'GET',
								url: '/transactional/smartemails',
								qs: {
									page: '={{$parameter.page}}',
									pageSize: '={{$parameter.pageSize}}',
									sortBy: '={{$parameter.sortBy}}',
									sortDirection: '={{$parameter.sortDirection}}',
									status: '={{$parameter.status}}',
								},
							},
						},
					},
					{
						name: 'Create',
						value: 'create',
						action: 'Create smart email',
						description: 'Create a new smart email template',
						routing: {
							request: {
								method: 'POST',
								url: '/transactional/smartemails',
								body: {
									name: '={{$parameter.name}}',
									preheaderText: '={{$parameter.preheaderText}}',
									subject: '={{$parameter.subject}}',
									fromName: '={{$parameter.fromName}}',
									fromEmail: '={{$parameter.fromEmail}}',
									replyTo: '={{$parameter.replyTo}}',
									htmlUrl: '={{$parameter.htmlUrl}}',
									htmlContent: '={{$parameter.htmlContent}}',
								},
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get smart email by ID',
						description: 'Retrieve details of a smart email',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete smart email',
						description: 'Delete a smart email',
						routing: {
							request: {
								method: 'DELETE',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}',
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update smart email',
						description: 'Update an existing smart email',
						routing: {
							request: {
								method: 'PUT',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}',
								body: '={{$json}}',
							},
						},
					},
					{
						name: 'Activate',
						value: 'activate',
						action: 'Activate smart email',
						description: 'Activate a smart email',
						routing: {
							request: {
								method: 'PUT',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/activateemail',
							},
						},
					},
					{
						name: 'Stats Count',
						value: 'statsCount',
						action: 'Get smart email stats count',
						description: 'Get state counts for a smart email',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/stats',
							},
						},
					},
					{
						name: 'Get Messages',
						value: 'getMessages',
						action: 'Get messages of smart email',
						description: 'Retrieve messages of a smart email',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages',
								qs: {
									StartDate: '={{$parameter.StartDate}}',
									EndDate: '={{$parameter.EndDate}}',
									page: '={{$parameter.page}}',
									pageSize: '={{$parameter.pageSize}}',
									sortBy: '={{$parameter.sortByMessages}}',
									sortDirection: '={{$parameter.sortDirection}}',
									IncludeEventData: '={{$parameter.IncludeEventData}}',
								},
							},
						},
					},
					{
						name: 'Send',
						value: 'send',
						action: 'Send smart email message',
						description: 'Send a message via smart email',
						routing: {
							request: {
								method: 'POST',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages',
								body: '={{$json}}',
							},
						},
					},
					{
						name: 'Get Message',
						value: 'getMessage',
						action: 'Get sent message detail',
						description: 'Get detail of a sent message',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages/{{$parameter.msgId}}',
							},
						},
					},
					{
						name: 'Resend Message',
						value: 'resendMessage',
						action: 'Resend message',
						description: 'Resend a sent message',
						routing: {
							request: {
								method: 'POST',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages/{{$parameter.msgId}}',
							},
						},
					},
					{
						name: 'Get Message Status',
						value: 'getMessageStatus',
						action: 'Get message status',
						description: 'Retrieve status of a message',
						routing: {
							request: {
								method: 'GET',
								url: '=/transactional/smartemails/{{$parameter.smartEmailId}}/messages/{{$parameter.msgId}}/status',
							},
						},
					},
				],
				default: 'getAll',
			},

			// --- Operation-specific properties below ---
			// For Create
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},
			{
				displayName: 'Preheader Text',
				name: 'preheaderText',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},
			{
				displayName: 'Subject',
				name: 'subject',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},
			{
				displayName: 'From Name',
				name: 'fromName',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},
			{
				displayName: 'From Email',
				name: 'fromEmail',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},
			{
				displayName: 'Reply To',
				name: 'replyTo',
				type: 'string',
				required: true,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},
			{
				displayName: 'HTML URL',
				name: 'htmlUrl',
				type: 'string',
				required: false,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},
			{
				displayName: 'HTML Content',
				name: 'htmlContent',
				type: 'string',
				required: false,
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['create'] } },
			},

			// For all operations that require Smart Email ID
			{
				displayName: 'Smart Email ID',
				name: 'smartEmailId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['transactionalEmail'],
						operation: [
							'get',
							'delete',
							'update',
							'activate',
							'statsCount',
							'getMessages',
							'send',
							'getMessage',
							'resendMessage',
							'getMessageStatus',
						],
					},
				},
			},

			// For getMessages
			{
				displayName: 'Start Date',
				name: 'StartDate',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['getMessages'] } },
			},
			{
				displayName: 'End Date',
				name: 'EndDate',
				type: 'string',
				default: '',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['getMessages'] } },
			},
			{
				displayName: 'Page',
				name: 'page',
				type: 'number',
				default: 1,
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getMessages', 'getAll'] },
				},
			},
			{
				displayName: 'Page Size',
				name: 'pageSize',
				type: 'number',
				default: 100,
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getMessages', 'getAll'] },
				},
			},
			{
				displayName: 'Sort By',
				name: 'sortBy',
				type: 'options',
				options: [
					{ name: 'name', value: 'name' },
					{ name: 'date', value: 'date' },
				],
				default: 'name',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getAll'] },
				},
			},
			{
				displayName: 'Sort By',
				name: 'sortByMessages',
				type: 'options',
				options: [
					{ name: 'email', value: 'email' },
					{ name: 'date', value: 'date' },
				],
				default: 'email',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getMessages'] },
				},
			},
			{
				displayName: 'Sort Direction',
				name: 'sortDirection',
				type: 'options',
				options: [
					{ name: 'asc', value: 'asc' },
					{ name: 'desc', value: 'desc' },
				],
				default: 'asc',
				displayOptions: {
					show: { resource: ['transactionalEmail'], operation: ['getMessages', 'getAll'] },
				},
			},
			{
				displayName: 'Include Event Data',
				name: 'IncludeEventData',
				type: 'options',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'Click', value: 'click' },
					{ name: 'All', value: 'all' },
					{ name: 'None', value: 'none' },
				],
				default: 'all',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['getMessages'] } },
			},

			// For getMessage, resendMessage, getMessageStatus
			{
				displayName: 'Message ID',
				name: 'msgId',
				type: 'string',
				required: true,
				default: '',
				displayOptions: {
					show: {
						resource: ['transactionalEmail'],
						operation: ['getMessage', 'resendMessage', 'getMessageStatus'],
					},
				},
			},

			// For getAll
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Active', value: 'active' },
					{ name: 'Draft', value: 'draft' },
				],
				default: 'all',
				displayOptions: { show: { resource: ['transactionalEmail'], operation: ['getAll'] } },
			},
		],
	};
}
